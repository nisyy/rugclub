import { formatYen } from '@/lib/shop/format';

// 送料無料まであと何円かの案内（送料無料の条件が設定されていて、未達成の時だけ表示）
export default function FreeShippingNote({ remainingYen }: { remainingYen: number | null }) {
  if (remainingYen === null || remainingYen <= 0) return null;
  return (
    <p className="mt-3 rounded-lg bg-white border border-navy/10 px-4 py-2.5 text-xs text-navy/70 text-center">
      あと<span className="mx-1 text-sm font-bold text-orange">{formatYen(remainingYen)}</span>のご購入で送料無料
    </p>
  );
}
