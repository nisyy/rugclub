// クライアント/サーバー共通で使える金額表示（サーバー専用モジュールを import しないこと）
export function formatYen(yen: number): string {
  return `¥${yen.toLocaleString('ja-JP')}`;
}
