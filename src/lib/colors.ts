/**
 * ★ サイトカラー定数
 * ════════════════════════════════════════════════
 * メールテンプレート・themeColor など CSS 変数が使えない
 * JS/TS コンテキスト向けの定義です。
 *
 * CSS / Tailwind 向けのトークンは
 *   src/app/globals.css の @theme inline ブロック
 * で管理しています。値を変更する際は両方を同期してください。
 * ════════════════════════════════════════════════
 */
export const COLORS = {
  /** ★ メインカラー（赤）  ← globals.css: --color-orange */
  orange:      '#547443',
  /** ★ ホバー時のダーク色  ← globals.css: --color-orange-dark */
  orangeDark:  '#CB371E',
  /** 濃紺                  ← globals.css: --color-navy */
  navy:        '#1A2535',
  /** クリーム              ← globals.css: --color-cream */
  cream:       '#F0E6D2',
} as const;
