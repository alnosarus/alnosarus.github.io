export const MAP_WIDTH = 10
export const MAP_HEIGHT = 10

// 10x10 grid of tile keys — single tile type for now
export const mapTiles = Array.from({ length: MAP_HEIGHT }, () =>
  Array.from({ length: MAP_WIDTH }, () => 'tile-dirt')
)
