'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  href?: string;
  hrefLabel?: string;
}

const ToastContext = createContext<{ show: (t: Omit<Toast, 'id'>) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ ...t, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[55] flex justify-center px-4">
        {toast && (
          <div key={toast.id} role="status" className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-navy px-5 py-3 text-sm text-cream shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cream" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            <span className="min-w-0 break-words">{toast.message}</span>
            {toast.href && (
              <Link href={toast.href} className="shrink-0 font-bold underline underline-offset-2 hover:opacity-80" onClick={() => setToast(null)}>
                {toast.hrefLabel ?? '見る'}
              </Link>
            )}
            <button type="button" aria-label="閉じる" onClick={() => setToast(null)} className="shrink-0 text-cream/60 hover:text-cream">✕</button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
