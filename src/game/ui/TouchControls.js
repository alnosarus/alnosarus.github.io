export default class TouchControls {
  constructor(scene) {
    this.scene = scene
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    this.inputVector = { dCol: 0, dRow: 0 }
    this.active = false

    if (!this.isTouch) return

    // Joystick config
    this.baseRadius = 60
    this.knobRadius = 25
    this.maxDrag = 50

    // Create joystick graphics (fixed to camera)
    this.base = scene.add.circle(0, 0, this.baseRadius, 0xffffff, 0.15)
    this.base.setStrokeStyle(2, 0xffffff, 0.3)
    this.base.setScrollFactor(0)
    this.base.setDepth(1000)

    this.knob = scene.add.circle(0, 0, this.knobRadius, 0xffffff, 0.35)
    this.knob.setScrollFactor(0)
    this.knob.setDepth(1001)

    this.positionJoystick()

    // Touch events
    scene.input.on('pointerdown', this.onDown, this)
    scene.input.on('pointermove', this.onMove, this)
    scene.input.on('pointerup', this.onUp, this)

    // Reposition on resize
    scene.scale.on('resize', this.positionJoystick, this)
  }

  positionJoystick() {
    if (!this.isTouch) return
    const padding = 100
    const x = padding
    const y = this.scene.scale.height - padding
    this.baseX = x
    this.baseY = y
    this.base.setPosition(x, y)
    this.knob.setPosition(x, y)
  }

  onDown(pointer) {
    // Only capture touches in the left half of the screen
    if (pointer.x < this.scene.scale.width / 2) {
      this.active = true
      this.pointerId = pointer.id
    }
  }

  onMove(pointer) {
    if (!this.active || pointer.id !== this.pointerId) return

    const dx = pointer.x - this.baseX
    const dy = pointer.y - this.baseY
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Clamp knob position
    let clampedX = dx
    let clampedY = dy
    if (dist > this.maxDrag) {
      clampedX = (dx / dist) * this.maxDrag
      clampedY = (dy / dist) * this.maxDrag
    }

    this.knob.setPosition(this.baseX + clampedX, this.baseY + clampedY)

    // Normalize to -1..1 range
    const normX = clampedX / this.maxDrag
    const normY = clampedY / this.maxDrag

    // Map screen joystick to isometric grid input
    // Screen right (+x) = +col, screen down (+y) = +row
    // Apply dead zone
    const deadZone = 0.15
    const magnitude = Math.sqrt(normX * normX + normY * normY)
    if (magnitude < deadZone) {
      this.inputVector = { dCol: 0, dRow: 0 }
    } else {
      // Convert screen-space joystick to iso grid input
      // In iso: screen right = col+row direction, screen down = row-col direction
      // But since WASD already maps A/D to col and W/S to row,
      // we map joystick X to col and Y to row for consistency
      this.inputVector = { dCol: normX, dRow: normY }
    }
  }

  onUp(pointer) {
    if (pointer.id !== this.pointerId) return
    this.active = false
    this.knob.setPosition(this.baseX, this.baseY)
    this.inputVector = { dCol: 0, dRow: 0 }
  }

  getInput() {
    if (!this.isTouch || !this.active) return null
    return this.inputVector
  }

  destroy() {
    if (!this.isTouch) return
    this.scene.input.off('pointerdown', this.onDown, this)
    this.scene.input.off('pointermove', this.onMove, this)
    this.scene.input.off('pointerup', this.onUp, this)
    this.scene.scale.off('resize', this.positionJoystick, this)
    this.base.destroy()
    this.knob.destroy()
  }
}
