import { TILE_SIZE, getMapHeight, getMapWidth } from '../core/map.js';

export const ISO_TILE_WIDTH = 132;
export const ISO_TILE_HEIGHT = 66;
export const ISO_ORIGIN_Y = TILE_SIZE;

export function getIsoOriginX(map) {
  return getMapHeight(map) * (ISO_TILE_WIDTH / 2);
}

export function getIsoCanvasSize(map) {
  const mapPixelWidth = (getMapWidth(map) + getMapHeight(map)) * (ISO_TILE_WIDTH / 2);
  const mapPixelHeight = (getMapWidth(map) + getMapHeight(map)) * (ISO_TILE_HEIGHT / 2);

  return {
    width: mapPixelWidth,
    height: mapPixelHeight + TILE_SIZE * 3,
  };
}

export function projectGridToIso(map, x, y) {
  return {
    x: (x - y) * (ISO_TILE_WIDTH / 2) + getIsoOriginX(map),
    y: (x + y) * (ISO_TILE_HEIGHT / 2) + ISO_ORIGIN_Y + ISO_TILE_HEIGHT / 2,
  };
}

export function getTileCenterPosition(map, x, y) {
  const basePosition = projectGridToIso(map, x, y);

  return {
    x: basePosition.x,
    y: basePosition.y - ISO_TILE_HEIGHT,
  };
}

export function projectIsoToGrid(map, screenX, screenY) {
  const localX = screenX - getIsoOriginX(map);
  const localY = screenY - ISO_ORIGIN_Y + ISO_TILE_HEIGHT / 2;
  const gridX = (localY / (ISO_TILE_HEIGHT / 2) + localX / (ISO_TILE_WIDTH / 2)) / 2;
  const gridY = (localY / (ISO_TILE_HEIGHT / 2) - localX / (ISO_TILE_WIDTH / 2)) / 2;

  return {
    x: Math.floor(gridX + 0.5),
    y: Math.floor(gridY + 0.5),
  };
}
