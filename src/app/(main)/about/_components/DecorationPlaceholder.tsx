// 手描き風の装飾（テープ・インクのシミ・ブラシストローク等）の仮置き枠。
// 後日、透過PNG画像を用意して src を差し替える想定。
export default function DecorationPlaceholder({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none select-none flex items-center justify-center rounded-md border border-dashed border-navy/25 bg-navy/5 text-navy/40 text-[9px] tracking-wide px-2 py-1 ${className}`}
    >
      {label}
    </div>
  );
}
