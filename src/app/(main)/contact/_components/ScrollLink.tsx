'use client';

// 同ページ内の要素IDへスムーズスクロールするテキストリンク
export default function ScrollLink({
  targetId,
  children,
}: {
  targetId: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="text-orange underline underline-offset-2 hover:text-orange/80 transition-colors cursor-pointer"
    >
      {children}
    </a>
  );
}
