import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | RUG CLUB',
};

export default function PrivacyPage() {
  return (
    <main className="bg-cream min-h-screen pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">

        {/* ページタイトル */}
        <div className="mb-12">
          <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">
            Legal
          </p>
          <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase">
            PRIVACY POLICY
          </h1>
          <p className="text-navy/60 text-sm mt-2">プライバシーポリシー</p>
        </div>

        {/* 本文 */}
        <div className="prose prose-sm max-w-none text-charcoal/80 leading-relaxed space-y-8">

          <p>
            rugclub（以下、「当店」といいます。）は、当店Webサイトをご利用いただくお客様の個人情報について、以下のとおり適切に取り扱います。
          </p>

          <Section title="1. 取得する情報">
            <p>当店は、お問い合わせフォームのご利用時に、以下の情報を取得する場合があります。</p>
            <ul>
              <li>お名前</li>
              <li>メールアドレス</li>
              <li>お問い合わせ内容</li>
              <li>その他フォームにご入力いただいた情報</li>
            </ul>
            <p>オンラインショップでのご注文時には、以下の情報を取得します。</p>
            <ul>
              <li>お名前</li>
              <li>メールアドレス</li>
              <li>郵便番号・ご住所（お届け先）</li>
              <li>ご注文内容（商品・数量・金額）</li>
            </ul>
            <p>また、当サイトではアクセス解析のために閲覧情報等を取得する場合があります（「3. アクセス解析について」をご覧ください）。</p>
          </Section>

          <Section title="2. 個人情報の利用目的">
            <p>取得した情報は、以下の目的で利用します。</p>
            <ul>
              <li>お問い合わせへの対応</li>
              <li>ご注文の受付・商品の発送・代金の決済</li>
              <li>ご注文に関するご連絡（注文確認・発送のお知らせ等）</li>
              <li>必要なご連絡</li>
              <li>サービス向上・改善のための分析</li>
              <li>不正利用防止</li>
            </ul>
          </Section>

          <Section title="3. アクセス解析について">
            <p>
              当サイトでは、サイトの利用状況を把握し改善するため、Google LLC が提供するアクセス解析サービス「Google アナリティクス」を利用しています。
            </p>
            <p>
              Google アナリティクスは、Cookie（または同様の技術）を使用して、閲覧したページ、閲覧日時、お使いの端末・ブラウザの種類、おおよその地域、サイトへの流入元などの情報を収集します。
              オンラインショップでは、商品の閲覧、カートへの追加、購入手続き、ご注文、検索キーワードといった操作も、統計として収集します。
            </p>
            <p>
              収集される情報は匿名の統計データであり、お名前・メールアドレス・ご住所などの個人情報を解析ツールに送信することはありません。なお、管理画面へのアクセスは計測の対象外です。
            </p>
            <p>
              Cookie の利用は、ブラウザの設定で無効にすることができます。また、
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:opacity-70">Google アナリティクス オプトアウト アドオン</a>
              を利用することで、データの収集を停止できます。Google によるデータの取り扱いについては、
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:opacity-70">Google のポリシー</a>
              をご確認ください。
            </p>
          </Section>

          <Section title="4. 第三者提供について">
            <p>
              当店は、法令に基づく場合を除き、取得した個人情報を第三者へ提供いたしません。
            </p>
            <p>
              ただし、サービスの提供に必要な範囲で、以下の事業者に取り扱いを委託する場合があります。
            </p>
            <ul>
              <li>商品の配送：配送事業者（お届け先のお名前・ご住所・電話番号等を提供します）</li>
              <li>クレジットカード決済：決済代行事業者（カード情報は決済代行事業者が取り扱い、当店はカード番号を保有しません）</li>
              <li>データの保管・メールの送信・サイトの運営：Google LLC（Firebase / Gmail）、Vercel Inc. 等のクラウドサービス事業者</li>
            </ul>
          </Section>

          <Section title="5. 個人情報の管理">
            <p>
              当店は、個人情報の漏えい、紛失、改ざん等を防止するため、適切な管理を行います。
            </p>
          </Section>

          <Section title="6. 開示・訂正・削除について">
            <p>
              ご本人から個人情報の開示、訂正、削除等のご希望があった場合には、適切に対応いたします。
            </p>
          </Section>

          <Section title="7. お問い合わせ窓口">
            <dl className="space-y-1">
              <div className="flex gap-4">
                <dt className="text-navy/50 w-28 shrink-0">店舗名</dt>
                <dd>rugclub</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-navy/50 w-28 shrink-0">運営責任者</dt>
                <dd>坂本 将</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-navy/50 w-28 shrink-0">メールアドレス</dt>
                <dd>
                  <a
                    href="mailto:rugclubjp@gmail.com"
                    className="text-navy underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    rugclubjp@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="8. プライバシーポリシーの変更">
            <p>
              当店は、必要に応じて本ポリシーを変更する場合があります。
            </p>
          </Section>

        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-navy text-base tracking-wide mb-3 pb-2 border-b border-navy/10">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-charcoal/75 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
