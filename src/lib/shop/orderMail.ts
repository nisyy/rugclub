import nodemailer from 'nodemailer';
import { formatYen } from './format';
import type { OrderRecord } from './types';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rug-club.net').replace(/\/$/, '');

function body(o: OrderRecord, audience: 'customer' | 'shop') {
  const tag = o.testMode ? '【テスト注文】' : '';
  const c = o.customer;
  const addr = `〒${c.postalCode} ${c.prefecture}${c.city}${c.address2 ? ' ' + c.address2 : ''}`;
  const lines = o.lines.map((l) => `・${l.name} × ${l.qty}　${formatYen(l.lineTotalYen)}`);
  const intro =
    audience === 'customer'
      ? `${c.name} 様\n\nご注文ありがとうございます。以下の内容でご注文を受け付けました。`
      : '注文が入りました。';
  const testNote = o.testMode
    ? '\n※これはテスト注文です。決済は行われておらず、商品は発送されません。送料はテスト用の仮の金額の場合があります。\n'
    : '';
  const inquiryUrl = `${SITE_URL}/contact?subject=shop&order=${encodeURIComponent(o.orderNumber)}`;
  const inquiry = audience === 'customer' ? ['【ご注文に関するお問い合わせ】', `ご不明な点は、こちらからお問い合わせください（注文番号が自動で入力されます）。`, inquiryUrl, ''] : [];
  const text = [
    intro, testNote, `注文番号：${o.orderNumber}`, '', '【ご注文内容】', ...lines, '',
    ...(o.paidAt ? ['お支払い：クレジットカード（決済済み）'] : []),
    `商品小計（税込）：${formatYen(o.subtotalYen)}`, `送料：${formatYen(o.shippingYen)}${o.shippingProvisional ? '（テスト用の仮送料）' : ''}`, `合計：${formatYen(o.totalYen)}`, '',
    '【お届け先】', `お名前：${c.name}`, `メール：${c.email}`, addr, '',
    ...inquiry,
    'RUG CLUB',
  ].join('\n');
  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;white-space:pre-wrap;">${esc(text).replace(esc(inquiryUrl), `<a href="${esc(inquiryUrl)}">${esc(inquiryUrl)}</a>`)}</div>`;
  return { subject: `${tag}ご注文を受け付けました（${o.orderNumber}）${audience === 'shop' ? ` ― ${c.name} 様` : ''}`, text, html };
}

/** 購入者・店舗の両方へ注文メールを送る。失敗しても注文自体は有効（結果を返すだけ） */
export async function sendOrderMails(o: OrderRecord): Promise<OrderRecord['mail']> {
  const user = process.env.CONTACT_GMAIL_USER;
  const pass = process.env.CONTACT_GMAIL_PASS;
  const shopTo = process.env.CONTACT_MAIL_TO;
  if (!user || !pass || !shopTo) {
    console.warn('[Shop] メール送信の環境変数が未設定です（CONTACT_GMAIL_USER / CONTACT_GMAIL_PASS / CONTACT_MAIL_TO）');
    return { customer: 'skipped', shop: 'skipped' };
  }
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const send = async (to: string, aud: 'customer' | 'shop') => {
    try {
      await transporter.sendMail({ from: `"RUG CLUB Shop" <${user}>`, to, replyTo: aud === 'shop' ? o.customer.email : shopTo, ...body(o, aud) });
      return 'sent' as const;
    } catch (e) {
      console.error(`[Shop] 注文メール送信失敗(${aud}):`, e instanceof Error ? e.message : e);
      return 'failed' as const;
    }
  };
  const [customer, shop] = await Promise.all([send(o.customer.email, 'customer'), send(shopTo, 'shop')]);
  return { customer, shop };
}

/** 発送通知メール（購入者宛）。追跡番号つき */
export async function sendShippedMail(o: OrderRecord): Promise<'sent' | 'failed' | 'skipped'> {
  const user = process.env.CONTACT_GMAIL_USER;
  const pass = process.env.CONTACT_GMAIL_PASS;
  const shopTo = process.env.CONTACT_MAIL_TO;
  if (!user || !pass || !shopTo) return 'skipped';
  const inquiryUrl = `${SITE_URL}/contact?subject=shop&order=${encodeURIComponent(o.orderNumber)}`;
  const text = [
    `${o.customer.name} 様`,
    '',
    'ご注文の商品を発送いたしました。',
    o.testMode ? '\n※これはテスト注文です。実際には発送されていません。\n' : '',
    `注文番号：${o.orderNumber}`,
    `配送業者：${o.carrier || '—'}`,
    `追跡番号：${o.trackingNumber || '—'}`,
    '',
    '【ご注文内容】',
    ...o.lines.map((l) => `・${l.name} × ${l.qty}`),
    '',
    '【ご注文に関するお問い合わせ】',
    inquiryUrl,
    '',
    'RUG CLUB',
  ].join('\n');
  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;white-space:pre-wrap;">${esc(text).replace(esc(inquiryUrl), `<a href="${esc(inquiryUrl)}">${esc(inquiryUrl)}</a>`)}</div>`;
  try {
    await nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }).sendMail({
      from: `"RUG CLUB Shop" <${user}>`, to: o.customer.email, replyTo: shopTo,
      subject: `${o.testMode ? '【テスト注文】' : ''}商品を発送しました（${o.orderNumber}）`, text, html,
    });
    return 'sent';
  } catch (e) {
    console.error('[Shop] 発送通知メール送信失敗:', e instanceof Error ? e.message : e);
    return 'failed';
  }
}
