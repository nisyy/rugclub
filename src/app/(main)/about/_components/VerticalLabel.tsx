// セクション左端に添える、薄く大きな装飾ラベル（縦書き／横書き切替可）
export default function VerticalLabel({
  children,
  className = '',
  orientation = 'vertical',
}: {
  children: React.ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}) {
  if (orientation === 'horizontal') {
    return (
      <span
        aria-hidden="true"
        className={`absolute left-4 top-4 lg:left-8 lg:top-8 font-display text-3xl md:text-5xl tracking-[0.1em] uppercase pointer-events-none select-none ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`absolute left-3 top-0 lg:left-6 font-display text-3xl md:text-5xl tracking-[0.2em] uppercase pointer-events-none select-none ${className}`}
      style={{ writingMode: 'vertical-rl' }}
    >
      {children}
    </span>
  );
}
