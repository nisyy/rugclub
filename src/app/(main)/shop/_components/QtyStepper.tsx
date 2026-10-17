'use client';

export default function QtyStepper({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const btn = 'w-9 h-9 flex items-center justify-center text-navy disabled:text-navy/20 hover:bg-navy/5 transition-colors';
  return (
    <div className="inline-flex items-center border border-navy/20 rounded-full bg-white overflow-hidden">
      <button type="button" aria-label="数量を減らす" className={btn} disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
      <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="数量を増やす" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)}>＋</button>
    </div>
  );
}
