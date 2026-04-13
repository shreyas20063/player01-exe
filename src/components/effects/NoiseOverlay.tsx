import { useEffect, useRef } from 'react'

const NOISE_W = 160
const NOISE_H = 90
const FRAME_INTERVAL = 1000 / 12 // ~12fps — deliberately choppy

export function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    canvas.width = NOISE_W
    canvas.height = NOISE_H
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const image = ctx.createImageData(NOISE_W, NOISE_H)
    const data = image.data
    let raf = 0
    let last = 0
    let running = true

    const draw = (t: number) => {
      if (!running) return
      if (t - last >= FRAME_INTERVAL) {
        last = t
        // Tight loop — write random grayscale values
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0
          data[i] = v
          data[i + 1] = v
          data[i + 2] = v
          data[i + 3] = 255
        }
        ctx.putImageData(image, 0, 0)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{
        zIndex: 39,
        mixBlendMode: 'overlay',
        opacity: 0.06,
        imageRendering: 'pixelated',
      }}
    />
  )
}
