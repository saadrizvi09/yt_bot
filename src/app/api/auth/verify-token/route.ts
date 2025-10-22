import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (payload) {
    return NextResponse.json({ authenticated: true, userId: payload.userId });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
