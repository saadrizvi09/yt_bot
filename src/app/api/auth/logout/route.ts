import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'), 302);
  res.cookies.set('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    path: '/',
    maxAge: 0,
  });
  return res;
}



