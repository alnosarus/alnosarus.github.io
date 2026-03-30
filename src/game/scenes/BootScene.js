import Phaser from 'phaser'

// Tile assets
import tileDirt from '../../assets/kenney-isometric/tiles/dirt_S.png'
import tileStone from '../../assets/kenney-isometric/tiles/stone_S.png'
import tileStoneTile from '../../assets/kenney-isometric/tiles/stoneTile_S.png'
import tilePlanks from '../../assets/kenney-isometric/tiles/planks_S.png'

// Character spritesheets
import charRun from '../../assets/survivor/Run.png'
import charIdle from '../../assets/survivor/Idle.png'

// Survivor spritesheet: 8 rows (directions), 14 frames per row, 128x128 per frame
const ROW_DIRECTIONS = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne']
const FRAME_SIZE = 128
const COLUMNS = 14

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    this.load.image('tile-dirt', tileDirt)
    this.load.image('tile-stone', tileStone)
    this.load.image('tile-stoneTile', tileStoneTile)
    this.load.image('tile-planks', tilePlanks)

    this.load.spritesheet('char-run', charRun, {
      frameWidth: FRAME_SIZE,
      frameHeight: FRAME_SIZE,
    })
    this.load.spritesheet('char-idle', charIdle, {
      frameWidth: FRAME_SIZE,
      frameHeight: FRAME_SIZE,
    })
  }

  create() {
    for (let row = 0; row < 8; row++) {
      const dir = ROW_DIRECTIONS[row]
      const startFrame = row * COLUMNS

      this.anims.create({
        key: `run-${dir}`,
        frames: this.anims.generateFrameNumbers('char-run', {
          start: startFrame,
          end: startFrame + COLUMNS - 1,
        }),
        frameRate: 16,
        repeat: -1,
      })

      this.anims.create({
        key: `idle-${dir}`,
        frames: this.anims.generateFrameNumbers('char-idle', {
          start: startFrame,
          end: startFrame + COLUMNS - 1,
        }),
        frameRate: 10,
        repeat: -1,
      })
    }

    this.scene.start('Game')
  }
}
