export interface AdminMenuItem {
  id: string;
  imageUrl: string;
  order: number;
}

export interface AdminNewsItem {
  id: string;
  title: string;
  shortTitle: string;
  date: string;
  body: string;
  thumbnailUrl: string;
  heroUrl: string;
  category: string;
}

export interface AdminGalleryItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  status: 'available' | 'sold';
  instagramUrl?: string;  // 任意：登録時のみ表示
}
