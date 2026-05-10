import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-orange py-8 px-6">
      <div className="max-w-sm mx-auto flex flex-col items-center gap-5">

        {/* ── ロゴ ── */}
        <Link
          href="/"
          className="font-display text-cream text-3xl font-bold tracking-widest hover:opacity-80 transition-opacity duration-200"
        >
          RUG<span className="text-white/70"> CLUB</span>
        </Link>

        {/* ── FOLLOW US ── */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="font-display text-cream text-xs tracking-[0.35em] uppercase">
            Follow Us
          </p>
          <div className="flex items-center justify-center gap-4">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/rug___club?igsh=b2oyNTY4bzBjeGR0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center
                hover:opacity-80 transition-opacity duration-200 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center
                hover:opacity-80 transition-opacity duration-200 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                viewBox="0 0 24 24" fill="var(--color-orange)">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── 電話番号 ── */}
        <a
          href="tel:06-0000-0000"
          className="flex items-center gap-2 text-cream hover:opacity-80 transition-opacity duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-sm font-semibold tracking-wider">06-0000-0000</span>
        </a>

        {/* ── 区切り線 ── */}
        <hr className="w-full border-cream/20" />

        {/* ── ポリシーリンク ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link
            href="/privacy"
            className="text-xs text-cream/70 hover:text-cream transition-colors duration-200"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/contact"
            className="text-xs text-cream/70 hover:text-cream transition-colors duration-200"
          >
            お問い合わせ
          </Link>
        </div>

        {/* ── コピーライト ── */}
        <p className="text-xs text-cream/50 tracking-wide">
          © 2026 CAFE RUG CLUB.
        </p>

      </div>
    </footer>
  );
}
