import { ROAD_TILE_TYPES } from '../../core/map.js';
import { LANDSCAPE_ATLAS, ROAD_ATLAS_FRAMES } from '../assets.js';

const BUTTON_SIZE = 54;
const BUTTON_GAP = 8;
const BUTTON_SCALE = 0.34;
const MENU_PADDING = 8;
const CLOSE_BUTTON_SIZE = 32;

export const ROAD_SELECTOR_ACTIONS = {
  DELETE: 'deleteRoad',
};

const ROAD_SELECTOR_ITEMS = [
  ROAD_TILE_TYPES.STRAIGHT_EAST_WEST,
  ROAD_TILE_TYPES.STRAIGHT_NORTH_SOUTH,
  ROAD_TILE_TYPES.CURVE_NORTH_EAST,
  ROAD_TILE_TYPES.CURVE_SOUTH_EAST,
  ROAD_TILE_TYPES.CURVE_SOUTH_WEST,
  ROAD_TILE_TYPES.CURVE_NORTH_WEST,
  ROAD_TILE_TYPES.INTERSECTION,
  ROAD_SELECTOR_ACTIONS.DELETE,
];

export function createRoadSelector(scene, options = {}) {
  let isOpen = false;
  let selectedRoadTileType = null;
  const buttons = [];
  const container = scene.add.container(16, 16);
  const menuBackground = scene.add
    .rectangle(0, 0, getClosedMenuWidth(), getMenuHeight(), 0x020617, 0.88)
    .setOrigin(0, 0)
    .setStrokeStyle(2, 0x64748b, 1);
  const closeButton = createCloseButton(scene);

  container.setDepth(20000);
  container.add(menuBackground);

  ROAD_SELECTOR_ITEMS.forEach((selectorValue, index) => {
    const x = MENU_PADDING + index * (BUTTON_SIZE + BUTTON_GAP);
    const button = createRoadButton(scene, x, MENU_PADDING, selectorValue);

    button.hitArea.on('pointerdown', (pointer, localX, localY, event) => {
      event.stopPropagation();

      if (!isOpen) {
        isOpen = true;
        updateMenuState(menuBackground, buttons, closeButton, selectedRoadTileType, isOpen);
        return;
      }

      selectedRoadTileType = selectedRoadTileType === selectorValue ? null : selectorValue;
      updateMenuState(menuBackground, buttons, closeButton, selectedRoadTileType, isOpen);
      options.onSelectionChange?.(selectedRoadTileType);
    });

    buttons.push(button);
    container.add([button.background, button.content, button.highlight, button.hitArea]);
  });

  closeButton.hitArea.on('pointerdown', (pointer, localX, localY, event) => {
    event.stopPropagation();

    isOpen = false;
    updateMenuState(menuBackground, buttons, closeButton, selectedRoadTileType, isOpen);
  });

  container.add([closeButton.background, closeButton.label, closeButton.hitArea]);
  updateMenuState(menuBackground, buttons, closeButton, selectedRoadTileType, isOpen);

  return {
    getSelectedRoadTileType() {
      return selectedRoadTileType;
    },
    isPointerOver(pointer) {
      const selectorWidth = isOpen
        ? getOpenMenuWidth()
        : getClosedMenuWidth();

      return pointer.x >= container.x
        && pointer.x <= container.x + selectorWidth
        && pointer.y >= container.y
        && pointer.y <= container.y + getMenuHeight();
    },
  };
}

function createRoadButton(scene, x, y, selectorValue) {
  const background = scene.add
    .rectangle(x, y, BUTTON_SIZE, BUTTON_SIZE, 0x111827, 0.85)
    .setOrigin(0, 0);
  const highlight = scene.add
    .rectangle(x, y, BUTTON_SIZE, BUTTON_SIZE)
    .setOrigin(0, 0)
    .setStrokeStyle(3, 0xffff00, 1)
    .setVisible(false);
  const content = createRoadButtonContent(scene, x, y, selectorValue);
  const hitArea = scene.add
    .rectangle(x, y, BUTTON_SIZE, BUTTON_SIZE, 0xffffff, 0.001)
    .setOrigin(0, 0)
    .setInteractive({ useHandCursor: true });

  return {
    roadTileType: selectorValue,
    background,
    content,
    highlight,
    hitArea,
  };
}

