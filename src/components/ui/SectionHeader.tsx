/**
 * SectionHeader
 * 全セクション共通の見出し構造。
 *
 * Usage (light bg):
 *   <SectionHeader eyebrow="The Concept" heading="見出しテキスト" body="説明文" />
 *
 * Usage (dark bg):
 *   <SectionHeader eyebrow="Gallery" heading="作品一覧" theme="dark" />
 *
 * Usage (centered):
 *   <SectionHeader eyebrow="News" heading="最新情報" align="center" />
 */

type SectionHeaderProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  theme?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  heading,
  body,
  theme = 'light',
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const isDark = theme === 'dark';
  const isCentered = align === 'center';

  return (
    <div className={`${isCentered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p
          className={`eyebrow mb-3 ${
            isDark ? 'text-white/40' : 'text-accent'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold leading-tight ${
          isDark ? 'text-white' : 'text-charcoal'
        }`}
      >
        {heading}
      </h2>
      {body && (
        <p
          className={`mt-3 text-sm leading-relaxed ${
            isDark ? 'text-white/60' : 'text-charcoal/60'
          }`}
        >
          {body}
        </p>
      )}
    </div>
  );
}
