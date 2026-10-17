// カート情報の読み込み中の表示（「商品がありません」を一瞬出さないためのローディングのみの表示）
export default function CartLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="py-24 text-center">
      <svg className="mx-auto animate-spin text-orange" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span className="sr-only">読み込み中</span>
    </div>
  );
}