function createRoadButtonContent(scene, x, y, selectorValue) {
  if (selectorValue === ROAD_SELECTOR_ACTIONS.DELETE) {
    return scene.add
      .text(x + BUTTON_SIZE / 2, y + BUTTON_SIZE / 2, 'DEL', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#f87171',
      })
      .setOrigin(0.5, 0.5);
  }

  return scene.add
    .image(
      x + BUTTON_SIZE / 2,
      y + BUTTON_SIZE / 2 + 14,
      LANDSCAPE_ATLAS.key,
      ROAD_ATLAS_FRAMES[selectorValue],
    )
    .setOrigin(0.5, 1)
    .setScale(BUTTON_SCALE);
}

function createCloseButton(scene) {
  const background = scene.add
    .rectangle(0, MENU_PADDING, CLOSE_BUTTON_SIZE, BUTTON_SIZE, 0x450a0a, 0.9)
    .setOrigin(0, 0);
  const label = scene.add
    .text(0, MENU_PADDING + BUTTON_SIZE / 2, 'X', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
    })
    .setOrigin(0.5, 0.5);
  const hitArea = scene.add
    .rectangle(0, MENU_PADDING, CLOSE_BUTTON_SIZE, BUTTON_SIZE, 0xffffff, 0.001)
    .setOrigin(0, 0)
    .setInteractive({ useHandCursor: true });

  return {
    background,
    label,
    hitArea,
  };
}

function updateButtonStates(buttons, selectedRoadTileType) {
  for (const button of buttons) {
    const isSelected = button.roadTileType === selectedRoadTileType;

    button.highlight.setVisible(isSelected);
    button.background.setFillStyle(isSelected ? 0x374151 : 0x111827, 0.85);
  }
}

function updateMenuState(menuBackground, buttons, closeButton, selectedRoadTileType, isOpen) {
  const selectorWidth = isOpen ? getOpenMenuWidth() : getClosedMenuWidth();

  menuBackground.setSize(selectorWidth, getMenuHeight());
  updateButtonStates(buttons, selectedRoadTileType);

  buttons.forEach((button, index) => {
    setButtonVisible(button, isOpen || index === 0);
  });
  updateCloseButton(closeButton, isOpen);
}

function setButtonVisible(button, isVisible) {
  button.background.setVisible(isVisible);
  button.content.setVisible(isVisible);
  button.highlight.setVisible(isVisible && button.highlight.visible);
  button.hitArea.setVisible(isVisible);
}

function updateCloseButton(closeButton, isOpen) {
  const x = getOpenMenuWidth() - MENU_PADDING - CLOSE_BUTTON_SIZE;

  closeButton.background.setPosition(x, MENU_PADDING).setVisible(isOpen);
  closeButton.label.setPosition(x + CLOSE_BUTTON_SIZE / 2, MENU_PADDING + BUTTON_SIZE / 2).setVisible(isOpen);
  closeButton.hitArea.setPosition(x, MENU_PADDING).setVisible(isOpen);
}

function getClosedMenuWidth() {
  return BUTTON_SIZE + MENU_PADDING * 2;
}

function getOpenMenuWidth() {
  const buttonListWidth = ROAD_SELECTOR_ITEMS.length * BUTTON_SIZE
    + (ROAD_SELECTOR_ITEMS.length - 1) * BUTTON_GAP;

  return MENU_PADDING * 2 + buttonListWidth + BUTTON_GAP + CLOSE_BUTTON_SIZE;
}

function getMenuHeight() {
  return BUTTON_SIZE + MENU_PADDING * 2;
}
