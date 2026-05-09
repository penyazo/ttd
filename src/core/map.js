export const TILE_SIZE = 32;

export const TILE_TYPES = {
  GRASS: 0,
  ROAD: 1,
  BLOCKED: 2,
  SAND: 3,
};

// El core usa identificadores numéricos; Phaser decide después cómo se dibujan.
export const TILE_ASSET_KEYS = {
  [TILE_TYPES.GRASS]: 'grass',
  [TILE_TYPES.ROAD]: 'road',
  [TILE_TYPES.BLOCKED]: 'water',
  [TILE_TYPES.SAND]: 'sand',
};

// Grid 14x12: cada número representa un tipo de tile, no una textura concreta.
export const gameMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 2, 2, 2, 0, 0, 1, 0, 3, 3, 3, 0],
  [0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 3, 3, 3, 0],
  [0, 1, 1, 1, 0, 2, 0, 0, 1, 0, 3, 3, 3, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export function getMapWidth(map = gameMap) {
  return map[0]?.length ?? 0;
}

export function getMapHeight(map = gameMap) {
  return map.length;
}

export function isInsideMap(map, x, y) {
  return y >= 0 && y < getMapHeight(map) && x >= 0 && x < getMapWidth(map);
}

export function getTileType(map, x, y) {
  if (!isInsideMap(map, x, y)) {
    return TILE_TYPES.BLOCKED;
  }

  return map[y][x];
}

export function isTileWalkable(map, x, y) {
  return getTileType(map, x, y) === TILE_TYPES.ROAD;
}

export function isTileBuildable(map, x, y) {
  return getTileType(map, x, y) === TILE_TYPES.SAND;
}
