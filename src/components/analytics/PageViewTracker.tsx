'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logPageView } from '@/lib/analytics';

/**
 * ルート変化を検知して Firebase Analytics に page_view イベントを送信する。
 * (main)/layout.tsx に配置することで全ページに適用される。
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);

  return null;
}
