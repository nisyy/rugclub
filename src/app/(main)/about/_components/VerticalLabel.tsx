// セクションに添える、薄く大きな背景装飾テキスト（縦書き／横書き・中央寄せ切替可）
export default function VerticalLabel({
  children,
  className = '',
  orientation = 'vertical',
  align = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  align?: 'left' | 'center';
}) {
  const sizeCls = 'font-display text-[16vw] lg:text-[9vw] leading-none uppercase pointer-events-none select-none whitespace-nowrap';

  if (orientation === 'horizontal') {
    const positionCls =
      align === 'center'
        ? 'inset-0 flex items-center justify-center'
        : 'left-4 top-4 lg:left-8 lg:top-8';
    return (
      <span aria-hidden="true" className={`absolute ${positionCls} ${sizeCls} ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`absolute left-3 top-0 lg:left-6 ${sizeCls} ${className}`}
      style={{ writingMode: 'vertical-rl' }}
    >
      {children}
    </span>
  );
}
