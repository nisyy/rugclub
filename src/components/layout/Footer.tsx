import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ロゴ */}
        <div className="py-10">
          <Link href="/" className="font-display text-cream text-2xl tracking-wider">
            RUG CLUB
          </Link>
        </div>

        <hr className="border-cream/15" />

        {/* リンク行 */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-3 items-start gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/contact" className="text-sm text-cream hover:text-orange transition-colors duration-200">
              お問い合わせ
            </Link>
            <a
              href="tel:06-0000-0000"
              className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-orange transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              06-0000-0000
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/about" className="text-sm text-cream/50 hover:text-cream transition-colors duration-200">
              プライバシーポリシー
            </Link>
            <Link href="/about" className="text-sm text-cream/50 hover:text-cream transition-colors duration-200">
              特定商取引法に基づく表記
            </Link>
          </div>

          <div className="flex items-center justify-start sm:justify-end gap-4">
            <a href="https://www.instagram.com/rug___club?igsh=b2oyNTY4bzBjeGR0"
              target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="text-cream hover:text-orange transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"
              className="text-cream hover:text-orange transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        <hr className="border-cream/15" />

        <div className="py-5">
          <p className="text-xs text-cream/40">© 2026 CAFE RUG CLUB.</p>
        </div>
      </div>
    </footer>
  );
}
