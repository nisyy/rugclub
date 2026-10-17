'use client';

import { useEffect } from 'react';

// 注文確定中の読み込み画面。処理が終わるまで操作できないようにし、画面を閉じないよう案内する。
export default function OrderingOverlay({ active, testMode }: { active: boolean; testMode: boolean }) {
  useEffect(() => {
    if (!active) return;
    // 処理中にタブを閉じる・戻る操作をした時に確認を出す
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [active]);

  if (!active) return null;

  return (
    <div role="alertdialog" aria-modal="true" aria-live="assertive" aria-busy="true" aria-label="ご注文を処理しています" className="fixed inset-0 z-[80] flex items-center justify-center bg-cream/90 px-6 backdrop-blur-sm">
      <div className="flex max-w-sm flex-col items-center text-center">
        <svg className="animate-spin text-orange" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="mt-6 font-display text-navy text-lg tracking-[0.15em]">ご注文を処理しています</p>
        <p className="mt-3 text-sm leading-relaxed text-navy/60">
          {testMode ? 'テスト注文を確定しています。' : '注文を確定しています。'}
          <br />
          完了まで少し時間がかかります。<br />画面を閉じたり、戻ったりせずにお待ちください。
        </p>
      </div>
    </div>
  );
}
