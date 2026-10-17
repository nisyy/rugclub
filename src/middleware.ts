import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ログインページと認証APIはスキップ
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/api/auth')
  ) {
    return NextResponse.next();
  }

  // 署名と有効期限を検証（cookieにパスワードは入っていない）
  if (!(await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    // 管理画面のAPIには、ログイン画面へのリダイレクトではなく401を返す
    if (pathname.startsWith('/admin/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
