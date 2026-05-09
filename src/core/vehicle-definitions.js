export const VEHICLE_TYPES = {
  TRUCK: 'truck',
};

export const VEHICLE_DEFINITIONS = {
  [VEHICLE_TYPES.TRUCK]: {
    type: VEHICLE_TYPES.TRUCK,
    speed: 2,
    curveSpeedMultiplier: 0.6,
  },
};

export function getVehicleDefinition(type) {
  return VEHICLE_DEFINITIONS[type] ?? VEHICLE_DEFINITIONS[VEHICLE_TYPES.TRUCK];
}
