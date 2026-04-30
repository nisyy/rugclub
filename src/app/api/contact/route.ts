import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { COLORS } from '@/lib/colors';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ─────────────────────────────────────────────
// メール本文 (HTML)
// ─────────────────────────────────────────────
function buildHtml(data: ContactPayload): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
  <h2 style="border-bottom:2px solid ${COLORS.orange};padding-bottom:8px;color:${COLORS.orange};">
    お問い合わせが届きました
  </h2>
  <table style="width:100%;border-collapse:collapse;margin:24px 0;">
    <tr>
      <th style="text-align:left;padding:10px;background:#f5f0e8;width:140px;font-size:12px;color:#666;">
        お名前
      </th>
      <td style="padding:10px;border-bottom:1px solid #eee;">${data.name}</td>
    </tr>
    <tr>
      <th style="text-align:left;padding:10px;background:#f5f0e8;font-size:12px;color:#666;">
        メールアドレス
      </th>
      <td style="padding:10px;border-bottom:1px solid #eee;">
        <a href="mailto:${data.email}">${data.email}</a>
      </td>
    </tr>
    <tr>
      <th style="text-align:left;padding:10px;background:#f5f0e8;font-size:12px;color:#666;">
        電話番号
      </th>
      <td style="padding:10px;border-bottom:1px solid #eee;">${data.phone || '未入力'}</td>
    </tr>
    <tr>
      <th style="text-align:left;padding:10px;background:#f5f0e8;font-size:12px;color:#666;">
        件名
      </th>
      <td style="padding:10px;border-bottom:1px solid #eee;">${data.subject}</td>
    </tr>
  </table>
  <h3 style="color:#333;font-size:14px;">お問い合わせ内容</h3>
  <div style="background:#f9f6f0;padding:16px;border-left:3px solid ${COLORS.orange};white-space:pre-wrap;">
${data.message}
  </div>
  <p style="margin-top:32px;font-size:11px;color:#999;">
    このメールは RUG CLUB ウェブサイトのお問い合わせフォームから自動送信されました。
  </p>
</div>
  `.trim();
}

// ─────────────────────────────────────────────
// メール本文 (プレーンテキスト)
// ─────────────────────────────────────────────
function buildText(data: ContactPayload): string {
  return [
    'お問い合わせが届きました。',
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    `お名前：${data.name}`,
    `メールアドレス：${data.email}`,
    `電話番号：${data.phone || '未入力'}`,
    `件名：${data.subject}`,
    '━━━━━━━━━━━━━━━━━━━━',
    '',
    '【お問い合わせ内容】',
    data.message,
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    'このメールは RUG CLUB ウェブサイトのお問い合わせフォームから自動送信されました。',
  ].join('\n');
}

// ─────────────────────────────────────────────
// POST /api/contact
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = (await req.json()) as ContactPayload;

  // 簡易バリデーション（クライアント側でも実施済みだが二重チェック）
  if (!body.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }

  const failedServices: string[] = [];

  // ── 1. メール送信（Nodemailer / Gmail SMTP）────────────────
  // TODO: .env.local に以下を設定してください
  //   CONTACT_GMAIL_USER=送信用Gmailアドレス
  //   CONTACT_GMAIL_PASS=Gmailアプリパスワード（16桁）
  //   CONTACT_MAIL_TO=受信先メールアドレス
  if (
    process.env.CONTACT_GMAIL_USER &&
    process.env.CONTACT_GMAIL_PASS &&
    process.env.CONTACT_MAIL_TO
  ) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CONTACT_GMAIL_USER,
          pass: process.env.CONTACT_GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"RUG CLUB Website" <${process.env.CONTACT_GMAIL_USER}>`,
        to: process.env.CONTACT_MAIL_TO,
        replyTo: body.email,
        subject: `【お問い合わせ】${body.subject} ― ${body.name} 様`,
        text: buildText(body),
        html: buildHtml(body),
      });
    } catch (err) {
      console.error('[Contact] メール送信失敗:', err);
      failedServices.push('email');
    }
  } else {
    // TODO: 環境変数が未設定のため、メール送信をスキップしています
    console.warn('[Contact] メール送信の環境変数が未設定です（CONTACT_GMAIL_USER / CONTACT_GMAIL_PASS / CONTACT_MAIL_TO）');
  }

  // ── 2. Google スプレッドシート（GAS Web App 経由）─────────
  // TODO: .env.local に以下を設定してください
  //   CONTACT_GAS_URL=Google Apps Script Web App の URL
  if (process.env.CONTACT_GAS_URL) {
    try {
      const gasRes = await fetch(process.env.CONTACT_GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
          name: body.name,
          email: body.email,
          phone: body.phone ?? '',
          subject: body.subject,
          message: body.message,
        }),
      });

      if (!gasRes.ok) {
        throw new Error(`GAS responded with status ${gasRes.status}`);
      }
    } catch (err) {
      console.error('[Contact] スプレッドシート書き込み失敗:', err);
      failedServices.push('spreadsheet');
    }
  } else {
    // TODO: 環境変数が未設定のため、スプレッドシート書き込みをスキップしています
    console.warn('[Contact] CONTACT_GAS_URL が未設定です');
  }

  // どちらかが成功していれば ok: true を返す
  // 両方失敗した場合のみ 500 を返す
  const allFailed = failedServices.length === 2;
  return NextResponse.json(
    { ok: !allFailed, failedServices },
    { status: allFailed ? 500 : 200 },
  );
}
