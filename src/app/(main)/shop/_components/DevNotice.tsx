export default function DevNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 rounded-lg border border-dashed border-orange/60 bg-orange/5 px-4 py-3 text-xs leading-relaxed text-orange">
      <span className="font-bold mr-2">【開発用】</span>
      {children}
    </div>
  );
}
