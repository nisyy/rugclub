// 商品検索の一致判定（クライアント/サーバー共通。外部依存なし）。
// 全角/半角・大文字/小文字の違いを吸収し、空白区切りの複数キーワードはすべて含む商品だけを返す（AND検索）。
export function normalizeText(s: string): string {
  return s.normalize('NFKC').toLowerCase();
}

export function matchesSearch(query: string, fields: (string | null | undefined)[]): boolean {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeText(fields.filter(Boolean).join(' '));
  return words.every((w) => haystack.includes(w));
}
