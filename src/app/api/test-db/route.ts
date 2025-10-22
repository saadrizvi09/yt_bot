import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const userCount = await db.user.count();
    return NextResponse.json({ 
      message: 'Database connection successful', 
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed', 
      details: error.message 
    }, { status: 500 });
  }
}

