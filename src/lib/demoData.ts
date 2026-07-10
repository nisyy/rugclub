/**
 * Notion が未設定のときにフロントエンドで使うデモ（サンプル）データ
 * 管理画面には使わない。フロントエンドのページファイルからのみ参照する。
 */
import type { AdminMenuItem, AdminNewsItem, AdminGalleryItem } from '@/types/admin';

export const DEMO_MENU: AdminMenuItem[] = [
  {
    id: 'demo-m1',
    name: 'BLTサンド',
    category: 'SANDWICH',
    price: '¥990',
    imageUrl: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600',
    order: 1,
  },
  {
    id: 'demo-m2',
    name: 'エビマヨトースト',
    category: 'SANDWICH',
    price: '¥770',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600',
    order: 2,
  },
  {
    id: 'demo-m3',
    name: 'ハンバーガー',
    category: 'SANDWICH',
    price: '¥990',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    order: 3,
  },
  {
    id: 'demo-m4',
    name: 'バニラアイス',
    category: 'DESSERTS',
    price: '¥450',
    imageUrl: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600',
    order: 4,
  },
  {
    id: 'demo-m5',
    name: 'バスクチーズケーキ',
    category: 'DESSERTS',
    price: '¥600',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600',
    order: 5,
  },
  {
    id: 'demo-m6',
    name: 'シグネチャー・ラテ',
    category: 'COFFEE',
    price: '¥606',
    imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600',
    order: 6,
  },
];

export const DEMO_GALLERY: AdminGalleryItem[] = [
  {
    id: 'demo-g1',
    title: 'Botanica No.3',
    artist: '坂本 将',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    status: 'available',
  },
  {
    id: 'demo-g2',
    title: 'Chromatic Flow',
    artist: 'Elena Veronova',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
    status: 'available',
  },
  {
    id: 'demo-g3',
    title: 'Desert Geometry',
    artist: 'Marcus Thorne',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
    status: 'sold',
  },
  {
    id: 'demo-g4',
    title: 'Stillness',
    artist: 'S. Yamaguchi',
    imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200',
    status: 'available',
  },
  {
    id: 'demo-g5',
    title: 'Impasto Study',
    artist: '坂本 将',
    imageUrl: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=600',
    status: 'available',
  },
  {
    id: 'demo-g6',
    title: 'Urban Soul',
    artist: 'Marcus Thorne',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    status: 'sold',
  },
];

export const DEMO_NEWS: AdminNewsItem[] = [
  {
    id: 'demo-n1',
    title: 'ホワイトデー限定ケーキの販売を開始いたしました',
    shortTitle: 'ホワイトデー限定ケーキ',
    date: '2026-03-08',
    body: '今年のホワイトデーに贈る、特別な限定ケーキのご案内です。厳選された素材を使用し、上品な甘さと華やかなデコレーションで仕上げました。\nベースとなるのは、口溶けの滑らかなホワイトチョコレートのムース。その中には、甘酸っぱいあまおう苺のコンフィチュールを閉じ込めました。\nトッピングには、食べられるエディブルフラワーと、春の訪れを感じさせる淡いピンク色のマカロンを添えました。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    heroUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    category: 'NEWS & EVENTS',
  },
  {
    id: 'demo-n2',
    title: '春の新作メニューのお知らせ',
    shortTitle: '春の新作メニュー',
    date: '2026-03-01',
    body: '春の訪れとともに、RUG CLUBでは新しいシーズナルメニューをご用意いたしました。桜の季節にぴったりの、淡いピンクと白を基調にしたドリンクや、旬の食材を使ったフードメニューをお楽しみいただけます。\n今季のおすすめは、抹茶と桜のラテ。京都産の上質な抹茶と、天然の桜フレーバーを組み合わせた、春限定の一杯です。\nフードメニューでは、旬の山菜を使ったサラダと、桜エビのトースト・サンドをご提供しております。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
    heroUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
    category: 'MENU',
  },
  {
    id: 'demo-n3',
    title: '店内アート展示：佐藤花子 個展「光の記憶」',
    shortTitle: '佐藤花子 個展「光の記憶」',
    date: '2026-02-15',
    body: '2026年2月15日より、アーティスト・佐藤花子による個展「光の記憶」を開催いたします。光と影の交錯をテーマに、日常の中に潜む美しい瞬間を切り取った作品群をご覧いただけます。\n佐藤花子は東京を拠点に活動するアーティストで、コーヒーや自然素材を用いた独自の技法で知られています。今回の展示では、新作15点を含む全20点を展示予定です。\n会期中、アーティストによるトークイベントも予定しております。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600',
    heroUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200',
    category: 'EXHIBITION',
  },
  {
    id: 'demo-n4',
    title: '祝日・定休日に関するお知らせ',
    shortTitle: '祝日・定休日のお知らせ',
    date: '2026-02-10',
    body: '平素よりCafe RUG CLUBをご愛顧いただき、誠にありがとうございます。2026年春の祝日営業および定休日についてお知らせいたします。\n春分の日（3月20日）は通常通り営業いたします。4月の祝日については、一部営業時間が変更となる場合がございます。最新の営業情報はSNSおよびウェブサイトにてご確認ください。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200',
    heroUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200',
    category: 'INFORMATION',
  },
  {
    id: 'demo-n5',
    title: 'コーヒー豆のラインナップが新しくなりました',
    shortTitle: 'コーヒー豆のラインナップ更新',
    date: '2026-02-01',
    body: '2026年2月より、RUG CLUBのコーヒー豆ラインナップを刷新いたしました。世界各地から厳選した新しいシングルオリジンを含む、計8種類の豆をご用意しています。\n今回新たに加わったのは、エチオピア・イルガチェフェ産の豆。フルーティーな酸味と花のような香りが特徴で、バリスタ一押しの逸品です。\n豆の販売も行っておりますので、ご自宅でもRUG CLUBの味をお楽しみいただけます。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600',
    heroUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600',
    category: 'MENU',
  },
];
