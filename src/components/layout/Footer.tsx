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
            {/* Threads */}
            <a
              href="https://www.threads.net/@rug___club"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center
                hover:opacity-80 transition-opacity duration-200 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="var(--color-orange)">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
              </svg>
            </a>
            {/* LINE */}
            <a
              href="https://lin.ee/8jdWMLu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINE"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center
                hover:opacity-80 transition-opacity duration-200 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                viewBox="0 0 24 24" fill="var(--color-orange)">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .626.285.626.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── 電話番号 ── */}
        <a
          href="tel:06-6224-4030"
          className="flex items-center gap-2 text-cream hover:opacity-80 transition-opacity duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-sm font-semibold tracking-wider">06-6224-4030</span>
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
