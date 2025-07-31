import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { generateEmbedding, generateResponse } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    // FIX 1: Await auth() call
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { videoId, question } = body;

    if (!videoId || !question) {
      return NextResponse.json({ error: 'Video ID and question are required' }, { status: 400 });
    }

    console.log(`Processing question for video ${videoId}: "${question}"`);

    // FIX 2: Check if video exists and has embeddings
    const video = await db.video.findFirst({
      where: {
        id: videoId,
        userId,
      },
      include: {
        _count: {
          select: {
            embeddings: true // Count embeddings
          }
        }
      }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // FIX 3: Check if video has embeddings
    console.log(`Video: ${video.title}`);
    console.log(`Embeddings count: ${video._count.embeddings}`);

    if (video._count.embeddings === 0) {
      return NextResponse.json({ 
        error: 'Video is still being processed. Please wait a moment and try again.' 
      }, { status: 400 });
    }

    // Generate embedding for the question
    console.log('Generating question embedding...');
    const questionEmbedding = await generateEmbedding(question);
    console.log('Question embedding generated');

    // FIX 4: Try with lower similarity threshold first
    let relevantChunks = await db.$queryRaw`
      SELECT "chunkText", "startTime", "endTime", "chunkIndex",
      1 - ("chunkEmbedding" <=> ${questionEmbedding}::vector) AS similarity
      FROM "VideoEmbedding"
      WHERE 1 - ("chunkEmbedding" <=> ${questionEmbedding}::vector) > 0.5
      AND "videoId" = ${videoId}
      ORDER BY similarity DESC
      LIMIT 8
    ` as any[];

    console.log(`Found ${relevantChunks.length} chunks with similarity > 0.5`);

    // FIX 5: If no results, try even lower threshold
    if (relevantChunks.length === 0) {
      console.log('Trying with similarity > 0.3...');
      relevantChunks = await db.$queryRaw`
        SELECT "chunkText", "startTime", "endTime", "chunkIndex",
        1 - ("chunkEmbedding" <=> ${questionEmbedding}::vector) AS similarity
        FROM "VideoEmbedding"
        WHERE 1 - ("chunkEmbedding" <=> ${questionEmbedding}::vector) > 0.3
        AND "videoId" = ${videoId}
        ORDER BY similarity DESC
        LIMIT 8
      ` as any[];
      
      console.log(`Found ${relevantChunks.length} chunks with similarity > 0.3`);
    }

    // FIX 6: If still no results, get top chunks regardless of similarity
    if (relevantChunks.length === 0) {
      console.log('No similar chunks found, getting top 5 chunks...');
      relevantChunks = await db.$queryRaw`
        SELECT "chunkText", "startTime", "endTime", "chunkIndex",
        1 - ("chunkEmbedding" <=> ${questionEmbedding}::vector) AS similarity
        FROM "VideoEmbedding"
        WHERE "videoId" = ${videoId}
        ORDER BY similarity DESC
        LIMIT 5
      ` as any[];
      
      console.log(`Got ${relevantChunks.length} top chunks`);
    }

    // FIX 7: Better error handling
    if (!relevantChunks || relevantChunks.length === 0) {
      // Check if embeddings actually exist
      const embeddingCount = await db.videoEmbedding.count({
        where: { videoId }
      });
      
      console.log(`Total embeddings in DB for video: ${embeddingCount}`);
      
      if (embeddingCount === 0) {
        return NextResponse.json({ 
          error: 'No video content available. The video may not have been processed correctly.' 
        }, { status: 400 });
      } else {
        return NextResponse.json({ 
          error: 'Could not find relevant content for your question. Try rephrasing your question.' 
        }, { status: 400 });
      }
    }

    // Log similarity scores for debugging
    console.log('Top similarity scores:', relevantChunks.slice(0, 3).map(c => c.similarity));

    // Extract text from chunks for context
    const context = relevantChunks.map((chunk: any) => chunk.chunkText);

    console.log('Generating response...');
    // Generate answer using Gemini
    const answer = await generateResponse(question, context);
    console.log('Response generated');

    // Save question and answer
    const videoQuestion = await db.videoQuestion.create({
      data: {
        videoId,
        userId,
        question,
        answer,
        context: relevantChunks,
      },
    });

    return NextResponse.json({
      id: videoQuestion.id,
      question,
      answer,
      context: relevantChunks,
      createdAt: videoQuestion.createdAt,
    });

  } catch (error: any) {
    console.error('Error answering question:', error);
    
    // FIX 8: Better error responses
    if (error.message.includes('embedContent')) {
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable. Please try again.' 
      }, { status: 503 });
    }
    
    if (error.message.includes('rate limit')) {
      return NextResponse.json({ 
        error: 'Too many requests. Please wait a moment and try again.' 
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to answer question. Please try again.' 
    }, { status: 500 });
  }
}

// FIX 9: Add a separate debug endpoint
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const videoId = url.searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    // Get video debug info
    const video = await db.video.findFirst({
      where: { id: videoId, userId },
      include: {
        embeddings: {
          select: {
            id: true,
            chunkIndex: true,
            chunkText: true,
          },
          take: 3
        },
        _count: {
          select: { embeddings: true }
        }
      }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        embeddingsCount: video._count.embeddings,
        sampleEmbeddings: video.embeddings,
        hasTranscript: !!video.transcript,
      }
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}