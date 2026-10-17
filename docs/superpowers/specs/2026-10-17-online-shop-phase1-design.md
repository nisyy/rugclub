# オンラインショップ 第1フェーズ 設計

決済（Stripe）未接続のまま、ショップの画面・カート・購入手続きの枠組みを実装する。

## 方針
- 追加依存なし。既存の Next.js(App Router)/Tailwind トークン/共通UIを再利用。
- 商品データは `src/lib/shop/products.ts`（仮データ）。画面は `getProducts()` / `getProductById()` のみに依存し、後でNotion等へ差し替え可能。
- 価格・在庫・販売状態の正はサーバー側。ブラウザから送られた価格は使わない。

## 構成
| ファイル | 責務 |
|---|---|
| `src/lib/shop/types.ts` | 型（Product, CartLine, PricedLine, Customer） |
| `src/lib/shop/products.ts` | 仮商品データと取得関数 |
| `src/lib/shop/shipping.ts` | 送料設定（初期値 `null`＝未確定） |
| `src/lib/shop/pricing.ts` | 整数円での小計・合計計算、カート検証（サーバー/共通） |
| `src/lib/shop/payment.ts` | `startCheckout()`。現状は「決済未接続」を返すのみ。Stripe差し替え点 |
| `src/lib/shop/validation.ts` | 配送先入力チェック |
| `src/app/api/shop/cart/validate/route.ts` | 商品ID+数量を受け、サーバー側で価格・在庫を再計算 |
| `src/app/api/shop/checkout/route.ts` | 検証後 `payment.ts` を呼ぶ。未接続は501、注文確定しない |
| `src/app/(main)/shop/_components/CartProvider.tsx` | localStorage（ID+数量のみ）のカートContext |
| `src/app/(main)/shop/**` | 一覧・詳細・カート・購入手続き・完了画面 |
| `Header.tsx` | メニューにSHOP、右上にカートアイコン+個数バッジ |

## カート
- localStorage に `{id, qty}[]` のみ。個人情報は保存しない。配送先入力は sessionStorage（購入手続き中のみ）。
- 数量は 1〜在庫数の整数。表示時にAPIで最新価格・在庫と突き合わせ、差異・売り切れを警告。

## 未接続・未確定時の挙動
- 送料が `null` または決済未接続の間、最終ボタンは無効。「決済未接続（開発用）」帯を表示。
- 完了画面は開発プレビュー。注文番号は「未発行」、購入完了とは表示しない。

## Stripe接続時の作業
1. `payment.ts` で Checkout Session 作成（秘密鍵は環境変数、サーバーのみ）
2. Webhookルート追加（署名検証・イベントIDによる冪等処理）
3. 注文保存と在庫引き当て（二重処理防止）
4. 送料ルールを `shipping.ts` に設定
5. 完了画面を実注文番号の表示に切替

## 対象外
Stripe接続、実決済、注文確定・保存、Webhook、注文メール、管理画面、本格在庫管理、配送API、送料ルール確定、会員、クーポン、多言語。
