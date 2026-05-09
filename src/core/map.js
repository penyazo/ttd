export const TILE_SIZE = 32;

export const TILE_TYPES = {
  GRASS: 0,
  ROAD: 1,
  BLOCKED: 2,
  SAND: 3,
};

export const ROAD_TILE_TYPES = {
  STRAIGHT_EAST_WEST: 'roadStraightEastWest',
  STRAIGHT_NORTH_SOUTH: 'roadStraightNorthSouth',
  CURVE_NORTH_EAST: 'roadCurveNorthEast',
  CURVE_SOUTH_EAST: 'roadCurveSouthEast',
  CURVE_SOUTH_WEST: 'roadCurveSouthWest',
  CURVE_NORTH_WEST: 'roadCurveNorthWest',
  INTERSECTION: 'roadIntersection',
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

// Cada carretera guarda su pieza visual de forma explícita; no se deduce por vecinos.
export const roadMap = [
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [
    null,
    ROAD_TILE_TYPES.CURVE_SOUTH_EAST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.CURVE_SOUTH_WEST,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    ROAD_TILE_TYPES.CURVE_NORTH_EAST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.CURVE_SOUTH_WEST,
    null,
    null,
    null,
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    null,
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    null,
    null,
    ROAD_TILE_TYPES.CURVE_NORTH_EAST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
    ROAD_TILE_TYPES.CURVE_NORTH_WEST,
    null,
    null,
    null,
    null,
    null,
  ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
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

export function getRoadTileType(roads, x, y) {
  if (!isInsideMap(roads, x, y)) {
    return null;
  }

  return roads[y][x];
}

export function isTileWalkable(map, x, y) {
  return getTileType(map, x, y) === TILE_TYPES.ROAD;
}

export function isTileBuildable(map, x, y) {
  return getTileType(map, x, y) === TILE_TYPES.SAND;
}

export function canBuildRoad(map, x, y) {
  const tileType = getTileType(map, x, y);

  return tileType === TILE_TYPES.GRASS
    || tileType === TILE_TYPES.SAND
    || tileType === TILE_TYPES.ROAD;
}

export function setTileType(map, x, y, tileType) {
  if (!isInsideMap(map, x, y)) {
    return map;
  }

  map[y][x] = tileType;

  return map;
}

export function setRoadTileType(roads, x, y, roadTileType) {
  if (!isInsideMap(roads, x, y)) {
    return roads;
  }

  roads[y][x] = roadTileType;

  return roads;
}
