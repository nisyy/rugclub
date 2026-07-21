// 見出し下に添える、手描き風の波線アンダーライン
export default function SquiggleUnderline({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 220 12"
      width="160"
      height="10"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 8 C 20 2, 38 2, 56 8 S 92 14, 110 8 S 146 2, 164 8 S 200 14, 218 8"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
