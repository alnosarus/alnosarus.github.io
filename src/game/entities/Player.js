import { gridToScreen } from '../utils/isometric'
import { MAP_WIDTH, MAP_HEIGHT } from '../data/mapData'

// Screen-space directions for atan2 sector mapping
const SCREEN_DIR = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne']

function velocityToFacing(vCol, vRow) {
  // Grid velocity → screen velocity
  const screenVx = vCol - vRow
  const screenVy = vCol + vRow

  const angle = Math.atan2(screenVy, screenVx)
  let sector = Math.round(angle / (Math.PI / 4))
  if (sector < 0) sector += 8
  return SCREEN_DIR[sector % 8]
}

export default class Player {
  constructor(scene, gridCol, gridRow) {
    this.scene = scene
    this.gridCol = gridCol
    this.gridRow = gridRow

    this.vCol = 0
    this.vRow = 0

    this.maxSpeed = 4
    this.accel = 800
    this.friction = 600

    this.facing = 's'

    const { x, y } = gridToScreen(gridCol, gridRow)
    this.sprite = scene.add.sprite(x, y, 'char-idle')
    // Feet at ~70% down in 128px frame, center at ~48% across
    this.sprite.setOrigin(0.48, 0.70)
    this.sprite.setScale(2.0)
    this.sprite.play(`idle-${this.facing}`)

    this.isMoving = false

    this.keys = {
      W: scene.input.keyboard.addKey('W'),
      A: scene.input.keyboard.addKey('A'),
      S: scene.input.keyboard.addKey('S'),
      D: scene.input.keyboard.addKey('D'),
    }
  }

  getInputVector() {
    let screenX = 0
    let screenY = 0

    if (this.keys.W.isDown) screenY -= 1
    if (this.keys.S.isDown) screenY += 1
    if (this.keys.A.isDown) screenX -= 1
    if (this.keys.D.isDown) screenX += 1

    if (screenX !== 0 && screenY !== 0) {
      const inv = 1 / Math.SQRT2
      screenX *= inv
      screenY *= inv
    }

    if (screenX === 0 && screenY === 0) return { dCol: 0, dRow: 0 }

    // Screen direction → grid direction
    let dCol = screenX + screenY
    let dRow = -screenX + screenY

    const len = Math.sqrt(dCol * dCol + dRow * dRow)
    if (len > 0) {
      dCol /= len
      dRow /= len
    }

    return { dCol, dRow }
  }

  update(delta, inputOverride) {
    const dt = delta / 1000

    const { dCol, dRow } = inputOverride || this.getInputVector()
    const hasInput = dCol !== 0 || dRow !== 0

    if (hasInput) {
      this.vCol += dCol * this.accel * dt
      this.vRow += dRow * this.accel * dt

      const speed = Math.sqrt(this.vCol * this.vCol + this.vRow * this.vRow)
      if (speed > this.maxSpeed) {
        this.vCol = (this.vCol / speed) * this.maxSpeed
        this.vRow = (this.vRow / speed) * this.maxSpeed
      }
    } else {
      const speed = Math.sqrt(this.vCol * this.vCol + this.vRow * this.vRow)
      if (speed > 0) {
        const drop = this.friction * dt
        const newSpeed = Math.max(0, speed - drop)
        const scale = newSpeed / speed
        this.vCol *= scale
        this.vRow *= scale
      }
    }

    this.gridCol += this.vCol * dt
    this.gridRow += this.vRow * dt

    this.gridCol = Math.max(0, Math.min(MAP_WIDTH - 1, this.gridCol))
    this.gridRow = Math.max(0, Math.min(MAP_HEIGHT - 1, this.gridRow))

    if (this.gridCol <= 0 || this.gridCol >= MAP_WIDTH - 1) this.vCol = 0
    if (this.gridRow <= 0 || this.gridRow >= MAP_HEIGHT - 1) this.vRow = 0

    const { x, y } = gridToScreen(this.gridCol, this.gridRow)
    this.sprite.setPosition(x, y)
    this.sprite.setDepth(y + 1)

    const speed = Math.sqrt(this.vCol * this.vCol + this.vRow * this.vRow)
    const moving = speed > 0.1

    if (moving) {
      const newFacing = velocityToFacing(this.vCol, this.vRow)
      if (newFacing !== this.facing || !this.isMoving) {
        this.facing = newFacing
        this.sprite.play(`run-${this.facing}`)
        this.isMoving = true
      }
    } else if (this.isMoving) {
      this.sprite.play(`idle-${this.facing}`)
      this.isMoving = false
    }
  }
}
