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
