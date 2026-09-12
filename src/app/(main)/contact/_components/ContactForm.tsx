'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { compressImageToDataUrl } from '@/lib/compressImageToDataUrl';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  portfolioUrl: string;
  message: string;
}

interface AttachedImage {
  name: string;
  dataUrl: string;
}

const MAX_IMAGES = 4;

const SUBJECT_OPTIONS = [
  '作品展示について',
  '部分レンタル',
  '個展やグループ展レンタル',
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
    portfolioUrl: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [images, setImages] = useState<AttachedImage[]>([]);
  const [imageError, setImageError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

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
    if (!validate()) {
      setShowValidationAlert(true);
      return;
    }
    setShowValidationAlert(false);
    sessionStorage.setItem('contactForm', JSON.stringify({ ...form, images }));
    router.push('/contact/confirm');
  };

  const update = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (files.length > remaining) {
      setImageError(`画像は最大${MAX_IMAGES}枚までです。`);
    } else {
      setImageError('');
    }

    setCompressing(true);
    const failedNames: string[] = [];
    for (const file of files.slice(0, remaining)) {
      try {
        const dataUrl = await compressImageToDataUrl(file);
        setImages((prev) => [...prev, { name: file.name, dataUrl }]);
      } catch {
        failedNames.push(file.name);
      }
    }
    setCompressing(false);

    if (failedNames.length > 0) {
      setImageError(
        `${failedNames.join('、')} は読み込めませんでした。HEIC形式などお使いの端末の写真形式が原因の場合があります。JPEGやPNGに変換してお試しください。`,
      );
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageError('');
  };

  return (
    <>
      {/* 入力不備アラート（画面最前面に固定表示） */}
      {showValidationAlert && Object.keys(errors).length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-red-600 shadow-lg">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 py-3.5 flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <ul className="text-sm text-white font-medium flex-1 space-y-0.5">
              {Object.values(errors).filter(Boolean).map((msg, i) => (
                <li key={i}>・{msg}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowValidationAlert(false)}
              aria-label="閉じる"
              className="shrink-0 text-white/80 hover:text-white text-lg leading-none px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* お名前 */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          お名前 or 作家名
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

      {/* WEB・SNS・ポートフォリオ */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">
          WEB・SNS・ポートフォリオ等作品を拝見できるものをご記載ください
        </label>
        <p className="text-xs text-navy/40 mb-2">
          （画像を添付される場合は下部よりお願いいたします）
        </p>
        <input
          type="url"
          value={form.portfolioUrl}
          onChange={update('portfolioUrl')}
          placeholder="URL"
          className={inputBase}
        />
      </div>

      {/* 作品画像添付 */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          画像を添付する
          <span className="ml-1 text-navy/40 text-xs">（任意・最大{MAX_IMAGES}枚）</span>
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-3">
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-navy/15 bg-navy/5">
                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-navy/70 hover:bg-navy text-white rounded-full flex items-center justify-center text-[10px] leading-none transition-colors"
                  aria-label="画像を削除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < MAX_IMAGES && (
          <label
            className={`flex items-center justify-center gap-2 w-full border border-dashed rounded-lg px-4 py-6 text-sm cursor-pointer transition-colors duration-200 ${
              compressing
                ? 'border-navy/15 text-navy/30 cursor-not-allowed'
                : 'border-navy/25 text-navy/40 hover:border-orange hover:text-orange'
            }`}
          >
            {compressing ? '処理中...' : '画像を添付する'}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={compressing}
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}
        {imageError && (
          <p className="mt-1.5 text-xs text-orange">{imageError}</p>
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
    </>
  );
}
