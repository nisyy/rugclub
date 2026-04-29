import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ACCESS',
  description:
    'RUG CLUBカフェへのアクセス情報。住所・交通アクセス・営業時間。大阪府東大阪市足代北2-15-22',
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const openingHours = [
  { day: '月・火・木', time: '9:00 - 18:00' },
  { day: '金・土・日・祝', time: '9:00 - 21:00' },
  { day: '水', time: '定休日' },
] as const;

const MAPS_URL =
  'https://maps.google.com/?q=大阪府東大阪市足代北2-15-22';

// ─────────────────────────────────────────────
// Icon helpers
// ─────────────────────────────────────────────
function TrainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18" height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="M8 19l-2 3" />
      <path d="M16 19l2 3" />
      <path d="M7 19h10" />
    </svg>
  );
}

function WalkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18" height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="1.5" />
      <path d="M9 20l1.5-5.5L13 17l2-9" />
      <path d="M6.5 12.5L9 9l3.5 1.5" />
      <path d="M15 10.5l2.5 2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13" height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// 1. ページヘッダー
// ─────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="bg-navy -mt-16 pt-[7.5rem] pb-8 lg:pt-32 lg:pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-charcoal leading-none tracking-tight">
          ACCESS
        </h1>
        {/* 赤い横線（短め・左寄せ） */}
        <div className="w-14 h-[2px] bg-accent mt-5" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. メインコンテンツ
// ─────────────────────────────────────────────
function MainContent() {
  return (
    <section className="bg-navy pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── 左：情報エリア ── order-2 on mobile (map goes first) */}
          <div className="order-2 md:order-1">

            {/* ラベル */}
            <p className="text-[11px] font-semibold tracking-[0.3em] text-charcoal/40 uppercase mb-8">
              Location &amp; Directions
            </p>

            {/* Address */}
            <div className="mb-6">
              <h2 className="text-base italic font-medium text-charcoal mb-3">Address</h2>
              <address className="not-italic text-sm text-charcoal leading-[2]">
                <p>〒577-0058</p>
                <p>大阪府東大阪市足代北2-15-22</p>
              </address>
            </div>

            {/* 区切り線 */}
            <hr className="border-charcoal/12 my-6 max-w-lg" />

            {/* Access Info */}
            <div className="mb-6">
              <h2 className="text-base italic font-medium text-charcoal mb-4">Access Info</h2>
              <ul className="space-y-3 max-w-md">
                <li className="flex items-start gap-3 text-sm text-charcoal">
                  <span className="text-accent mt-0.5 shrink-0">
                    <TrainIcon />
                  </span>
                  近鉄奈良線／近鉄大阪線「布施駅」徒歩約6分
                </li>
                <li className="flex items-start gap-3 text-sm text-charcoal">
                  <span className="text-accent mt-0.5 shrink-0">
                    <TrainIcon />
                  </span>
                  大阪メトロ 千日前線「新深江駅」徒歩約10分
                </li>
              </ul>
            </div>

            {/* 区切り線 */}
            <hr className="border-charcoal/12 my-6 max-w-lg" />

            {/* Opening Hours */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-charcoal/40 uppercase mb-4">
                Opening Hours
              </p>

              {/* 営業時間カード */}
              <div className="bg-white border border-gray-100 max-w-lg">
                <div className="px-6 pt-2 pb-4">
                  {openingHours.map((row, i) => (
                    <div
                      key={row.day}
                      className={`flex items-center justify-between py-4 ${
                        i < openingHours.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      <span className="text-sm italic text-charcoal/80">{row.day}</span>
                      <span className="text-sm font-semibold text-charcoal tabular-nums">
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 注記 */}
                <div className="px-6 pb-5 flex items-center gap-2">
                  <span className="text-charcoal/40 shrink-0">
                    <InfoIcon />
                  </span>
                  <p className="text-[11px] italic text-charcoal/40 leading-relaxed">
                    フードのラストオーダーは閉店30分前です。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 右：地図エリア ── order-1 on mobile (map goes first) */}
          <div className="order-1 md:order-2">
            {/* Google Maps iframe */}
            <div className="overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=大阪府東大阪市足代北2-15-22&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RUG CLUB CAFE 地図"
              />
            </div>

            {/* Google Maps リンク */}
            <div className="text-center mt-5">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.25em] text-charcoal/40 hover:text-charcoal transition-colors duration-200 uppercase"
              >
                Open in Google Maps
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12" height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function AccessPage() {
  return (
    <>
      <PageHeader />
      <MainContent />
    </>
  );
}
