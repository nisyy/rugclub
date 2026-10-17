'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useCart } from '@/components/shop/CartProvider';
import { formatYen } from '@/lib/shop/format';
import { EMPTY_CUSTOMER, PREFECTURES, validateCustomer, type CustomerErrors } from '@/lib/shop/validation';
import type { Customer } from '@/lib/shop/types';
import ShopHeading from '../_components/ShopHeading';
import DevNotice from '../_components/DevNotice';
import { useServerCart } from '../_components/useServerCart';

const inputBase = 'w-full bg-white border border-navy/20 rounded-lg px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-orange transition-colors';

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">
        {label}
        {required ? <span className="ml-1 text-orange text-xs">（必須）</span> : <span className="ml-1 text-navy/40 text-xs">（任意）</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-orange">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { hydrated, cart, messages, error } = useServerCart();
  const { clear } = useCart();
  const idempotencyKey = useRef(crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [submitError, setSubmitError] = useState('');
  const [zipStatus, setZipStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'failed'>('idle');
  const zipReq = useRef(0);

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomer((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  // 郵便番号が7桁そろったら住所を検索し、都道府県と市区町村・町名を自動入力する
  async function lookupZip(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 7) { setZipStatus('idle'); return; }
    const id = ++zipReq.current;
    setZipStatus('loading');
    try {
      const res = await fetch(`/api/shop/postal?zip=${digits}`);
      const data = (await res.json()) as { ok: boolean; prefecture?: string; city?: string; error?: string };
      if (id !== zipReq.current) return;
      if (data.ok && data.prefecture) {
        setCustomer((p) => ({ ...p, prefecture: data.prefecture!, city: data.city ?? '' }));
        setErrors((p) => ({ ...p, prefecture: undefined, city: undefined }));
        setZipStatus('found');
      } else {
        setZipStatus(data.error === 'not_found' ? 'notfound' : 'failed');
      }
    } catch {
      if (id === zipReq.current) setZipStatus('failed');
    }
  }

  function toConfirm(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateCustomer(customer);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep('confirm');
  }

  async function submitOrder() {
    if (!cart || cart.blockedReasons.length > 0 || submitting) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: cart.lines.map((l) => ({ id: l.id, qty: l.qty })),
          customer,
          idempotencyKey: idempotencyKey.current,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean; error?: string; name?: string; redirectUrl?: string;
        testOrder?: { orderNumber: string };
      };
      if (data.ok && data.redirectUrl) { window.location.href = data.redirectUrl; return; }
      if (data.ok && data.testOrder) {
        sessionStorage.setItem('rugclub_last_order', JSON.stringify(data.testOrder));
        clear();
        router.push('/shop/complete');
        return;
      }
      setSubmitError(data.error === 'out_of_stock' ? `「${data.name}」の在庫が足りなくなりました。カートをご確認ください。` : '現在ご注文を受け付けられません。');
    } catch {
      setSubmitError('通信に失敗しました。時間をおいて再度お試しください。');
    }
    setSubmitting(false);
  }

  if (!hydrated) return <div className="bg-cream min-h-screen" />;
  if (!cart || cart.lines.length === 0) {
    return (
      <div className="bg-cream min-h-screen pt-32 text-center px-6">
        <p className="text-sm text-navy/50">カートに商品がありません。</p>
        <Link href="/shop" className="btn-pill mt-8">SHOPへ</Link>
      </div>
    );
  }

  const blocked = cart.blockedReasons.length > 0;

  return (
    <div className="bg-cream min-h-screen pb-20">
      <ShopHeading eyebrow="Checkout" title="CHECKOUT" bg="ORDER" />
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <DevNotice>{cart.testMode ? 'テストモードです。「テスト注文」として保存・メール送信されますが、決済・発送は行われません。送料はテスト用の仮の金額です。' : '決済未接続の開発用画面です。実際の注文・決済は行われません。'}</DevNotice>
        {messages.length > 0 && <div role="alert" className="mb-6 text-xs text-orange space-y-1">{messages.map((m) => <p key={m}>{m}</p>)}</div>}
        {error && <p className="mb-6 text-xs text-orange">最新の価格・在庫を取得できませんでした。</p>}

        {/* 注文概要 */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-navy mb-3">ご注文内容</h2>
          <ul className="divide-y divide-navy/10 border-y border-navy/10">
            {cart.lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-navy">{l.name} <span className="text-navy/40">× {l.qty}</span></span>
                <span className="tabular-nums">{formatYen(l.lineTotalYen)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-navy/60">商品小計（税込）</dt><dd className="tabular-nums">{formatYen(cart.subtotalYen)}</dd></div>
            <div className="flex justify-between"><dt className="text-navy/60">送料</dt><dd className={cart.shippingYen === null ? 'text-orange' : 'tabular-nums'}>{cart.shippingYen === null ? '未確定' : formatYen(cart.shippingYen) + (cart.shippingProvisional ? '（テスト用の仮送料）' : '')}</dd></div>
            <div className="flex justify-between border-t border-navy/10 pt-2 font-bold"><dt>合計</dt><dd className="tabular-nums">{cart.totalYen === null ? '送料確定後に表示' : formatYen(cart.totalYen)}</dd></div>
          </dl>
        </section>

        {step === 'input' ? (
          <form onSubmit={toConfirm} noValidate className="space-y-6">
            <h2 className="text-sm font-bold text-navy">お届け先</h2>
            <Field label="お名前" required error={errors.name}><input className={inputBase} value={customer.name} onChange={set('name')} autoComplete="name" /></Field>
            <Field label="メールアドレス" required error={errors.email}><input type="email" className={inputBase} value={customer.email} onChange={set('email')} autoComplete="email" /></Field>
            <Field label="郵便番号" required error={errors.postalCode}><input className={inputBase} value={customer.postalCode} onChange={(e) => { set('postalCode')(e); lookupZip(e.target.value); }} placeholder="123-4567" inputMode="numeric" autoComplete="postal-code" />
              <p className="mt-1.5 text-xs text-navy/50" aria-live="polite">
                {zipStatus === 'loading' && '住所を検索しています...'}
                {zipStatus === 'found' && '都道府県・市区町村を自動入力しました。番地などを続けてご入力ください。'}
                {zipStatus === 'notfound' && '該当する住所が見つかりませんでした。手入力してください。'}
                {zipStatus === 'failed' && '住所を検索できませんでした。手入力してください。'}
                {zipStatus === 'idle' && '7桁を入力すると住所が自動入力されます。'}
              </p>
            </Field>
            <Field label="都道府県" required error={errors.prefecture}>
              <select className={inputBase} value={customer.prefecture} onChange={set('prefecture')} autoComplete="address-level1">
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="市区町村・住所" required error={errors.city}><input className={inputBase} value={customer.city} onChange={set('city')} autoComplete="address-line1" /></Field>
            <Field label="建物名・部屋番号" error={errors.address2}><input className={inputBase} value={customer.address2} onChange={set('address2')} autoComplete="address-line2" /></Field>
            {Object.keys(errors).length > 0 && (
              <div role="alert" className="rounded-lg bg-red-600 text-white text-sm px-4 py-3 space-y-0.5">
                {Object.values(errors).filter(Boolean).map((m, i) => <p key={i}>・{m}</p>)}
              </div>
            )}
            <div className="flex justify-center pt-2">
              <button type="submit" className="w-full max-w-xs bg-orange text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full hover:bg-orange-dark transition-colors">注文内容を確認する →</button>
            </div>
          </form>
        ) : (
          <section className="space-y-6">
            <h2 className="text-sm font-bold text-navy">お届け先の確認</h2>
            <dl className="border-y border-navy/10 divide-y divide-navy/10 text-sm">
              {([['お名前', customer.name], ['メールアドレス', customer.email], ['郵便番号', customer.postalCode], ['住所', `${customer.prefecture}${customer.city}${customer.address2 ? ' ' + customer.address2 : ''}`]] as const).map(([k, v]) => (
                <div key={k} className="flex gap-6 py-3"><dt className="w-32 shrink-0 text-navy/50">{k}</dt><dd className="text-navy break-all">{v}</dd></div>
              ))}
            </dl>
            {blocked && (
              <div role="status" className="rounded-lg border border-dashed border-orange/60 bg-orange/5 px-4 py-3 text-xs text-orange space-y-1">
                {cart.blockedReasons.map((r) => <p key={r}>・{r}</p>)}
              </div>
            )}
            {submitError && <p role="alert" className="text-xs text-orange">{submitError}</p>}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-6">
              <button type="button" onClick={() => setStep('input')} className="text-[11px] font-bold tracking-[0.25em] text-navy/40 hover:text-navy uppercase transition-colors">← 修正する</button>
              <button type="button" disabled={blocked || submitting} onClick={submitOrder} className="w-full max-w-xs bg-orange text-white text-sm font-bold tracking-widest px-10 py-4 rounded-full hover:bg-orange-dark transition-colors disabled:bg-navy/20 disabled:cursor-not-allowed">
                {blocked ? '現在ご注文いただけません' : submitting ? '送信中...' : cart.testMode ? 'テスト注文を確定する' : '決済へ進む'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
