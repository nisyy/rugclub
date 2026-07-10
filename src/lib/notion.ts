import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { AdminMenuItem, AdminNewsItem, AdminGalleryItem, AdminHomeSlide } from '@/types/admin';

async function safeQuery<T>(fn: () => Promise<T[]>): Promise<T[]> {
  if (!process.env.NOTION_TOKEN) return [];
  try {
    return await fn();
  } catch (e) {
    console.error('[notion safeQuery]', e instanceof Error ? e.message : e);
    return [];
  }
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

function cleanId(raw: string | undefined): string {
  return (raw ?? '').split('?')[0].trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getText(prop: any): string {
  if (!prop) return '';
  switch (prop.type) {
    case 'title':
      return prop.title?.map((t: { plain_text: string }) => t.plain_text).join('') ?? '';
    case 'rich_text':
      return prop.rich_text?.map((t: { plain_text: string }) => t.plain_text).join('') ?? '';
    case 'select':
      return prop.select?.name ?? '';
    case 'date':
      return prop.date?.start ?? '';
    case 'url':
      return prop.url ?? '';
    default:
      return '';
  }
}

// ─────────────────────────────────────────────
// Menu（/menu ページ用：カテゴリ・商品名・価格・画像）
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPrice(prop: any): string {
  const num = prop?.number;
  if (num == null) return '';
  return `¥${Number(num).toLocaleString('ja-JP')}`;
}

function parsePrice(str: string): number {
  return parseInt(str.replace(/[¥,]/g, ''), 10) || 0;
}

function menuPageToItem(page: PageObjectResponse): AdminMenuItem {
  const props = page.properties;
  return {
    id: page.id,
    name: getText(props['商品名']),
    category: getText(props['カテゴリ']),
    price: formatPrice(props['価格']),
    imageUrl: getText(props['画像URL']),
    order: (props['順番'] as { type: 'number'; number: number | null })?.number ?? 999,
  };
}

export async function getMenuItems(): Promise<AdminMenuItem[]> {
  return safeQuery(async () => {
    const dbId = cleanId(process.env.NOTION_MENU_DB_ID);
    if (!dbId) return [];
    const res = await notion.request<{ results: PageObjectResponse[] }>({
      path: `databases/${dbId}/query`,
      method: 'post',
      body: { sorts: [{ property: '順番', direction: 'ascending' }] },
    });
    return res.results.filter((p) => p.object === 'page').map(menuPageToItem);
  });
}

export async function createMenuItem(data: Omit<AdminMenuItem, 'id'>): Promise<AdminMenuItem> {
  const dbId = cleanId(process.env.NOTION_MENU_DB_ID);
  const page = await notion.pages.create({
    parent: { database_id: dbId },
    properties: {
      '商品名':   { title: [{ text: { content: data.name } }] },
      'カテゴリ': { select: { name: data.category } },
      '価格':     { number: parsePrice(data.price) },
      '画像URL':  { url: data.imageUrl || null },
      '順番':     { number: data.order },
    },
  } as Parameters<typeof notion.pages.create>[0]) as PageObjectResponse;
  return menuPageToItem(page);
}

export async function updateMenuItem(id: string, data: Partial<Omit<AdminMenuItem, 'id'>>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};
  if (data.name     !== undefined) properties['商品名']   = { title: [{ text: { content: data.name } }] };
  if (data.category !== undefined) properties['カテゴリ'] = { select: { name: data.category } };
  if (data.price    !== undefined) properties['価格']     = { number: parsePrice(data.price) };
  if (data.imageUrl !== undefined) properties['画像URL']  = { url: data.imageUrl || null };
  if (data.order    !== undefined) properties['順番']     = { number: data.order };
  await notion.pages.update({ page_id: id, properties });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await notion.pages.update({ page_id: id, in_trash: true });
}

// ─────────────────────────────────────────────
// Home Slide（TOPページのカルーセル用：画像のみ）
// ─────────────────────────────────────────────

function homeSlidePageToItem(page: PageObjectResponse): AdminHomeSlide {
  const props = page.properties;
  return {
    id: page.id,
    imageUrl: getText(props['画像URL']),
    order: (props['順番'] as { type: 'number'; number: number | null })?.number ?? 999,
  };
}

export async function getHomeSlides(): Promise<AdminHomeSlide[]> {
  return safeQuery(async () => {
    const dbId = cleanId(process.env.NOTION_HOME_MENU_DB_ID);
    if (!dbId) return [];
    const res = await notion.request<{ results: PageObjectResponse[] }>({
      path: `databases/${dbId}/query`,
      method: 'post',
      body: { sorts: [{ property: '順番', direction: 'ascending' }] },
    });
    return res.results.filter((p) => p.object === 'page').map(homeSlidePageToItem);
  });
}

export async function createHomeSlide(data: Omit<AdminHomeSlide, 'id'>): Promise<AdminHomeSlide> {
  const dbId = cleanId(process.env.NOTION_HOME_MENU_DB_ID);
  const page = await notion.pages.create({
    parent: { database_id: dbId },
    properties: {
      '名前':    { title: [{ text: { content: `TOP画像 ${data.order}` } }] },
      '画像URL': { url: data.imageUrl || null },
      '順番':    { number: data.order },
    },
  } as Parameters<typeof notion.pages.create>[0]) as PageObjectResponse;
  return homeSlidePageToItem(page);
}

export async function updateHomeSlide(id: string, data: Partial<Omit<AdminHomeSlide, 'id'>>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};
  if (data.imageUrl !== undefined) properties['画像URL'] = { url: data.imageUrl || null };
  if (data.order    !== undefined) properties['順番']    = { number: data.order };
  await notion.pages.update({ page_id: id, properties });
}

