import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { AdminMenuItem, AdminNewsItem, AdminGalleryItem } from '@/types/admin';

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

// --- Menu ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPrice(prop: any): string {
  const num = prop?.number;
  if (num == null) return '';
  return `¥${Number(num).toLocaleString('ja-JP')}`;
}

function parsePrice(str: string): number {
  return parseInt(str.replace(/[¥,]/g, ''), 10) || 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function menuPageToItem(page: PageObjectResponse): AdminMenuItem {
  const props = page.properties;
  return {
    id: page.id,
    name: getText(props['商品名']),
    category: getText(props['カテゴリ']) as AdminMenuItem['category'],
    price: formatPrice(props['価格']),
    description: getText(props['説明文']),
    imageUrl: getText(props['画像URL']),
  };
}

export async function getMenuItems(): Promise<AdminMenuItem[]> {
  return safeQuery(async () => {
    const dbId = cleanId(process.env.NOTION_MENU_DB_ID);
    if (!dbId) return [];
    const res = await notion.databases.query({ database_id: dbId });
    return res.results.filter((p): p is PageObjectResponse => 'properties' in p).map(menuPageToItem);
  });
}

// --- News ---
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
    const res = await notion.databases.query({ database_id: dbId });
    return res.results.filter((p): p is PageObjectResponse => 'properties' in p).map(newsPageToItem);
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

// --- Gallery ---
function galleryPageToItem(page: PageObjectResponse): AdminGalleryItem {
  const props = page.properties;
  return {
    id: page.id,
    title: getText(props['作品タイトル']),
    artist: getText(props['作家名']),
    imageUrl: getText(props['画像URL']),
    status: getText(props['ステータス']) as AdminGalleryItem['status'],
  };
}

export async function getGalleryItems(): Promise<AdminGalleryItem[]> {
  return safeQuery(async () => {
    const dbId = cleanId(process.env.NOTION_GALLERY_DB_ID);
    if (!dbId) return [];
    const res = await notion.databases.query({ database_id: dbId });
    return res.results.filter((p): p is PageObjectResponse => 'properties' in p).map(galleryPageToItem);
  });
}