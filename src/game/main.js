import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';

import { gameMap } from '../core/map.js';
import { getIsoCanvasSize } from './iso.js';
import { GameScene } from './scene.js';

const canvasSize = getIsoCanvasSize(gameMap);

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: canvasSize.width,
  height: canvasSize.height,
  backgroundColor: '#1f2933',
  pixelArt: true,
  scene: [GameScene],
};

// El arranque de Phaser queda en game; el estado y las reglas no conocen el framework.
new Phaser.Game(config);
