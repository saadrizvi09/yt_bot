import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('API: /api/videos - GET request received.');
    const user = getUserFromRequest(request);
    if (!user) {
      console.log('API: /api/videos - Unauthorized user. Returning 401.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('API: /api/videos - User authenticated:', user.userId);
    const videos = await db.video.findMany({
      where: { userId: user.userId },
      include: {
        _count: {
          select: {
            embeddings: true,
            questions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`API: /api/videos - Found ${videos.length} videos for user ${user.userId}`);
    return NextResponse.json(videos);
  } catch (err: any) {
    console.error('API Error: /api/videos - Failed to fetch videos:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch videos' }, { status: 500 });
  }
} 