import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get video details
    const video = await db.video.findFirst({
      where: {
        id,
        userId,
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if video exists and belongs to user
    const video = await db.video.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Delete all related data first (due to foreign key constraints)
    // Delete questions
    await db.videoQuestion.deleteMany({
      where: {
        videoId: id,
      },
    });

    // Delete embeddings
    await db.videoEmbedding.deleteMany({
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