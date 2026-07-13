import { useEffect, useState } from 'react';

/**
 * The game is portrait. On a landscape phone, ask (sweetly) for a rotate.
 * Tablets/desktops in landscape still fit fine, so only small screens hint.
 */
export function RotateHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const landscape = window.innerWidth > window.innerHeight;
      const small = Math.min(window.innerWidth, window.innerHeight) < 500;
      setShow(landscape && small);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        background: 'linear-gradient(#aee3f5, #e8f9ff)',
        fontFamily: '"Baloo 2", "Comic Sans MS", sans-serif',
      }}
    >
      <div style={{ fontSize: 64, animation: 'ls-rotate 1.6s ease-in-out infinite' }}>📱</div>
      <div style={{ fontSize: 26, color: '#4a3b2a', fontWeight: 700 }}>
        Please turn your device! 🌱
      </div>
      <style>
        {`@keyframes ls-rotate {
            0%, 20% { transform: rotate(0deg); }
            60%, 100% { transform: rotate(90deg); }
          }`}
      </style>
    </div>
  );
}
