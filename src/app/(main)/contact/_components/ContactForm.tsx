'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const SUBJECT_OPTIONS = [
  'カフェについて',
  'レンタルスペースについて',
  '作品展示について',
  'その他',
];

const inputBase =
  'w-full bg-white border border-navy/20 rounded-lg px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-orange transition-colors duration-200';

export default function ContactForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const next: Partial<FormData> = {};
    if (!form.name.trim()) next.name = 'お名前を入力してください';
    if (!form.email.trim()) {
      next.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = '正しいメールアドレスを入力してください';
    }
    if (!form.subject) next.subject = 'お問い合わせ件名を選択してください';
    if (!form.message.trim()) next.message = 'お問い合わせ内容を入力してください';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    sessionStorage.setItem('contactForm', JSON.stringify(form));
    router.push('/contact/confirm');
  };

  const update = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* お名前 */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          お名前
          <span className="ml-1 text-orange text-xs">（必須）</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={update('name')}
          placeholder="例：山田 太郎"
          className={inputBase}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-orange">{errors.name}</p>
        )}
      </div>

      {/* メールアドレス */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          メールアドレス
          <span className="ml-1 text-orange text-xs">（必須）</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder="例：example@mail.com"
          className={inputBase}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-orange">{errors.email}</p>
        )}
      </div>

      {/* 電話番号 */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          電話番号
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          placeholder="例：090-1234-5678"
          className={inputBase}
        />
      </div>

      {/* お問い合わせ件名 */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          お問い合わせ件名
          <span className="ml-1 text-orange text-xs">（必須）</span>
        </label>
        <div className="relative">
          <select
            value={form.subject}
            onChange={update('subject')}
            className={`${inputBase} appearance-none pr-8 cursor-pointer`}
          >
            <option value="">選択してください</option>
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* chevron */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {errors.subject && (
          <p className="mt-1.5 text-xs text-orange">{errors.subject}</p>
        )}
      </div>

      {/* お問い合わせ内容 */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          お問い合わせ内容
          <span className="ml-1 text-orange text-xs">（必須）</span>
        </label>
        <textarea
          value={form.message}
          onChange={update('message')}
          placeholder="こちらにご入力ください"
          rows={6}
          className={`${inputBase} resize-none`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-orange">{errors.message}</p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-navy/10" />

      {/* Submit button */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className="w-full max-w-xs bg-orange text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full hover:bg-orange-dark transition-colors duration-200"
        >
          確認する →
        </button>
      </div>

    </form>
  );
}
