import { isTileWalkable } from './map.js';

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export function findPath(map, start, goal) {
  const queue = [start];
  const visited = new Set([tileKey(start)]);
  const previousTiles = new Map();

  // Busqueda por anchura: simple y suficiente para un grid pequeno.
  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === goal.x && current.y === goal.y) {
      return buildPath(previousTiles, current);
    }

    for (const direction of DIRECTIONS) {
      const next = {
        x: current.x + direction.x,
        y: current.y + direction.y,
      };

      const key = tileKey(next);

      if (visited.has(key) || !isTileWalkable(map, next.x, next.y)) {
        continue;
      }

      visited.add(key);
      previousTiles.set(key, current);
      queue.push(next);
    }
  }

  return [];
}

export function createHardcodedRoute() {
  // Ruta inicial predefinida para el MVP; el ultimo tile conecta con el primero.
  return [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 8, y: 1 },
    { x: 8, y: 2 },
    { x: 8, y: 3 },
    { x: 8, y: 4 },
    { x: 8, y: 5 },
    { x: 8, y: 6 },
    { x: 8, y: 7 },
    { x: 7, y: 7 },
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 },
    { x: 3, y: 6 },
    { x: 3, y: 5 },
    { x: 2, y: 5 },
    { x: 1, y: 5 },
    { x: 1, y: 4 },
    { x: 1, y: 3 },
    { x: 1, y: 2 },
  ];
}

function buildPath(previousTiles, goal) {
  const path = [goal];
  let current = goal;

  while (previousTiles.has(tileKey(current))) {
    current = previousTiles.get(tileKey(current));
    path.unshift(current);
  }

  return path;
}

function tileKey(tile) {
  return `${tile.x},${tile.y}`;
}
