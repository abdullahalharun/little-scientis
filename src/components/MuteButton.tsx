import { useState } from 'react';
import { UiText } from '../constants/uiText';
import { GameState } from '../game/GameState';
import { AudioManager } from '../utils/AudioManager';
import { NarrationManager } from '../utils/NarrationManager';

/** Corner speaker toggle — the one piece of UI parents reach for. */
export function MuteButton() {
  const [muted, setMuted] = useState(!GameState.soundOn);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    AudioManager.setMuted(next);
    if (next) NarrationManager.stop();
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? UiText.soundOn : UiText.soundOff}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 10px)',
        right: 'calc(env(safe-area-inset-right, 0px) + 10px)',
        zIndex: 10,
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.9)',
        background: 'rgba(74, 59, 42, 0.35)',
        fontSize: 26,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
