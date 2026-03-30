import Phaser from 'phaser'
import { gridToScreen, TILE_WIDTH, TILE_HEIGHT, TILE_ORIGIN_X, TILE_ORIGIN_Y } from '../utils/isometric'
import { mapTiles, MAP_WIDTH, MAP_HEIGHT } from '../data/mapData'
import Player from '../entities/Player'
import TouchControls from '../ui/TouchControls'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game')
  }

  create() {
    this.renderTileGrid()

    // Spawn player at center of grid
    this.player = new Player(this, MAP_WIDTH / 2, MAP_HEIGHT / 2)

    // Camera follow with smooth lerp
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1)

    // Adaptive zoom
    this.updateZoom()
    this.scale.on('resize', () => this.updateZoom())

    // Touch controls (only visible on touch devices)
    this.touchControls = new TouchControls(this)
  }

  updateZoom() {
    const baseZoom = 1.0
    const referenceWidth = 1920
    const viewportWidth = this.scale.width
    const zoom = baseZoom * (viewportWidth / referenceWidth)
    this.cameras.main.setZoom(Phaser.Math.Clamp(zoom, 0.5, 1.2))
  }

  renderTileGrid() {
    for (let row = 0; row < MAP_HEIGHT; row++) {
      for (let col = 0; col < MAP_WIDTH; col++) {
        const tileKey = mapTiles[row][col]
        const { x, y } = gridToScreen(col, row)
        const tile = this.add.image(x, y, tileKey)
        tile.setOrigin(TILE_ORIGIN_X, TILE_ORIGIN_Y)
        tile.setDepth(row + col)
      }
    }
  }

  update(time, delta) {
    if (this.player) {
      const touchInput = this.touchControls ? this.touchControls.getInput() : null
      this.player.update(delta, touchInput)
    }
  }
}
