import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';

import {
  gameMap,
  getMapHeight,
  getMapWidth,
  getTileType,
} from '../core/map.js';
import { getBuildings } from '../core/buildings.js';
import { createHardcodedRoute } from '../core/pathfinding.js';
import { createVehicle, updateVehicle } from '../core/vehicle.js';
import { BUILDING_ATLAS, LANDSCAPE_ATLAS, VEHICLE_ATLAS } from './assets.js';
import { renderBuildings } from './building-view.js';
import { projectGridToIso } from './iso.js';
import { getTileFrameName } from './road-view.js';
import {
  VEHICLE_OFFSET_X,
  VEHICLE_OFFSET_Y,
  getVehicleFrameName,
  getVehicleCurveOffset,
  getVehicleScreenPosition,
} from './vehicle-view.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.atlasXML(LANDSCAPE_ATLAS.key, LANDSCAPE_ATLAS.texturePath, LANDSCAPE_ATLAS.atlasPath);
    this.load.atlasXML(VEHICLE_ATLAS.key, VEHICLE_ATLAS.texturePath, VEHICLE_ATLAS.atlasPath);
    this.load.atlasXML(BUILDING_ATLAS.key, BUILDING_ATLAS.texturePath, BUILDING_ATLAS.atlasPath);
  }

  create() {
    this.renderMap();
    renderBuildings(this, gameMap, getBuildings(gameMap));

    const initialPath = createHardcodedRoute();

    // Phaser solo representa el estado: la ruta y el movimiento viven en core.
    this.vehicle = createVehicle(initialPath);
    this.vehicleSprite = this.add
      .image(0, 0, VEHICLE_ATLAS.key, getVehicleFrameName(this.vehicle))
      .setOrigin(0.5, 1);
    this.syncVehicleSprite();
  }

  update() {
    this.vehicle = updateVehicle(this.vehicle, gameMap);
    this.syncVehicleSprite();
  }

  renderMap() {
    for (let y = 0; y < getMapHeight(gameMap); y += 1) {
      for (let x = 0; x < getMapWidth(gameMap); x += 1) {
        const tileType = getTileType(gameMap, x, y);
        const frameName = getTileFrameName(gameMap, tileType, x, y);
        const screenPosition = projectGridToIso(gameMap, x, y);

        this.add
          .image(screenPosition.x, screenPosition.y, LANDSCAPE_ATLAS.key, frameName)
          .setOrigin(0.5, 1)
          .setDepth(x + y);
      }
    }
  }

  syncVehicleSprite() {
    const screenPosition = getVehicleScreenPosition(gameMap, this.vehicle);
    const curveOffset = getVehicleCurveOffset(gameMap, this.vehicle);

    this.vehicleSprite.setTexture(VEHICLE_ATLAS.key, getVehicleFrameName(this.vehicle));
    this.vehicleSprite.setPosition(
      screenPosition.x + VEHICLE_OFFSET_X + curveOffset.x,
      screenPosition.y + VEHICLE_OFFSET_Y + curveOffset.y,
    );
    this.vehicleSprite.setDepth(screenPosition.y + 100);
  }
}
