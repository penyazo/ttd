import { isTileWalkable } from './map.js';
import { VEHICLE_TYPES, getVehicleDefinition } from './vehicle-definitions.js';

export function createVehicle(path, type = VEHICLE_TYPES.TRUCK) {
  const [startTile] = path;
  const definition = getVehicleDefinition(type);

  return {
    type: definition.type,
    x: startTile?.x ?? 0,
    y: startTile?.y ?? 0,
    path,
    pathIndex: 0,
    progress: 0,
    speed: definition.speed,
    curveSpeedMultiplier: definition.curveSpeedMultiplier,
  };
}

export function updateVehicle(vehicle, map) {
  if (!vehicle.path.length) {
    return vehicle;
  }

  const nextIndex = (vehicle.pathIndex + 1) % vehicle.path.length;
  const nextTile = vehicle.path[nextIndex];

  if (!isPathTileValid(map, nextTile)) {
    return vehicle;
  }

  const currentSpeed = getCurrentVehicleSpeed(vehicle);
  const updatedProgress = vehicle.progress + currentSpeed / 60;

  if (updatedProgress < 1) {
    return {
      ...vehicle,
      progress: updatedProgress,
    };
  }

  return {
    ...vehicle,
    x: nextTile.x,
    y: nextTile.y,
    pathIndex: nextIndex,
    progress: 0,
  };
}

export function getVehicleRenderPosition(vehicle) {
  const currentTile = vehicle.path[vehicle.pathIndex] ?? { x: vehicle.x, y: vehicle.y };
  const nextTile = vehicle.path[(vehicle.pathIndex + 1) % vehicle.path.length] ?? currentTile;

  return {
    x: lerp(currentTile.x, nextTile.x, vehicle.progress),
    y: lerp(currentTile.y, nextTile.y, vehicle.progress),
  };
}

function getCurrentVehicleSpeed(vehicle) {
  return isNearCurve(vehicle) ? vehicle.speed * vehicle.curveSpeedMultiplier : vehicle.speed;
}

function isNearCurve(vehicle) {
  return isCurveAt(vehicle, vehicle.pathIndex) || isCurveAt(vehicle, vehicle.pathIndex + 1);
}

function isCurveAt(vehicle, pathIndex) {
  const pathLength = vehicle.path.length;

  if (pathLength < 3) {
    return false;
  }

  const previousTile = vehicle.path[getWrappedIndex(pathIndex - 1, pathLength)];
  const currentTile = vehicle.path[getWrappedIndex(pathIndex, pathLength)];
  const nextTile = vehicle.path[getWrappedIndex(pathIndex + 1, pathLength)];
  const incomingDirection = getDirection(previousTile, currentTile);
  const outgoingDirection = getDirection(currentTile, nextTile);

  return incomingDirection.x !== outgoingDirection.x || incomingDirection.y !== outgoingDirection.y;
}

function getDirection(fromTile, toTile) {
  return {
    x: Math.sign(toTile.x - fromTile.x),
    y: Math.sign(toTile.y - fromTile.y),
  };
}

function getWrappedIndex(index, length) {
  return (index + length) % length;
}

function isPathTileValid(map, tile) {
  return tile && isTileWalkable(map, tile.x, tile.y);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}
