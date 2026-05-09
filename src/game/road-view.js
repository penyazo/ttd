import { TILE_ASSET_KEYS, TILE_TYPES, getTileType } from '../core/map.js';
import { ROAD_ATLAS_FRAMES, TILE_ATLAS_FRAMES } from './assets.js';
import { getWaterFrameName } from './water-view.js';

export function getTileFrameName(map, tileType, x, y) {
  if (tileType === TILE_TYPES.BLOCKED) {
    return getWaterFrameName(map, x, y);
  }

  if (tileType !== TILE_TYPES.ROAD) {
    return TILE_ATLAS_FRAMES[TILE_ASSET_KEYS[tileType]];
  }

  const roadAssetKey = getRoadAssetKey(map, x, y);

  return ROAD_ATLAS_FRAMES[roadAssetKey] ?? TILE_ATLAS_FRAMES[TILE_ASSET_KEYS[TILE_TYPES.ROAD]];
}

export function getRoadAssetKey(map, x, y) {
  const north = isRoad(map, x, y - 1);
  const east = isRoad(map, x + 1, y);
  const south = isRoad(map, x, y + 1);
  const west = isRoad(map, x - 1, y);

  if (east && west) {
    return 'roadStraightEastWest';
  }

  if (north && south) {
    return 'roadStraightNorthSouth';
  }

  if (north && east) {
    return 'roadCurveNorthEast';
  }

  if (east && south) {
    return 'roadCurveSouthEast';
  }

  if (south && west) {
    return 'roadCurveSouthWest';
  }

  if (west && north) {
    return 'roadCurveNorthWest';
  }

  if (east || west) {
    return 'roadStraightEastWest';
  }

  return 'roadStraightNorthSouth';
}

function isRoad(map, x, y) {
  return getTileType(map, x, y) === TILE_TYPES.ROAD;
}
