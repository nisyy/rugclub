'use client';

import Link from 'next/link';

// 「もっと見る」等のCTA：白いピルボタン + 丸い矢印アイコンのセット
export default function PillArrowLink({
  href,
  children,
  theme = 'light',
  scrollTo,
}: {
  href?: string;
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  /** href の代わりに、同ページ内の要素IDへスムーズスクロールする場合に指定 */
  scrollTo?: string;
}) {
  const pillCls =
    theme === 'dark'
      ? 'bg-navy text-cream'
      : 'bg-white text-navy';

  const content = (
    <span className="inline-flex items-center gap-3">
      <span className={`${pillCls} text-xs font-bold tracking-[0.15em] px-6 py-3 rounded-full`}>
        {children}
      </span>
      <span className="w-10 h-10 shrink-0 rounded-full bg-accent text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="19" x2="19" y2="5" />
          <polyline points="9 5 19 5 19 15" />
        </svg>
      </span>
    </span>
  );

  if (scrollTo) {
    return (
      <a
        href={`#${scrollTo}`}
        className="inline-flex"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href ?? '#'} className="inline-flex">
      {content}
    </Link>
  );
}
