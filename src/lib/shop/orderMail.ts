import nodemailer from 'nodemailer';
import { formatYen } from './format';
import type { OrderRecord } from './types';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
    ? '\n※これはテスト注文です。決済は行われておらず、商品は発送されません。送料はテスト用の仮の金額です。\n'
    : '';
  const text = [
    intro, testNote, `注文番号：${o.orderNumber}`, '', '【ご注文内容】', ...lines, '',
    `商品小計（税込）：${formatYen(o.subtotalYen)}`, `送料：${formatYen(o.shippingYen)}`, `合計：${formatYen(o.totalYen)}`, '',
    '【お届け先】', `お名前：${c.name}`, `メール：${c.email}`, addr, '',
    'RUG CLUB',
  ].join('\n');
  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;white-space:pre-wrap;">${esc(text)}</div>`;
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
