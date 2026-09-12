import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

// スマホカメラ写真（数MB〜10MB）をそのまま配信すると表示が遅くなるため、
// アップロード前にブラウザ側で長辺1920px・JPEG品質82%にリサイズ圧縮する。
// SVG・GIF（アニメーション崩れ防止）はリサイズ対象外。
async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

  if (scale === 1 && file.size <= 500 * 1024) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );
  if (!blob || blob.size >= file.size) {
    return file;
  }

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}

/**
 * Firebase Storage に画像をアップロードし、ダウンロードURLを返す
 * @param file       - アップロードするファイル
 * @param folder     - Storage 上のフォルダ名（例: "menu", "news", "gallery"）
 * @param onProgress - アップロード進捗コールバック (0〜100)
 * @returns          ダウンロードURL
 */
export async function uploadImage(
  file: File,
  folder: 'menu' | 'news' | 'gallery' | 'home-menu' = 'menu',
  onProgress?: (progress: number) => void,
): Promise<string> {
  const compressed = await compressImage(file);
  const timestamp = Date.now();
  const ext = compressed.name.split('.').pop() ?? 'jpg';
  const filename = `ragclub/${folder}/${timestamp}.${ext}`;
  const storageRef = ref(storage, filename);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, compressed);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress?.(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}
