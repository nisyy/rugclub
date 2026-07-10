import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

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
  const timestamp = Date.now();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `ragclub/${folder}/${timestamp}.${ext}`;
  const storageRef = ref(storage, filename);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

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
