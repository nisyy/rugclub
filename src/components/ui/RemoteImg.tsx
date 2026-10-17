// 通常の <img> のまま（画像本来のアスペクト比・高さで表示できる）、画像だけを Next.js の画像最適化経由にする。
// 元画像（数MB・3000px超）ではなく、表示サイズに合わせて縮小・WebP化された画像が CDN から配信され、キャッシュも効く。
// next/image の fill が使えないマソンリー配置や、高さ固定・幅自動のカルーセルでも使える。
const OPTIMIZABLE_HOSTS = ['firebasestorage.googleapis.com', 'images.unsplash.com', 'placehold.co'];
const WIDTHS = [640, 1080, 1920]; // next.config のデフォルト deviceSizes に含まれる幅

function optimizedUrl(url: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;
}

function canOptimize(url: string): boolean {
  if (/\.(heic|heif|svg|gif)(\?|$)/i.test(url)) return false; // ブラウザ非対応/変換対象外はそのまま
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

export default function RemoteImg({
  src,
  sizes,
  alt = '',
  ...rest
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'sizes'> & { src: string; sizes: string }) {
  if (!canOptimize(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} decoding="async" {...rest} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizedUrl(src, 1080)}
      srcSet={WIDTHS.map((w) => `${optimizedUrl(src, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      decoding="async"
      {...rest}
    />
  );
}
