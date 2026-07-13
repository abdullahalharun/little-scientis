import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { buildGameConfig } from './gameConfig';

/**
 * Mounts the Phaser game into a div and tears it down cleanly on unmount.
 * All gameplay lives in Phaser; React only renders chrome around it.
 */
export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    gameRef.current = new Phaser.Game(buildGameConfig(containerRef.current));
    // Handy for debugging and end-to-end tests.
    (window as unknown as { __game?: Phaser.Game }).__game = gameRef.current;

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
