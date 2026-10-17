'use client';

import { useEffect, useRef } from 'react';
import { trackShop, type TrackItem } from '@/lib/analytics';

// 商品ページを開いた時に view_item を送る（同じ商品を同じ表示中に二重に送らない）
export default function TrackViewItem({ item }: { item: TrackItem }) {
  const sent = useRef<string | null>(null);
  useEffect(() => {
    if (sent.current === item.id) return;
    sent.current = item.id;
    trackShop('view_item', [item]);
    // 商品が変わった時だけ送る
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);
  return null;
}
