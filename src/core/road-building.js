import {
  TILE_TYPES,
  canBuildRoad,
  getTileType,
  setRoadTileType,
  setTileType,
} from './map.js';

export function buildRoadAt(map, roads, x, y, roadTileType) {
  if (!canBuildRoad(map, x, y)) {
    return false;
  }

  setTileType(map, x, y, TILE_TYPES.ROAD);
  setRoadTileType(roads, x, y, roadTileType);

  return true;
}

export function deleteRoadAt(map, roads, x, y) {
  if (getTileType(map, x, y) !== TILE_TYPES.ROAD) {
    return false;
  }

  setTileType(map, x, y, TILE_TYPES.GRASS);
  setRoadTileType(roads, x, y, null);

  return true;
}
