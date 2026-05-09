import { getRoadAssetKey } from './road-view.js';
import { VEHICLE_ATLAS_FRAMES } from './assets.js';
import { projectGridToIso } from './iso.js';

export const VEHICLE_OFFSET_X = 0;
export const VEHICLE_OFFSET_Y = -54;
export const LOWER_CURVE_VEHICLE_OFFSET_Y = -2;

export function getVehicleCurveOffset(map, vehicle) {
  const pathLength = vehicle.path.length;
  const currentTile = vehicle.path[vehicle.pathIndex];
  const nextTile = vehicle.path[(vehicle.pathIndex + 1) % pathLength];

  if (!currentTile) {
    return { x: 0, y: 0 };
  }

  return {
    x: 0,
    y: isLowerCurveTile(map, currentTile) || isLowerCurveTile(map, nextTile) ? LOWER_CURVE_VEHICLE_OFFSET_Y : 0,
  };
}

export function getVehicleScreenPosition(map, vehicle) {
  const pathLength = vehicle.path.length;

  if (pathLength === 0) {
    return projectGridToIso(map, vehicle.x, vehicle.y);
  }

  const currentTile = vehicle.path[vehicle.pathIndex];
  const previousTile = vehicle.path[getWrappedIndex(vehicle.pathIndex - 1, pathLength)];
  const nextTile = vehicle.path[(vehicle.pathIndex + 1) % pathLength];
  const afterNextTile = vehicle.path[(vehicle.pathIndex + 2) % pathLength];

  if (isCurveBetween(currentTile, nextTile, afterNextTile)) {
    if (vehicle.progress >= 0.5) {
      return getCurvedScreenPosition(map, currentTile, nextTile, afterNextTile, vehicle.progress - 0.5);
    }

    return getLinearScreenPosition(map, currentTile, nextTile, vehicle.progress);
  }

  if (isCurveBetween(previousTile, currentTile, nextTile)) {
    if (vehicle.progress < 0.5) {
      return getCurvedScreenPosition(map, previousTile, currentTile, nextTile, vehicle.progress + 0.5);
    }

    return getLinearScreenPosition(map, currentTile, nextTile, vehicle.progress);
  }

  return getLinearScreenPosition(map, currentTile, nextTile, vehicle.progress);
}

export function getVehicleFrameName(vehicle) {
  const pathLength = vehicle.path.length;

  if (pathLength === 0) {
    return VEHICLE_ATLAS_FRAMES.truckSouthEast;
  }

  const currentTile = vehicle.path[vehicle.pathIndex];
  const nextTile = vehicle.path[(vehicle.pathIndex + 1) % vehicle.path.length];
  const previousTile = vehicle.path[getWrappedIndex(vehicle.pathIndex - 1, pathLength)];
  const afterNextTile = vehicle.path[(vehicle.pathIndex + 2) % pathLength];

  if (currentTile && nextTile && afterNextTile && isCurveBetween(currentTile, nextTile, afterNextTile)) {
    const turnFrameName = vehicle.progress >= 0.5
      ? getCurveFrameName(currentTile, nextTile, afterNextTile, vehicle.progress - 0.5)
      : getVehicleFrameNameByDirection(nextTile.x - currentTile.x, nextTile.y - currentTile.y);

    if (turnFrameName) {
      return turnFrameName;
    }
  }

  if (previousTile && currentTile && nextTile && isCurveBetween(previousTile, currentTile, nextTile)) {
    const turnFrameName = vehicle.progress < 0.5
      ? getCurveFrameName(previousTile, currentTile, nextTile, 0.5 + vehicle.progress)
      : getVehicleFrameNameByDirection(nextTile.x - currentTile.x, nextTile.y - currentTile.y);

    if (turnFrameName) {
      return turnFrameName;
    }
  }

  if (currentTile && nextTile) {
    return getVehicleFrameNameByDirection(nextTile.x - currentTile.x, nextTile.y - currentTile.y);
  }

  if (previousTile && currentTile) {
    return getVehicleFrameNameByDirection(currentTile.x - previousTile.x, currentTile.y - previousTile.y);
  }

  return VEHICLE_ATLAS_FRAMES.truckSouthEast;
}

