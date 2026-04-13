import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'

type Obstacle = { x: number; w: number; h: number }

const W = 320
const H = 120
const GROUND_Y = 96
const GRAVITY = 0.5
const JUMP_V = -9
const SPEED = 2.4
const HS_KEY = 'player01-minigame-hs'

export function MiniGame({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const stateRef = useRef({
    y: GROUND_Y,
    vy: 0,
    obstacles: [] as Obstacle[],
    score: 0,
    over: false,
    tick: 0,
  })
  const [, force] = useState(0)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(HS_KEY) : null
    if (raw) setHighScore(parseInt(raw, 10) || 0)
  }, [])

  const reset = useCallback(() => {
    stateRef.current = { y: GROUND_Y, vy: 0, obstacles: [], score: 0, over: false, tick: 0 }
    force((n) => n + 1)
  }, [])

  const jump = useCallback(() => {
    const s = stateRef.current
    if (s.over) return
    if (s.y >= GROUND_Y) s.vy = JUMP_V
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); jump() }
      if (e.key === 'r' || e.key === 'R') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, jump, reset])

  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      if (!s.over) {
        s.tick++
        s.vy += GRAVITY
        s.y = Math.min(GROUND_Y, s.y + s.vy)
        if (s.y >= GROUND_Y) s.vy = 0
        for (const o of s.obstacles) o.x -= SPEED
        s.obstacles = s.obstacles.filter((o) => o.x + o.w > 0)
        if (s.tick % 90 === 0 || s.obstacles.length === 0) {
          const h = 12 + Math.floor(Math.random() * 14)
          s.obstacles.push({ x: W + 10, w: 8, h })
        }
        s.score++
        for (const o of s.obstacles) {
          if (40 + 10 > o.x && 40 < o.x + o.w && s.y + 4 > GROUND_Y - o.h) {
            s.over = true
            if (s.score > highScore) {
              setHighScore(s.score)
              try { window.localStorage.setItem(HS_KEY, String(s.score)) } catch { /* noop */ }
            }
          }
        }
        if (s.score === 50) useGameStore.getState().unlock('arcade_legend')
      }

      ctx.fillStyle = '#0a0014'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#ff2bd6'
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y + 6); ctx.lineTo(W, GROUND_Y + 6); ctx.stroke()
      ctx.font = '14px ui-monospace, monospace'
      ctx.fillStyle = '#a6ff00'
      ctx.fillText('▲', 36, s.y + 4)
      ctx.fillStyle = '#00f0ff'
      for (const o of s.obstacles) ctx.fillRect(o.x, GROUND_Y - o.h, o.w, o.h + 6)
      ctx.fillStyle = '#ff2bd6'
      ctx.font = '10px ui-monospace, monospace'
      ctx.fillText(`SCORE ${s.score}`, 8, 14)
      ctx.fillText(`HI ${Math.max(highScore, s.score)}`, W - 60, 14)

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [open, highScore])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-void/80 font-mono"
          style={{ zIndex: 90 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative border-2 border-magenta bg-void p-4 text-cyan shadow-[0_0_30px_rgba(255,43,214,0.4)]"
          >
            <div className="mb-2 flex justify-between text-[10px] text-magenta">
              <span>RUNNER.EXE</span>
              <button onClick={onClose} className="text-lime hover:text-magenta">[ESC]</button>
            </div>
            <canvas ref={canvasRef} width={W} height={H} className="border border-cyan/40" />
            {stateRef.current.over ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-lime">
                GAME OVER — PRESS R
              </div>
            ) : null}
            <div className="mt-2 text-[10px] text-cyan/70">SPACE=JUMP  R=RESTART  ESC=CLOSE</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
