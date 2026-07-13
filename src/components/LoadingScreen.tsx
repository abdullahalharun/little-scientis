import { useEffect, useState } from 'react';
import { UiText } from '../constants/uiText';
import { GameEvents, gameEvents } from '../game/events';

/**
 * Friendly cover shown while Phaser boots (it's fast — textures are
 * generated, not downloaded — but this avoids any flash of blank canvas).
 */
export function LoadingScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);
    gameEvents.on(GameEvents.ready, onReady);
    return () => {
      gameEvents.off(GameEvents.ready, onReady);
    };
  }, []);

  if (ready) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'linear-gradient(#aee3f5, #e8f9ff)',
        zIndex: 20,
        fontFamily: '"Baloo 2", "Comic Sans MS", sans-serif',
      }}
    >
      <div style={{ fontSize: 72, animation: 'ls-bounce 0.9s ease-in-out infinite' }}>🌱</div>
      <div style={{ fontSize: 28, color: '#4a3b2a', fontWeight: 700 }}>{UiText.loading}</div>
      <style>
        {`@keyframes ls-bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-16px) scale(1.08); }
          }`}
      </style>
    </div>
  );
}