function getCurveFrameName(previousTile, currentTile, nextTile, progress) {
  const incomingDirection = getDirection(previousTile, currentTile);
  const outgoingDirection = getDirection(currentTile, nextTile);

  if (incomingDirection.x === outgoingDirection.x && incomingDirection.y === outgoingDirection.y) {
    return null;
  }

  if (progress < 0.33) {
    return getVehicleFrameNameByDirection(incomingDirection.x, incomingDirection.y);
  }

  if (progress > 0.66) {
    return getVehicleFrameNameByDirection(outgoingDirection.x, outgoingDirection.y);
  }

  // En isometrico, un giro entre dos diagonales pasa visualmente por un cardinal.
  const visualIncoming = getVisualDirectionName(incomingDirection.x, incomingDirection.y);
  const visualOutgoing = getVisualDirectionName(outgoingDirection.x, outgoingDirection.y);

  if ((visualIncoming === 'northEast' && visualOutgoing === 'southEast')
    || (visualIncoming === 'southEast' && visualOutgoing === 'northEast')) {
    return VEHICLE_ATLAS_FRAMES.truckEast;
  }

  if ((visualIncoming === 'southEast' && visualOutgoing === 'southWest')
    || (visualIncoming === 'southWest' && visualOutgoing === 'southEast')) {
    return VEHICLE_ATLAS_FRAMES.truckSouth;
  }

  if ((visualIncoming === 'southWest' && visualOutgoing === 'northWest')
    || (visualIncoming === 'northWest' && visualOutgoing === 'southWest')) {
    return VEHICLE_ATLAS_FRAMES.truckWest;
  }

  if ((visualIncoming === 'northWest' && visualOutgoing === 'northEast')
    || (visualIncoming === 'northEast' && visualOutgoing === 'northWest')) {
    return VEHICLE_ATLAS_FRAMES.truckNorth;
  }

  return null;
}

function getCurvedScreenPosition(map, currentTile, nextTile, afterNextTile, progress) {
  const start = projectGridToIso(map, currentTile.x, currentTile.y);
  const end = projectGridToIso(map, nextTile.x, nextTile.y);
  const afterEnd = projectGridToIso(map, afterNextTile.x, afterNextTile.y);
  const entry = midpoint(start, end);
  const exit = midpoint(end, afterEnd);

  return quadraticBezier(entry, end, exit, progress);
}

function getLinearScreenPosition(map, currentTile, nextTile, progress) {
  const start = projectGridToIso(map, currentTile.x, currentTile.y);
  const end = projectGridToIso(map, nextTile.x, nextTile.y);

  return {
    x: lerp(start.x, end.x, progress),
    y: lerp(start.y, end.y, progress),
  };
}

function quadraticBezier(start, control, end, progress) {
  const inverseProgress = 1 - progress;
  const startWeight = inverseProgress ** 2;
  const controlWeight = 2 * inverseProgress * progress;
  const endWeight = progress ** 2;

  return {
    x: start.x * startWeight
      + control.x * controlWeight
      + end.x * endWeight,
    y: start.y * startWeight
      + control.y * controlWeight
      + end.y * endWeight,
  };
}

function isCurveBetween(previousTile, currentTile, nextTile) {
  const incomingDirection = getDirection(previousTile, currentTile);
  const outgoingDirection = getDirection(currentTile, nextTile);

  return incomingDirection.x !== outgoingDirection.x || incomingDirection.y !== outgoingDirection.y;
}

function isLowerCurveTile(map, tile) {
  if (!tile) {
    return false;
  }

  const roadAssetKey = getRoadAssetKey(map, tile.x, tile.y);

  return roadAssetKey === 'roadCurveNorthEast' || roadAssetKey === 'roadCurveNorthWest';
}

function getDirection(fromTile, toTile) {
  return {
    x: Math.sign(toTile.x - fromTile.x),
    y: Math.sign(toTile.y - fromTile.y),
  };
}

function midpoint(start, end) {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function getWrappedIndex(index, length) {
  return (index + length) % length;
}

function getVisualDirectionName(dx, dy) {
  if (dx > 0 && dy === 0) {
    return 'southEast';
  }

  if (dx === 0 && dy > 0) {
    return 'southWest';
  }

  if (dx < 0 && dy === 0) {
    return 'northWest';
  }

  if (dx === 0 && dy < 0) {
    return 'northEast';
  }

  return null;
}

function getVehicleFrameNameByDirection(dx, dy) {
  if (dx > 0 && dy < 0) {
    return VEHICLE_ATLAS_FRAMES.truckEast;
  }

  if (dx > 0 && dy === 0) {
    return VEHICLE_ATLAS_FRAMES.truckSouthEast;
  }

  if (dx > 0 && dy > 0) {
    return VEHICLE_ATLAS_FRAMES.truckSouth;
  }

  if (dx === 0 && dy > 0) {
    return VEHICLE_ATLAS_FRAMES.truckSouthWest;
  }

  if (dx < 0 && dy > 0) {
    return VEHICLE_ATLAS_FRAMES.truckWest;
  }

  if (dx < 0 && dy === 0) {
    return VEHICLE_ATLAS_FRAMES.truckNorthWest;
  }

  if (dx < 0 && dy < 0) {
    return VEHICLE_ATLAS_FRAMES.truckNorth;
  }

  if (dx === 0 && dy < 0) {
    return VEHICLE_ATLAS_FRAMES.truckNorthEast;
  }

  return VEHICLE_ATLAS_FRAMES.truckSouthEast;
}
