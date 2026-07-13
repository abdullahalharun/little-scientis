import Phaser from 'phaser';
import { Colors, hex } from '../constants/colors';
import { FONT_FAMILY, FONT_SIZE } from '../constants/layout';
import type { NarrationLine } from '../constants/lines';
import { NarrationManager } from '../utils/NarrationManager';
import type { Titu } from './Titu';

const PADDING = 30;
const WORD_DELAY = 190;
const HOLD_AFTER = 1400;

/**
 * Titu's talking bubble. Pops in, reveals the line word by word (voice plays
 * via NarrationManager), holds so slow listeners can catch up, then pops out
 * and fires onDone. One per scene is plenty.
 */
export class SpeechBubble extends Phaser.GameObjects.Container {
  private panel: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private wordTimer?: Phaser.Time.TimerEvent;
  private doneTimer?: Phaser.Time.TimerEvent;
  private readonly maxTextWidth: number;
  /** true while the tail should point down-left (bubble above Titu's right). */
  private tailFlipped = false;

  constructor(scene: Phaser.Scene, x: number, y: number, maxWidth = 520) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(900);
    this.maxTextWidth = maxWidth - PADDING * 2;

    this.panel = scene.add.graphics();
    this.label = scene.add
      .text(0, 0, '', {
        fontFamily: FONT_FAMILY,
        fontSize: `${FONT_SIZE.speech}px`,
        color: hex(Colors.textDark),
        align: 'center',
        wordWrap: { width: this.maxTextWidth },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.add([this.panel, this.label]);
    this.setScale(0);
    this.setVisible(false);
  }

  /** Point the tail down-right instead of down-left. */
  setTailFlipped(flipped: boolean): this {
    this.tailFlipped = flipped;
    return this;
  }

  say(line: NarrationLine, titu?: Titu, onDone?: () => void): void {
    this.cancel();
    const words = line.text.split(' ');
    const totalMs = words.length * WORD_DELAY;

    NarrationManager.speak(line);
    titu?.talkFor(totalMs + 400);

    // Size the panel for the final text up front so it never jumps around.
    this.label.setText(line.text);
    const width = Math.min(this.label.width, this.maxTextWidth) + PADDING * 2;
    const height = this.label.height + PADDING * 2;
    this.drawPanel(width, height);
    this.label.setText('');

    this.setVisible(true);
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 320,
      ease: 'Back.easeOut',
    });

    let shown = 0;
    this.wordTimer = this.scene.time.addEvent({
      delay: WORD_DELAY,
      repeat: words.length - 1,
      callback: () => {
        shown++;
        this.label.setText(words.slice(0, shown).join(' '));
      },
    });

    this.doneTimer = this.scene.time.delayedCall(totalMs + HOLD_AFTER, () => {
      this.hide();
      onDone?.();
    });
  }

  hide(): void {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 220,
      ease: 'Back.easeIn',
      onComplete: () => this.setVisible(false),
    });
  }

  private cancel(): void {
    this.wordTimer?.remove();
    this.doneTimer?.remove(); // a superseded line must not hide/complete the new one
    this.scene.tweens.killTweensOf(this);
  }

  private drawPanel(width: number, height: number): void {
    const g = this.panel;
    const w = width / 2;
    const h = height / 2;
    g.clear();
    // Drop shadow.
    g.fillStyle(Colors.buttonShadow, 0.18);
    g.fillRoundedRect(-w + 5, -h + 8, width, height, 34);
    // Cream panel with a warm border.
    g.fillStyle(Colors.panelCream);
    g.fillRoundedRect(-w, -h, width, height, 34);
    g.lineStyle(5, Colors.panelBorder);
    g.strokeRoundedRect(-w, -h, width, height, 34);
    // Tail pointing toward Titu (he stands center-low in every scene).
    const tx = this.tailFlipped ? w * 0.25 : -w * 0.25;
    g.fillStyle(Colors.panelCream);
    g.fillTriangle(tx - 22, h - 4, tx + 22, h - 4, tx, h + 30);
    g.lineStyle(5, Colors.panelBorder);
    g.lineBetween(tx - 22, h - 2, tx, h + 30);
    g.lineBetween(tx + 22, h - 2, tx, h + 30);
  }
}
