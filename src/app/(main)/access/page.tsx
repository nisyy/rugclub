import type { Metadata } from 'next';
import FadeIn from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'ACCESS',
  description:
    'RUG CLUBカフェへのアクセス情報。住所・交通アクセス・営業時間。大阪府東大阪市足代北2-15-22',
};

const MAPS_URL = 'https://maps.google.com/?q=大阪府東大阪市足代北2-15-22';

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="M8 19l-2 3" /><path d="M16 19l2 3" />
      <path d="M7 19h10" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function AccessPage() {
  return (
    <>
      {/* ── ヘッダー ── */}
      <section className="relative bg-cream pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden">
        <div className="absolute inset-0 flex items-start pt-0 pointer-events-none select-none" aria-hidden="true">
          <span className="font-display leading-none text-navy/[0.07] text-[16vw] lg:text-[12vw] pl-6 lg:pl-10">
            ACCESS
          </span>
        </div>
        <div className="relative z-10 px-8 lg:px-14">
          <FadeIn>
            <p className="font-display text-navy/40 text-[10px] tracking-[0.35em] uppercase mb-3">
              Find Us
            </p>
            <h1 className="font-display text-navy text-2xl tracking-[0.3em] uppercase paren-label">
              ACCESS
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* ── メインコンテンツ ── */}
      <section className="bg-cream mx-3 lg:mx-5 mb-5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
        <div className="p-5 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4 lg:gap-5 items-stretch">

            {/* ── 左: 3 枚のカード ── */}
            <div className="flex flex-col gap-4">

              {/* ① OPEN TIME */}
              <FadeIn>
                <div className="bg-orange rounded-2xl p-6">
                  <div className="flex items-center gap-2.5 mb-5 text-cream">
                    <ClockIcon />
                    <h2 className="font-display tracking-[0.2em] text-sm">
                      OPEN TIME
                    </h2>
                  </div>

                  <div className="space-y-0">
                    {/* WEEKDAY */}
                    <div className="flex items-center justify-between py-3 border-b border-cream/15">
                      <span className="text-[11px] font-bold tracking-[0.2em] text-cream/60 uppercase">
                        WEEKDAY
                      </span>
                      <div className="text-right">
                        <p className="text-[10px] text-cream/50 mb-0.5">月・火・木</p>
                        <p className="text-sm font-bold text-cream tabular-nums">9:00 – 18:00</p>
                      </div>
                    </div>
                    {/* WEEKEND */}
                    <div className="flex items-center justify-between py-3 border-b border-cream/15">
                      <span className="text-[11px] font-bold tracking-[0.2em] text-cream/60 uppercase">
                        WEEKEND
                      </span>
                      <div className="text-right">
                        <p className="text-[10px] text-cream/50 mb-0.5">金・土・日・祝</p>
                        <p className="text-sm font-bold text-cream tabular-nums">9:00 – 21:00</p>
                      </div>
                    </div>
                    {/* CLOSED */}
                    <div className="flex items-center justify-between py-3">
                      <span className="text-[11px] font-bold tracking-[0.2em] text-cream/60 uppercase">
                        CLOSED
                      </span>
                      <p className="text-sm font-bold text-cream">水曜</p>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-cream/45 mt-3 leading-relaxed">
                    ※ フードのラストオーダーは閉店30分前です。
                  </p>
                </div>
              </FadeIn>

              {/* ② ACCESS INFO */}
              <FadeIn delay={80}>
                <div className="bg-white border-2 border-orange rounded-2xl p-6">
                  <div className="flex items-center gap-2.5 mb-5 text-navy">
                    <span className="text-orange"><TrainIcon /></span>
                    <h2 className="font-display tracking-[0.2em] text-sm text-navy">
                      ACCESS INFO
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-bold tracking-wide text-orange mb-1">
                        近鉄大阪線・奈良線
                      </p>
                      <p className="text-sm text-navy">「布施駅」徒歩約6分</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-wide text-orange mb-1">
                        Osaka Metro 千日前線
                      </p>
                      <p className="text-sm text-navy">「新深江駅」徒歩約10分</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* ③ ADDRESS */}
              <FadeIn delay={160}>
                <div className="bg-[#E8EAF4] rounded-2xl p-6">
                  {/* 他カードと同じヘッダー構造：アイコン + font-display */}
                  <div className="flex items-center gap-2.5 mb-5 text-navy">
                    <span className="text-navy/60"><PinIcon /></span>
                    <h2 className="font-display tracking-[0.2em] text-sm text-navy">
                      ADDRESS
                    </h2>
                  </div>
                  <address className="not-italic text-sm text-navy leading-[2] mb-5">
                    〒577-0058<br />
                    大阪府東大阪市足代北2-15-22
                  </address>
                  <a
                    href="tel:06-0000-0000"
                    className="flex items-center gap-2 text-sm text-navy hover:text-orange transition-colors duration-200 mb-5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    06-0000-0000
                  </a>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-orange text-cream
                               font-display text-[11px] tracking-[0.25em] uppercase
                               py-3 rounded-lg hover:bg-orange-dark transition-colors duration-200"
                  >
                    <PinIcon />
                    OPEN IN MAPS
                  </a>
                </div>
              </FadeIn>

            </div>

            {/* ── 右: Google マップ ── */}
            <FadeIn delay={60}>
              <div className="rounded-2xl overflow-hidden h-full min-h-[420px] lg:min-h-0">
                <iframe
                  src="https://maps.google.com/maps?q=大阪府東大阪市足代北2-15-22&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block', minHeight: '420px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RUG CLUB CAFE 地図"
                />
              </div>
            </FadeIn>

          </div>
        </div>
      </section>
    </>
  );
}