export async function deleteHomeSlide(id: string): Promise<void> {
  await notion.pages.update({ page_id: id, in_trash: true });
}

// ─────────────────────────────────────────────
// News
// ─────────────────────────────────────────────

function newsPageToItem(page: PageObjectResponse): AdminNewsItem {
  const props = page.properties;
  const title = getText(props['タイトル']);
  const thumbUrl = getText(props['サムネイルURL']);
  return {
    id: page.id,
    title,
    shortTitle: title,
    date: getText(props['日付']),
    body: getText(props['本文']),
    thumbnailUrl: thumbUrl,
    heroUrl: thumbUrl,
    category: 'NEWS',
  };
}

export async function getNewsItems(): Promise<AdminNewsItem[]> {
  return safeQuery(async () => {
    const dbId = cleanId(process.env.NOTION_NEWS_DB_ID);
    if (!dbId) return [];
    const res = await notion.request<{ results: PageObjectResponse[] }>({
      path: `databases/${dbId}/query`,
      method: 'post',
      body: {},
    });
    return res.results.filter((p) => p.object === 'page').map(newsPageToItem);
  });
}

export async function getNewsItemById(id: string): Promise<AdminNewsItem | null> {
  if (!process.env.NOTION_TOKEN) return null;
  try {
    const page = await notion.pages.retrieve({ page_id: id }) as PageObjectResponse;
    return newsPageToItem(page);
  } catch {
    return null;
  }
}

export async function createNewsItem(data: Omit<AdminNewsItem, 'id'>): Promise<AdminNewsItem> {
  const dbId = cleanId(process.env.NOTION_NEWS_DB_ID);
  const page = await notion.pages.create({
    parent: { database_id: dbId },
    properties: {
      'タイトル':      { title: [{ text: { content: data.title } }] },
      '日付':          { date: { start: data.date } },
      '本文':          { rich_text: [{ text: { content: data.body } }] },
      'サムネイルURL': { url: data.thumbnailUrl || null },
    },
  } as Parameters<typeof notion.pages.create>[0]) as PageObjectResponse;
  return newsPageToItem(page);
}

export async function updateNewsItem(id: string, data: Partial<Omit<AdminNewsItem, 'id'>>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};
  if (data.title        !== undefined) properties['タイトル']      = { title: [{ text: { content: data.title } }] };
  if (data.date         !== undefined) properties['日付']          = { date: { start: data.date } };
  if (data.body         !== undefined) properties['本文']          = { rich_text: [{ text: { content: data.body } }] };
  if (data.thumbnailUrl !== undefined) properties['サムネイルURL'] = { url: data.thumbnailUrl || null };
  await notion.pages.update({ page_id: id, properties });
}

export async function deleteNewsItem(id: string): Promise<void> {
  await notion.pages.update({ page_id: id, in_trash: true });
}

// ─────────────────────────────────────────────
// Gallery
// ─────────────────────────────────────────────

function galleryPageToItem(page: PageObjectResponse): AdminGalleryItem {
  const props = page.properties;
  const instagramUrl = getText(props['インスタグラムURL']);
  return {
    id: page.id,
    title: getText(props['作品タイトル']),
    artist: getText(props['作家名']),
    imageUrl: getText(props['画像URL']),
    status: getText(props['ステータス']) as AdminGalleryItem['status'],
    instagramUrl: instagramUrl || undefined,
  };
}

export async function getGalleryItems(): Promise<AdminGalleryItem[]> {
  return safeQuery(async () => {
    const dbId = cleanId(process.env.NOTION_GALLERY_DB_ID);
    if (!dbId) return [];
    const res = await notion.request<{ results: PageObjectResponse[] }>({
      path: `databases/${dbId}/query`,
      method: 'post',
      body: {},
    });
    return res.results.filter((p) => p.object === 'page').map(galleryPageToItem);
  });
}

export async function createGalleryItem(data: Omit<AdminGalleryItem, 'id'>): Promise<AdminGalleryItem> {
  const dbId = cleanId(process.env.NOTION_GALLERY_DB_ID);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {
    '作品タイトル': { title: [{ text: { content: data.title } }] },
    '作家名':       { rich_text: [{ text: { content: data.artist } }] },
    '画像URL':      { url: data.imageUrl || null },
    'ステータス':   { select: { name: data.status } },
  };
  // インスタグラムURL列が存在する場合のみ追加（列未作成時のエラーを防ぐ）
  if (data.instagramUrl) {
    properties['インスタグラムURL'] = { url: data.instagramUrl };
  }
  const page = await notion.pages.create({
    parent: { database_id: dbId },
    properties,
  } as Parameters<typeof notion.pages.create>[0]) as PageObjectResponse;
  return galleryPageToItem(page);
}

export async function updateGalleryItem(id: string, data: Partial<Omit<AdminGalleryItem, 'id'>>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};
  if (data.title    !== undefined) properties['作品タイトル'] = { title: [{ text: { content: data.title } }] };
  if (data.artist   !== undefined) properties['作家名']       = { rich_text: [{ text: { content: data.artist } }] };
  if (data.imageUrl !== undefined) properties['画像URL']      = { url: data.imageUrl || null };
  if (data.status   !== undefined) properties['ステータス']   = { select: { name: data.status } };
  // instagramUrl が truthy な場合のみ送信（列未作成時のエラーを防ぐ）
  if (data.instagramUrl) properties['インスタグラムURL'] = { url: data.instagramUrl };
  await notion.pages.update({ page_id: id, properties });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await notion.pages.update({ page_id: id, in_trash: true });
}
