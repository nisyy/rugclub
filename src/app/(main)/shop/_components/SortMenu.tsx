'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Option { label: string; href: string; active: boolean }

// 並び順のプルダウン。上下矢印アイコンのボタンをタップすると選択肢が開く。
export default function SortMenu({ options }: { options: Option[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.active) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`並び順：${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy/50 rounded-full pl-3 pr-4 py-2 text-xs font-semibold text-navy transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 4v16" /><polyline points="4 8 8 4 12 8" />
          <path d="M16 20V4" /><polyline points="12 16 16 20 20 16" />
        </svg>
        {current.label}
      </button>
      {open && (
        <ul role="listbox" aria-label="並び順" className="absolute right-0 top-full mt-2 z-30 min-w-[9rem] overflow-hidden rounded-xl border border-navy/15 bg-white shadow-lg">
          {options.map((o) => (
            <li key={o.label} role="option" aria-selected={o.active}>
              <Link
                href={o.href}
                scroll={false}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-xs font-semibold transition-colors ${o.active ? 'bg-navy text-cream' : 'text-navy hover:bg-navy/5'}`}
              >
                {o.label}
                {o.active && <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
