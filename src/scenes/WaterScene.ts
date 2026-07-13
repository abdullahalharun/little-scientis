import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { Colors } from '../constants/colors';
import { CENTER_X, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { Lines } from '../constants/lines';
import { SceneKeys } from '../constants/scenes';
import { TextureKeys } from '../constants/textureKeys';
import { Titu } from '../objects/Titu';
import { AudioManager } from '../utils/AudioManager';
import { paintSky } from '../utils/backgrounds';
import { LevelSceneBase } from './LevelSceneBase';

const GROUND_Y = 430;
const SNAP_DISTANCE = 90;

interface Root {
  anchor: Phaser.Math.Vector2;
  tip: Phaser.GameObjects.Image;
  home: Phaser.Math.Vector2;
  connected: boolean;
}

interface WaterSpot {
  x: number;
  y: number;
  group: Phaser.GameObjects.Container;
  taken: boolean;
}

/**
 * Scene 1 — Water. A soil cross-section under Titu; the child drags his root
 * tips down to sparkling water pockets. Every connection slurps water up the
 * root and greens the leaves. No way to fail: a missed drop just floats back.
 */
export class WaterScene extends LevelSceneBase {
  private roots: Root[] = [];
  private spots: WaterSpot[] = [];
  private rootsG!: Phaser.GameObjects.Graphics;
  private connectedCount = 0;

  constructor() {
    super(SceneKeys.water);
  }

  protected buildScene(): void {
    this.roots = [];
    this.spots = [];
    this.connectedCount = 0;

    this.paintGround();

    this.titu = new Titu(this, CENTER_X, GROUND_Y + 10, 0.55);
    this.titu.setLeafHealth(0.15, false);

    this.rootsG = this.add.graphics().setDepth(5);

    // Three water pockets, spread deep in the soil.
    this.addWaterSpot(130, 890);
    this.addWaterSpot(CENTER_X, 1070);
    this.addWaterSpot(590, 890);

    // Three draggable root tips hanging just below the trunk.
    this.addRoot(CENTER_X - 90, 560, CENTER_X - 55);
    this.addRoot(CENTER_X, 620, CENTER_X);
    this.addRoot(CENTER_X + 90, 560, CENTER_X + 55);
    this.drawRoots();

    this.setupDrag();

    this.time.delayedCall(700, () => this.say(Lines.waterIntro, 150));
  }

  // ── build helpers ────────────────────────────────────────────────────────

  private paintGround(): void {
    paintSky(this, Colors.skyTop, Colors.skyBottom, GROUND_Y);

    // Grass lip.
    const grass = this.add.graphics().setDepth(-40);
    grass.fillStyle(Colors.grassLight);
    grass.fillRect(0, GROUND_Y - 26, GAME_WIDTH, 34);
    grass.fillStyle(Colors.grassDark);
    grass.fillRect(0, GROUND_Y, GAME_WIDTH, 14);

    // Soil gradient, darker with depth.
    const soil = this.add.graphics().setDepth(-30);
    const bands = 24;
    const topColor = Phaser.Display.Color.ValueToColor(Colors.soilTop);
    const bottomColor = Phaser.Display.Color.ValueToColor(Colors.soilDeep);
    const soilHeight = GAME_HEIGHT - GROUND_Y;
    for (let i = 0; i < bands; i++) {
      const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(
        topColor,
        bottomColor,
        bands - 1,
        i,
      );
      soil.fillStyle(Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b));
      soil.fillRect(0, GROUND_Y + 14 + (soilHeight / bands) * i, GAME_WIDTH, soilHeight / bands + 1);
    }

    // Buried stones for storybook texture.
    const stonePositions: Array<[number, number, number]> = [
      [80, 620, 0.8],
      [640, 700, 1],
      [200, 1150, 1.1],
      [520, 1180, 0.7],
      [360, 800, 0.6],
    ];
    for (const [x, y, s] of stonePositions) {
      this.add.image(x, y, TextureKeys.stone).setScale(s).setAlpha(0.75).setDepth(-20);
    }
  }

  private addWaterSpot(x: number, y: number): void {
    const group = this.add.container(x, y).setDepth(4);
    const glow = this.add
      .image(0, 0, TextureKeys.softCircle)
      .setTint(Colors.waterShine)
      .setScale(3);
    const drop = this.add.image(0, 0, TextureKeys.waterDrop);
    group.add([glow, drop]);

    // Twinkling sparkles announce "touch me!".
    for (let i = 0; i < 3; i++) {
      const sparkle = this.add
        .image(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-55, 40), TextureKeys.sparkle)
        .setTint(Colors.waterShine)
        .setScale(0.5);
      group.add(sparkle);
      this.tweens.add({
        targets: sparkle,
        alpha: 0.15,
        scale: 0.25,
        duration: Phaser.Math.Between(500, 900),
        delay: i * 260,
        yoyo: true,
        repeat: -1,
      });
    }

    this.tweens.add({
      targets: drop,
      scale: 1.12,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.spots.push({ x, y, group, taken: false });
  }

  private addRoot(tipX: number, tipY: number, anchorX: number): void {
    const tip = this.add
      .image(tipX, tipY, TextureKeys.rootTip)
      .setDepth(6)
      .setInteractive({ useHandCursor: true, draggable: true });
    // Generous hit area for small fingers.
    tip.input!.hitArea = new Phaser.Geom.Circle(38, 38, 60);
    tip.input!.hitAreaCallback = Phaser.Geom.Circle.Contains;

    // Come-hither bobbing until picked up.
    this.tweens.add({
      targets: tip,
      y: tipY + 14,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: Phaser.Math.Between(0, 500),
    });

    this.roots.push({
      anchor: new Phaser.Math.Vector2(anchorX, GROUND_Y + 4),
      tip,
      home: new Phaser.Math.Vector2(tipX, tipY),
      connected: false,
    });
  }

  // ── interaction ──────────────────────────────────────────────────────────

  private setupDrag(): void {
    this.input.on(
      Phaser.Input.Events.DRAG,
      (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, x: number, y: number) => {
        const root = this.roots.find((r) => r.tip === obj);
        if (!root || root.connected) return;
        this.tweens.killTweensOf(root.tip);
        root.tip.setPosition(
          Phaser.Math.Clamp(x, 40, GAME_WIDTH - 40),
          Phaser.Math.Clamp(y, GROUND_Y + 60, GAME_HEIGHT - 40),
        );
        this.drawRoots();
      },
    );

    this.input.on(
      Phaser.Input.Events.DRAG_END,
      (_p: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
        const root = this.roots.find((r) => r.tip === obj);
        if (!root || root.connected) return;

        const spot = this.spots.find(
          (s) =>
            !s.taken &&
            Phaser.Math.Distance.Between(root.tip.x, root.tip.y, s.x, s.y) < SNAP_DISTANCE,
        );
        if (spot) {
          this.connectRoot(root, spot);
        } else {
          // No penalty — the root just drifts home.
          AudioManager.playSfx(SfxKeys.gentleFail);
          this.tweens.add({
            targets: root.tip,
            x: root.home.x,
            y: root.home.y,
            duration: 450,
            ease: 'Back.easeOut',
            onUpdate: () => this.drawRoots(),
          });
        }
      },
    );
  }

  private connectRoot(root: Root, spot: WaterSpot): void {
    root.connected = true;
    spot.taken = true;
    root.tip.disableInteractive();

    AudioManager.playSfx(SfxKeys.slurp);
    this.tweens.add({
      targets: root.tip,
      x: spot.x,
      y: spot.y,
      duration: 200,
      ease: 'Sine.easeOut',
      onUpdate: () => this.drawRoots(),
      onComplete: () => {
        this.drawRoots();
        this.streamWater(root);
      },
    });

    // The water pocket dims as it's drunk; sparkles celebrate.
    this.tweens.add({
      targets: spot.group,
      alpha: 0.45,
      scale: 0.85,
      duration: 900,
      delay: 300,
    });

    this.connectedCount++;
    this.titu?.setLeafHealth(0.15 + this.connectedCount * 0.28);
    AudioManager.playSfx(SfxKeys.leafWiggle);

    if (this.connectedCount === this.roots.length) {
      this.time.delayedCall(1300, () =>
        this.completeScene(Lines.waterDone, { x: CENTER_X, y: GROUND_Y - 160 }),
      );
    }
  }

  /** Droplets ride the root curve up to the trunk — again and again, gently. */
  private streamWater(root: Root, repeatDelay = 1800): void {
    const curve = this.rootCurve(root);
    for (let i = 0; i < 5; i++) {
      const droplet = this.add
        .image(root.tip.x, root.tip.y, TextureKeys.dropletSmall)
        .setDepth(7)
        .setAlpha(0);
      this.tweens.addCounter({
        from: 1,
        to: 0,
        duration: 1100,
        delay: i * 160,
        ease: 'Sine.easeIn',
        onUpdate: (tween) => {
          const t = tween.getValue() ?? 0;
          const point = curve.getPoint(t);
          droplet.setPosition(point.x, point.y);
          droplet.setAlpha(Math.min(1, (1 - t) * 4) * Math.min(1, t * 4 + 0.2));
        },
        onComplete: () => droplet.destroy(),
      });
    }
    // Keep the scene alive with a slow ambient flow while it lasts.
    this.time.delayedCall(repeatDelay, () => {
      if (this.scene.isActive()) this.streamWater(root, 2600);
    });
  }

  // ── root rendering ───────────────────────────────────────────────────────

  private rootCurve(root: Root): Phaser.Curves.QuadraticBezier {
    const from = root.anchor;
    const to = new Phaser.Math.Vector2(root.tip.x, root.tip.y);
    const control = new Phaser.Math.Vector2(
      (from.x + to.x) / 2 + (to.x - from.x) * 0.25,
      (from.y + to.y) / 2 + 40,
    );
    return new Phaser.Curves.QuadraticBezier(to, control, from);
  }

  private drawRoots(): void {
    const g = this.rootsG;
    g.clear();
    for (const root of this.roots) {
      const curve = this.rootCurve(root);
      const points = curve.getPoints(24);
      // Tapered organic root: outer bark line then a lighter core.
      g.lineStyle(22, Colors.tituTrunkDark, 1);
      this.strokePoints(g, points);
      g.lineStyle(14, Colors.tituTrunk, 1);
      this.strokePoints(g, points);
      if (root.connected) {
        // Water shimmer inside a drinking root.
        g.lineStyle(6, Colors.waterBlue, 0.9);
        this.strokePoints(g, points);
      }
    }
  }

  private strokePoints(g: Phaser.GameObjects.Graphics, points: Phaser.Math.Vector2[]): void {
    g.beginPath();
    points.forEach((p, i) => (i === 0 ? g.moveTo(p.x, p.y) : g.lineTo(p.x, p.y)));
    g.strokePath();
  }
}
