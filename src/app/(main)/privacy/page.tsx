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
            <p>また、当サイトではアクセス解析のために閲覧情報等を取得する場合があります。</p>
          </Section>

          <Section title="2. 個人情報の利用目的">
            <p>取得した情報は、以下の目的で利用します。</p>
            <ul>
              <li>お問い合わせへの対応</li>
              <li>必要なご連絡</li>
              <li>サービス向上・改善のための分析</li>
              <li>不正利用防止</li>
            </ul>
          </Section>

          <Section title="3. アクセス解析について">
            <p>
              当サイトでは、サイト改善のためアクセス解析ツールを利用しています。
            </p>
            <p>
              解析により収集される情報は匿名であり、個人を特定するものではありません。
            </p>
            <p>なお、当サイトではCookieを使用しておりません。</p>
          </Section>

          <Section title="4. 第三者提供について">
            <p>
              当店は、法令に基づく場合を除き、取得した個人情報を第三者へ提供いたしません。
            </p>
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
