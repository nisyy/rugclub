/**
 * RUG CLUB - お問い合わせフォーム Google Apps Script
 * =====================================================
 * 【設定手順】
 *
 * 1. Google スプレッドシートを新規作成する
 *    - 名前は任意（例: 「RUG CLUB お問い合わせ」）
 *    - URLの /d/ と /edit の間にある文字列が SPREADSHEET_ID
 *      例: https://docs.google.com/spreadsheets/d/【ここ】/edit
 *
 * 2. スプレッドシートのメニュー →「拡張機能」→「Apps Script」を開く
 *
 * 3. このファイルの内容をすべてコピーして貼り付ける
 *    - SPREADSHEET_ID を手順1で確認したIDに書き換える
 *
 * 4. 「デプロイ」→「新しいデプロイ」をクリック
 *    - 種類: ウェブアプリ
 *    - 次のユーザーとして実行: 自分
 *    - アクセスできるユーザー: 全員
 *    → 「デプロイ」をクリック（Googleアカウントの許可を求められたら許可）
 *
 * 5. 表示された「ウェブアプリのURL」をコピー
 *    → .env.local の CONTACT_GAS_URL に貼り付ける
 *
 * =====================================================
 */

// ▼ ここを書き換えてください
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'お問い合わせ';

// ヘッダー行の定義
var HEADERS = ['受信日時', 'お名前', 'メールアドレス', '電話番号', '件名', 'お問い合わせ内容'];

/**
 * Next.js API Route からの POST を受け取る
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // スプレッドシートにデータを追記
    appendToSheet(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('doPost error:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * スプレッドシートにデータを1行追記する
 */
function appendToSheet(data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // シートが存在しなければ作成してヘッダーを追加
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);

    // ヘッダー行のスタイルを設定
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#C4531A');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // データ行を追記
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('ja-JP'),
    data.name    || '',
    data.email   || '',
    data.phone   || '',
    data.subject || '',
    data.message || '',
  ]);
}

/**
 * デプロイ確認用（ブラウザで URL を開いたときに表示される）
 */
function doGet() {
  return ContentService
    .createTextOutput('RUG CLUB Contact GAS: OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
