import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<any> } // CRITICAL WORKAROUND: Next.js build is demanding params be Promise<any>.
) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params as { id: string };
    const { id } = resolvedParams;

    // Get video details
    const video = await db.video.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error: any) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch video' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<any> } // CRITICAL WORKAROUND: Next.js build is demanding params be Promise<any>.
) {
  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params as { id: string };
    const { id } = resolvedParams;

    // Check if video exists and belongs to user
    const video = await db.video.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Delete associated video embeddings
    await db.videoEmbedding.deleteMany({
      where: {
        videoId: id,
      },
    });

    // Delete associated video questions
    await db.videoQuestion.deleteMany({
      where: {
        videoId: id,
      },
    });

    // Delete video
    await db.video.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete video' }, { status: 500 });
  }
}