// セクション左端に添える、薄く小さな縦書きラベル（装飾用）
export default function VerticalLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-3 top-0 lg:left-6 font-display text-[11px] tracking-[0.3em] uppercase pointer-events-none select-none ${className}`}
      style={{ writingMode: 'vertical-rl' }}
    >
      {children}
    </span>
  );
}
