'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// アニメーションのフェーズ
// visible  → まっすぐ表示
// tilting  → 傾き始める
// clicking → 傾いたまま縮む（クリック）
// clicked  → 傾いたまま元のサイズに戻る
// fading   → フェードアウト中
// done     → アンマウント
type Phase = 'visible' | 'tilting' | 'clicking' | 'clicked' | 'fading' | 'done';

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>('visible');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => {
    // 自動アニメーションのスケジュール
    timersRef.current.push(setTimeout(() => setPhase('tilting'),  700));  // 傾く
    timersRef.current.push(setTimeout(() => setPhase('clicking'), 1000)); // 縮む
    timersRef.current.push(setTimeout(() => setPhase('clicked'),  1150)); // 戻る
    timersRef.current.push(setTimeout(() => setPhase('fading'),   1400)); // フェードアウト開始
    timersRef.current.push(setTimeout(() => setPhase('done'),     2200)); // アンマウント

    return () => clearTimers();
  }, []);

  // ロゴクリックでスキップ
  function skip() {
    clearTimers();
    setPhase('fading');
    timersRef.current.push(
      setTimeout(() => setPhase('done'), 700),
    );
  }

  if (phase === 'done') return null;

  // フェーズに応じたトランスフォーム
  const logoTransform = (() => {
    switch (phase) {
      case 'visible':  return 'rotate(0deg) scale(1)';
      case 'tilting':  return 'rotate(-6deg) scale(1)';
      case 'clicking': return 'rotate(-6deg) scale(0.88)';
      case 'clicked':  return 'rotate(-6deg) scale(1)';
      case 'fading':   return 'rotate(-6deg) scale(1)';
      default:         return 'rotate(0deg) scale(1)';
    }
  })();

  const logoTransition = (() => {
    switch (phase) {
      case 'tilting':  return 'transform 0.25s ease-in-out';
      case 'clicking': return 'transform 0.12s ease-in';
      case 'clicked':  return 'transform 0.18s ease-out';
      default:         return 'transform 0.2s ease';
    }
  })();

  return (
    <div
      onClick={skip}
      aria-label="スキップ"
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        transition: phase === 'fading' ? 'opacity 0.8s ease' : 'none',
      }}
      className="fixed inset-0 z-[200] bg-cream flex flex-col items-center justify-center cursor-pointer select-none"
    >
      {/* ロゴ */}
      <div
        style={{
          transform: logoTransform,
          transition: logoTransition,
        }}
      >
        <Image
          src="/RUG_CLUB_logo2.png"
          alt="RUG CLUB"
          width={220}
          height={220}
          priority
          draggable={false}
          className="object-contain"
        />
      </div>

      {/* スキップヒント */}
      <p
        style={{
          opacity: phase === 'visible' || phase === 'tilting' ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        className="absolute bottom-12 font-display text-navy/30 text-xs tracking-[0.3em] uppercase"
      >
        Tap to skip
      </p>
    </div>
  );
}
