import {
  ROAD_TILE_TYPES,
  TILE_ASSET_KEYS,
  TILE_TYPES,
  getRoadTileType,
} from '../core/map.js';
import { ROAD_ATLAS_FRAMES, TILE_ATLAS_FRAMES } from './assets.js';
import { getWaterFrameName } from './water-view.js';

export function getTileFrameName(map, roads, tileType, x, y) {
  if (tileType === TILE_TYPES.BLOCKED) {
    return getWaterFrameName(map, x, y);
  }

  if (tileType !== TILE_TYPES.ROAD) {
    return TILE_ATLAS_FRAMES[TILE_ASSET_KEYS[tileType]];
  }

  const roadAssetKey = getRoadAssetKey(roads, x, y);

  return ROAD_ATLAS_FRAMES[roadAssetKey] ?? TILE_ATLAS_FRAMES[TILE_ASSET_KEYS[TILE_TYPES.ROAD]];
}

export function getRoadAssetKey(roads, x, y) {
  return getRoadTileType(roads, x, y) ?? ROAD_TILE_TYPES.STRAIGHT_EAST_WEST;
}
