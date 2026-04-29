'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import type { AdminNewsItem } from '@/types/admin';

const ITEMS_PER_PAGE = 8;

// "2026-03-08" → "2026.4.8"（先頭ゼロを除いた表示）
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}.${Number(m)}.${Number(d)}`;
}

// ─── 斜め矢印ボタン ────────────────────────────
function ArrowCircle() {
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-navy/25 text-navy group-hover:bg-navy group-hover:text-cream group-hover:border-navy transition-all duration-300 shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

// ─── ニュースリスト ────────────────────────────
export default function NewsListClient({ items }: { items: AdminNewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // アイテムから一意のカテゴリを抽出
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // カテゴリでフィルタリング
  const filtered = useMemo(
    () =>
      activeCategory === 'ALL'
        ? items
        : items.filter((i) => i.category === activeCategory),
    [items, activeCategory]
  );

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // カテゴリ切り替え時にvisibleCountをリセット
  function handleCategory(cat: string) {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  return (
    <section className="bg-cream pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* セクションラベル */}
        <div className="pt-12 pb-10">
          <h2 className="font-display text-navy/35 text-[11px] tracking-[0.4em] uppercase paren-label">
            NEWS
          </h2>
        </div>

        {/* 2カラムレイアウト */}
        <div className="flex gap-12 lg:gap-16 items-start">

          {/* ── 左：カテゴリサイドバー ── */}
          <nav aria-label="カテゴリフィルター" className="hidden md:block shrink-0 w-44">
            <div className="bg-white/60 border border-navy/8 py-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`w-full text-left px-5 py-2.5 text-sm tracking-wide whitespace-nowrap transition-colors duration-200 ${
                    activeCategory === cat
                      ? 'text-orange font-bold'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  {cat === 'ALL' ? 'すべて' : cat}
                </button>
              ))}
            </div>
          </nav>

          {/* ── 右：記事一覧 ── */}
          <div className="flex-1 min-w-0">

            {/* カテゴリ名ヘッダー（上下ライン＋中央タイトル） */}
            <div className="mb-8">
              <hr className="border-navy/15" />
              <p className="font-display text-navy text-2xl md:text-3xl text-center py-5">
                {activeCategory === 'ALL' ? 'ALL' : activeCategory}
              </p>
              <hr className="border-navy/15" />
            </div>

            {/* スマホ用カテゴリ横スクロール */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-4 -mx-1 px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`shrink-0 text-[11px] font-bold tracking-[0.15em] px-4 py-2 border transition-colors duration-200 ${
                    activeCategory === cat
                      ? 'bg-navy text-cream border-navy'
                      : 'bg-transparent text-navy/60 border-navy/20 hover:border-navy/50'
                  }`}
                >
                  {cat === 'ALL' ? 'すべて' : cat}
                </button>
              ))}
            </div>

            {/* リスト */}
            {visibleItems.length > 0 ? (
              <ul>
                {visibleItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.id}`}
                      className="flex items-center gap-5 py-5 group"
                    >
                      {/* カテゴリバッジ（固定幅・1行強制） */}
                      <span className="shrink-0 w-44 text-center text-[10px] font-bold tracking-[0.1em] text-navy/55 whitespace-nowrap overflow-hidden">
                        （{item.category}）
                      </span>

                      {/* 日付 + タイトル */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold tracking-[0.2em] text-navy/40 mb-1.5 tabular-nums">
                          {formatDate(item.date)}
                        </p>
                        <h2 className="text-sm text-navy leading-snug group-hover:text-orange transition-colors duration-200">
                          {item.title}
                        </h2>
                      </div>

                      {/* 矢印ボタン */}
                      <ArrowCircle />
                    </Link>

                    {/* 区切りライン */}
                    <div className="h-px bg-navy/12" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy/40 text-center py-16">
                記事がありません。
              </p>
            )}

            {/* MORE ボタン */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                  className="btn-pill"
                >
                  MORE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
