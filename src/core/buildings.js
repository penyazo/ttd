import { isTileBuildable } from './map.js';

export const BUILDING_TYPES = {
  SMALL_HOUSE: 'smallHouse',
  SHOP: 'shop',
  DEPOT: 'depot',
};

export const buildings = [
  {
    id: 'house-1',
    type: BUILDING_TYPES.SMALL_HOUSE,
    x: 11,
    y: 4,
    width: 1,
    height: 1,
  },
];

export function getBuildings(map) {
  if (!map) {
    return buildings;
  }

  return buildings.filter((building) => canPlaceBuilding(map, building));
}

export function canPlaceBuilding(map, building) {
  const width = building.width ?? 1;
  const height = building.height ?? 1;

  for (let y = building.y; y < building.y + height; y += 1) {
    for (let x = building.x; x < building.x + width; x += 1) {
      if (!isTileBuildable(map, x, y)) {
        return false;
      }
    }
  }

  return true;
}
