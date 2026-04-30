'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const FIELD_LABELS: { key: keyof FormData; label: string }[] = [
  { key: 'name',    label: 'お名前' },
  { key: 'email',   label: 'メールアドレス' },
  { key: 'phone',   label: '電話番号' },
  { key: 'subject', label: 'お問い合わせ件名' },
  { key: 'message', label: 'お問い合わせ内容' },
];

// ─── 送信完了画面 ──────────────────────────────
function ThanksView() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center py-16">
      <div className="text-center px-6">
        {/* チェックアイコン */}
        <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-orange)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-navy tracking-widest mb-5">
          Thank You
        </h2>
        <div className="w-10 h-px bg-navy/20 mx-auto mb-8" />
        <p className="text-sm text-navy/50 leading-[2.2] mb-10">
          お問い合わせを受け付けました。<br />
          内容を確認のうえ、ご連絡いたします。
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-orange uppercase hover:opacity-70 transition-opacity duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          HOME へ戻る
        </Link>
      </div>
    </section>
  );
}

// ─── 確認画面 ──────────────────────────────────
export default function ContactConfirmPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('contactForm');
    if (!stored) {
      router.replace('/contact');
      return;
    }
    setForm(JSON.parse(stored) as FormData);
  }, [router]);

  const handleSubmit = async () => {
    if (!form || sending) return;
    setSending(true);
    setSendError(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('send failed');
      sessionStorage.removeItem('contactForm');
      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  if (submitted) return <ThanksView />;
  if (!form) return null;

  return (
    <section className="bg-cream min-h-screen py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">

        {/* ページヘッダー */}
        <div className="text-center mb-14">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-navy tracking-widest mb-4">
            CONFIRM
          </h1>
          <p className="text-sm text-navy/40 mb-6">
            以下の内容でよろしいですか？
          </p>
          <div className="w-10 h-px bg-navy/20 mx-auto" />
        </div>

        {/* 入力内容確認テーブル */}
        <div className="mb-12">
          {FIELD_LABELS.filter(({ key }) => form[key]).map(({ key, label }, i, arr) => (
            <div
              key={key}
              className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 py-5 ${
                i < arr.length - 1 ? 'border-b border-navy/10' : ''
              }`}
            >
              <span className="text-[11px] font-semibold tracking-[0.2em] text-navy/40 uppercase sm:w-36 shrink-0 pt-0.5">
                {label}
              </span>
              <span className="text-sm text-navy leading-[1.8] whitespace-pre-wrap flex-1">
                {form[key]}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-navy/10 mb-10" />

        {/* エラーメッセージ */}
        {sendError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-center">
            <p className="text-sm text-red-600 font-medium">
              送信に失敗しました。時間をおいて再度お試しください。
            </p>
          </div>
        )}

        {/* ボタンエリア */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-6">

          {/* ← 修正する */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-navy/40 uppercase hover:text-navy transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            修正する
          </Link>

          {/* 送信する */}
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="w-full max-w-xs bg-orange text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full
              hover:bg-orange-dark transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <svg
                  className="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                送信中...
              </>
            ) : (
              '送信する'
            )}
          </button>

        </div>
      </div>
    </section>
  );
}
