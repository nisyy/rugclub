/**
 * CTAButton / TextLink
 * 全ページ共通のCTAコンポーネント。
 *
 * variant="outline"      : ボーダーボタン（明るい背景用）
 * variant="outline-light": ボーダーボタン（暗い背景用）
 * variant="text"         : テキスト + 矢印リンク
 *
 * Usage:
 *   <CTAButton href="/about" variant="outline">RUG CLUB について</CTAButton>
 *   <CTAButton href="/menu" variant="outline-light">さらに詳しく</CTAButton>
 *   <CTAButton href="/gallery" variant="text" theme="dark">すべての作品を見る</CTAButton>
 */

import Link from 'next/link';

type CTAButtonProps = {
  href: string;
  variant?: 'outline' | 'outline-light' | 'text';
  theme?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
};

export default function CTAButton({
  href,
  variant = 'outline',
  theme = 'light',
  children,
  className = '',
}: CTAButtonProps) {
  if (variant === 'text') {
    return (
      <Link
        href={href}
        className={`btn-text ${theme === 'dark' ? 'text-white hover:text-white/70' : 'text-charcoal hover:text-accent'} ${className}`}
      >
        <span>{children}</span>
        <span>→</span>
      </Link>
    );
  }

  if (variant === 'outline-light') {
    return (
      <Link href={href} className={`btn-outline-light ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={`btn-outline ${className}`}>
      {children}
    </Link>
  );
}
