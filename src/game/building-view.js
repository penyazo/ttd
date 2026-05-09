import { BUILDING_TYPES } from '../core/buildings.js';
import { BUILDING_ATLAS } from './assets.js';
import { ISO_TILE_HEIGHT, projectGridToIso } from './iso.js';

const BUILDING_TILE_CENTER_OFFSET_Y = -ISO_TILE_HEIGHT / 2;

const BUILDING_PRESETS = {
  [BUILDING_TYPES.SMALL_HOUSE]: [
    {
      frame: 'buildingTiles_001.png',
      offsetX: 0,
      offsetY: 0,
      depthOffset: 0,
    },
    {
      frame: 'buildingTiles_091.png',
      offsetX: 0,
      offsetY: -72,
      depthOffset: 1,
    },
  ],
  [BUILDING_TYPES.SHOP]: [
    {
      frame: 'buildingTiles_040.png',
      offsetX: 0,
      offsetY: 0,
      depthOffset: 0,
    },
  ],
  [BUILDING_TYPES.DEPOT]: [
    {
      frame: 'buildingTiles_085.png',
      offsetX: 0,
      offsetY: 0,
      depthOffset: 0,
    },
  ],
};

export function renderBuilding(scene, map, building) {
  const screenPosition = projectGridToIso(map, building.x, building.y);
  const buildingPosition = {
    x: screenPosition.x,
    y: screenPosition.y + BUILDING_TILE_CENTER_OFFSET_Y,
  };
  const parts = BUILDING_PRESETS[building.type] ?? [];

  for (const part of parts) {
    scene.add
      .image(
        buildingPosition.x + part.offsetX,
        buildingPosition.y + part.offsetY,
        BUILDING_ATLAS.key,
        part.frame,
      )
      .setOrigin(0.5, 1)
      .setDepth(buildingPosition.y + part.depthOffset);
  }
}

export function renderBuildings(scene, map, buildings) {
  for (const building of buildings) {
    renderBuilding(scene, map, building);
  }
}
