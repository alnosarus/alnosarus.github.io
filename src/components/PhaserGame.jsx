import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/config'

export default function PhaserGame() {
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current) return

    const game = new Phaser.Game(gameConfig)
    gameRef.current = game

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return <div id="phaser-container" className="w-full h-full" />
}
