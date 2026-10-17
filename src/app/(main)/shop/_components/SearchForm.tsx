'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trackSearch } from '@/lib/analytics';

// 商品検索。ページを読み込み直さず、画面内の遷移で結果を切り替える。
export default function SearchForm({ q, category, sort }: { q: string; category?: string; sort: 'new' | 'popular' }) {
  const router = useRouter();
  const [value, setValue] = useState(q);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort === 'popular') params.set('sort', 'popular');
    const v = value.trim();
    if (v) { params.set('q', v); trackSearch(v); }
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : '/shop', { scroll: false });
  }

  return (
    <form action="/shop" method="get" role="search" onSubmit={submit} className="flex gap-2">
      {category && <input type="hidden" name="category" value={category} />}
      {sort === 'popular' && <input type="hidden" name="sort" value="popular" />}
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="作家名・商品名・カテゴリで検索"
        aria-label="商品を検索"
        maxLength={100}
        className="flex-1 min-w-0 bg-white border border-navy/20 rounded-full px-5 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-orange transition-colors"
      />
      <button type="submit" className="shrink-0 bg-navy text-cream text-xs font-bold tracking-widest px-6 rounded-full hover:opacity-80 transition-opacity">検索</button>
    </form>
  );
}
