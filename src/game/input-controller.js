import { TILE_ASSET_KEYS, getTileType, isInsideMap } from '../core/map.js';
import { ISO_TILE_HEIGHT, ISO_TILE_WIDTH, getTileCenterPosition, projectIsoToGrid } from './iso.js';

export function createInputController(scene, map, options = {}) {
  const selectionMarker = createSelectionMarker(scene);
  let isDragging = false;
  let lastDraggedTileKey = null;

  scene.input.on('pointerdown', (pointer) => {
    if (options.shouldIgnorePointer?.(pointer)) {
      return;
    }

    const tile = handlePointerTile(pointer, map, selectionMarker, true);

    if (!tile) {
      return;
    }

    options.onTileSelected?.(tile);
    isDragging = options.shouldStartDrag?.() ?? false;
    lastDraggedTileKey = getTileKey(tile);
  });

  scene.input.on('pointermove', (pointer) => {
    if (!isDragging || !pointer.isDown || options.shouldIgnorePointer?.(pointer)) {
      return;
    }

    const tile = handlePointerTile(pointer, map, selectionMarker, false);

    if (!tile) {
      return;
    }

    const tileKey = getTileKey(tile);

    if (tileKey === lastDraggedTileKey) {
      return;
    }

    lastDraggedTileKey = tileKey;
    options.onTileSelected?.(tile);
  });

  scene.input.on('pointerup', () => {
    isDragging = false;
    lastDraggedTileKey = null;
  });
}

function handlePointerTile(pointer, map, selectionMarker, shouldLog) {
  const tile = projectIsoToGrid(map, pointer.x, pointer.y);

  if (!isInsideMap(map, tile.x, tile.y)) {
    selectionMarker.setVisible(false);
    return null;
  }

  const screenPosition = getTileCenterPosition(map, tile.x, tile.y);

  selectionMarker
    .setPosition(screenPosition.x, screenPosition.y)
    .setVisible(true);

  if (shouldLog) {
    const tileType = getTileType(map, tile.x, tile.y);
    const tileName = TILE_ASSET_KEYS[tileType] ?? 'unknown';

    // El input pertenece a Phaser; el core solo recibe coordenadas de grid.
    console.log(`Tile seleccionado: (${tile.x}, ${tile.y}) ${tileName}`);
  }

  return tile;
}

function getTileKey(tile) {
  return `${tile.x},${tile.y}`;
}

function createSelectionMarker(scene) {
  const marker = scene.add.graphics();

  marker.lineStyle(2, 0xffff00, 0.9);
  marker.strokePoints(
    [
      { x: 0, y: -ISO_TILE_HEIGHT / 2 },
      { x: ISO_TILE_WIDTH / 2, y: 0 },
      { x: 0, y: ISO_TILE_HEIGHT / 2 },
      { x: -ISO_TILE_WIDTH / 2, y: 0 },
    ],
    true,
  );
  marker.setDepth(10000);
  marker.setVisible(false);

  return marker;
}
