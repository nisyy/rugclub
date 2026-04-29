import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import FadeIn from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'RENTAL SPACE',
  description:
    'Cafe RUG CLUBのレンタルスペース。展示会、ワークショップ、プライベートイベントにご利用いただけます。',
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const atmospherePhotos = [
  { src: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200', alt: 'ギャラリー空間 1' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200', alt: 'バリスタ' },
  { src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',  alt: 'アート作品 1' },
  { src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',      alt: 'アート作品 2' },
  { src: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800',      alt: 'ドリンク 1' },
  { src: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800',   alt: 'ドリンク 2' },
];

const policies = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '予約期間',
    body: '標準レンタル枠は週単位（月〜日）です。個人は月曜を基準に最大4週間までの長期予約には特別料金が適用されます。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: '料金と手数料',
    body: '固定のレンタル料に加え、作品販売売上の15%を手数料として申し受けます。この手数料はスタッフによる対応および決済処理費用に充てられます。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
    title: 'プロモーション',
    body: 'すべての展示は公式ウェブサイトに掲載され、1.5万人以上のフォロワーを持つSNSアカウントで紹介されます。オープニングナイトイベントの開催を推奨しています。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: '設置',
    body: '作品の展示作業はアーティストの責任で行っていただきます。基本的な工具と白いパテは提供いたします。壁面の補修は展示終了後に行ってください。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '保険',
    body: 'Cafe RUG CLUBは施設全体の損害保険に加入していますが、個々の作品の盗難や破損に対する保険はアーティスト側で手配してください。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    title: 'カフェとのシナジー',
    body: 'カフェは通常営業いたします。これにより、一日を通じて安定した客層が確保され、作品の潜在的な購入者へのアプローチが可能になります。',
  },
];

// ─────────────────────────────────────────────
// 1. ページヘッダー
// ─────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="bg-orange -mt-16 pt-32 pb-16 lg:pt-36 lg:pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* 左：テキストコンテンツ */}
          <FadeIn>
            <div>
              {/* ラベル */}
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] text-accent uppercase mb-5">
                <span className="text-accent text-base leading-none">●</span>
                Exhibition Opportunity
              </p>

              {/* タイトル */}
              <h1 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6">
                SPACE{' '}
                <span className="text-accent italic font-black">RENTAL</span>
              </h1>

              {/* 説明文 */}
              <p className="text-sm text-charcoal/60 leading-[2] mb-8 max-w-sm">
                高い天井と自然光が差し込むギャラリースペースで、展示会、ワークショップ、
                プライベートイベントを開催しませんか。クリエイティブ地区の中心に位置する
                Cafe RUG CLUBは、プロフェッショナルなアート展示と居心地の良い社交の場を
                融合させたユニークな空間を提供します。
              </p>

              {/* CTAボタン */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 bg-accent text-white text-sm font-semibold tracking-wide px-6 py-3 rounded-full hover:bg-red-800 transition-colors duration-200"
              >
                {/* メールアイコン */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                お問い合わせ
              </Link>
            </div>
          </FadeIn>

          {/* 右：ギャラリー写真 */}
          <FadeIn delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200"
                alt="ギャラリースペース"
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. Atmosphere セクション
// ─────────────────────────────────────────────
function AtmosphereSection() {
  return (
    <section className="bg-navy py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* セクションヘッダー */}
        <FadeIn>
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">Atmosphere</h2>
            <p className="text-sm text-charcoal/40 mt-1.5">店内の雰囲気</p>
          </div>
        </FadeIn>

        {/* 3×2 フォトグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {atmospherePhotos.map((photo, i) => (
            <FadeIn key={photo.alt} delay={i * 70}>
              <div className="relative aspect-square overflow-hidden group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-600"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. Rental Policy セクション
// ─────────────────────────────────────────────
function RentalPolicySection() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* セクションヘッダー */}
        <FadeIn>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">Rental Policy</h2>
            <p className="text-sm text-charcoal/40 mt-1.5">レンタル利用規約</p>
          </div>
        </FadeIn>

        {/* 3×2 ポリシーカードグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {policies.map((policy, i) => (
            <FadeIn key={policy.title} delay={i * 80}>
              <div>
                {/* アイコン（赤） */}
                <div className="text-accent mb-4">
                  {policy.icon}
                </div>
                {/* タイトル */}
                <h3 className="text-base font-bold text-charcoal mb-2">{policy.title}</h3>
                {/* 説明文 */}
                <p className="text-xs text-charcoal/60 leading-[2]">{policy.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function SpaceRentalPage() {
  return (
    <>
      <PageHeader />
      <AtmosphereSection />
      <RentalPolicySection />
    </>
  );
}
