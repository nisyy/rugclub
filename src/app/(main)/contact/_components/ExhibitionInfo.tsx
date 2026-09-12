import Link from 'next/link';
import ScrollLink from './ScrollLink';

// ─── 見出しラベル（unimocc等の展示案内ページを参考にした、帯タイプの小見出し）───
function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-navy text-cream text-xs font-bold tracking-[0.15em] px-4 py-2 rounded">
      {children}
    </span>
  );
}

function InfoSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <InfoLabel>{label}</InfoLabel>
      <div className="mt-4 text-sm text-navy/70 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold text-navy mt-5 mb-2 first:mt-0">
      {children}
    </p>
  );
}

// ─── ギャラリー出展案内（画像スライド下に表示する各セクション）───
export default function ExhibitionInfo() {
  return (
    <div className="mt-10 space-y-12">

      {/* 出展概要記載事項 */}
      <InfoSection label="出展概要記載事項">
        <p className="mb-3">
          当ギャラリーのスペースを利用した展示・販売・イベント等の利用条件を以下の通り定めています。
        </p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>
            アート作品（絵画・写真・立体作品等）の展示および販売、関連イベントを目的とした利用に限ります。公序良俗に反する内容や、当施設の趣旨にそぐわないと判断した場合は利用をお断りすることがあります。
          </li>
          <li>
            利用希望の方は、<ScrollLink targetId="contact-form">下記フォーム</ScrollLink>より事前にお申し込みください。当ギャラリーの承認をもって予約成立となります。
          </li>
        </ul>
      </InfoSection>

      {/* 会場概要 */}
      <InfoSection label="会場概要">
        <p>
          当ギャラリーはカフェ店内の壁面を利用した展示スペースです。コーヒーや食事と同じ空間での展示となりますので、飲食によるお客様との近距離での接触や、通常のギャラリーより人の出入りが多いことについて、あらかじめご了承ください。
        </p>
        <p className="mt-3">
          <Link
            href="/access"
            className="text-orange underline underline-offset-2 hover:text-orange/80 transition-colors"
          >
            アクセスはこちら
          </Link>
        </p>
      </InfoSection>

      {/* 出展費用 */}
      <InfoSection label="出展費用">
        <ul className="space-y-1.5">
          <li>・1日利用：6,000円（税込）　学生割引：5,000円</li>
          <li>・1週間利用（6日間）：30,000円（税込）　学生割引：25,000円</li>
          <li>・部分レンタル　壁面1m以下：5,000円（税込）〜（展示期間1ヶ月以上）</li>
          <li className="pl-[1.1em]">壁面1m以上：10,000円（税込）〜（展示期間1ヶ月以上）</li>
          <li>・物販：5,000円（税込）〜（設置期間1ヶ月以上）</li>
          <li className="pl-[1.1em]">展示＋物販は割引 −1,000円〜（販売量によって変化）</li>
        </ul>
        <p className="mt-3 text-xs text-navy/50">
          ※企画内容、展示面積により料金が変動する場合があります。<br />
          ※販売手数料はいただきません。販売に関するトラブルについては当ギャラリーは関与いたしかねます。
        </p>
      </InfoSection>

      {/* キャンセル・禁止事項等 */}
      <InfoSection label="キャンセル・禁止事項等">
        <SubHeading>キャンセルについて</SubHeading>
        <ul className="space-y-1.5">
          <li>・7日前：利用料金の20%</li>
          <li>・3日前：利用料金の50%</li>
          <li>・当日：利用料金の100%</li>
        </ul>

        <SubHeading>禁止事項</SubHeading>
        <p>
          迷惑行為、破損行為など、他のご利用者様やギャラリーの運営に支障をきたす行為はご遠慮いただいております。
        </p>

        <SubHeading>免責及び損害賠償</SubHeading>
        <ul className="space-y-1.5">
          <li>・作品の管理は利用者様の責任にて行っていただきます。</li>
          <li>・盗難・破損等について、当ギャラリーは責任を負いかねます。</li>
          <li>・飲食による汚損についても責任を負いかねます。</li>
          <li>・高額な作品については、自己保険への加入をおすすめします。</li>
        </ul>
      </InfoSection>

      {/* その他 */}
      <InfoSection label="その他">
        <ul className="space-y-1.5">
          <li>・搬入・搬出：水曜日 9:00〜12:00（応相談）</li>
          <li>・飲食：ワンドリンク制です。飲食物のお持ち込みはご遠慮ください。</li>
          <li>・在廊：任意です。</li>
          <li>・撮影・SNS投稿：作家様のご判断にお任せしています。</li>
          <li>・壁面：釘・ピンのご使用が可能です。ピクチャーレールもございます。壁面を損傷された場合は修繕費をご請求する場合があります。</li>
          <li>・ゴミ：展示に伴うゴミはお持ち帰りください。</li>
          <li>・原状回復：ご利用後は元の状態に戻してください。</li>
          <li>・本規約の内容は、予告なく変更する場合があります。</li>
        </ul>
        <p className="mt-4 text-xs text-navy/50">
          詳細は
          <a
            href="/gallery-terms.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange underline underline-offset-2 hover:text-orange/80 transition-colors"
          >
            ギャラリー利用規約
          </a>
          をご確認ください。
        </p>
      </InfoSection>

    </div>
  );
}
