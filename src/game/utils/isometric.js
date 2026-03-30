// Tile image dimensions
export const TILE_IMG_WIDTH = 256
export const TILE_IMG_HEIGHT = 512

// Diamond footprint: 256px wide, 128px tall (2:1 isometric ratio)
// Measured from actual Kenney tile: top at y=373, equator at y=437
export const TILE_WIDTH = 256
export const TILE_HEIGHT = 128

// Origin points within the 256x512 tile image
// Equator (widest point of diamond) is at y=437 → 437/512 = 0.8535
export const TILE_ORIGIN_X = 0.5
export const TILE_ORIGIN_Y = 0.8535

// Character origin: feet at y=455 → 455/512 = 0.8887, centered at x=0.5
export const CHAR_ORIGIN_X = 0.5
export const CHAR_ORIGIN_Y = 0.8887

// Convert grid (col, row) to screen (x, y)
// Screen position is where the tile origin point should be placed
export function gridToScreen(col, row) {
  const x = (col - row) * (TILE_WIDTH / 2)
  const y = (col + row) * (TILE_HEIGHT / 2)
  return { x, y }
}

// Convert screen (x, y) back to grid (col, row)
export function screenToGrid(screenX, screenY) {
  const col = (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2
  const row = (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2
  return { col: Math.round(col), row: Math.round(row) }
}
