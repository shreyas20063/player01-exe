import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameActions, GameState } from '@/types/game'
import { achievements } from '@/data/achievements'

const RANKS = [
  'NEW GAME',
  'SCROLL APPRENTICE',
  'PIXEL DRUID',
  'VIBE ARCHITECT',
  'SECRET BOSS',
] as const

function rankFor(level: number): string {
  return RANKS[Math.min(level - 1, RANKS.length - 1)] ?? 'NEW GAME'
}

const initialState: GameState = {
  xp: 0,
  level: 1,
  rank: RANKS[0],
  unlocked: [],
  booted: false,
  konami: false,
  audioOn: false,
  firstVisit: true,
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      addXP: (amount) => {
        const nextXP = get().xp + amount
        const nextLevel = 1 + Math.floor(nextXP / 250)
        set({ xp: nextXP, level: nextLevel, rank: rankFor(nextLevel) })
      },
      unlock: (id) => {
        const state = get()
        if (state.unlocked.includes(id)) return
        const ach = achievements.find((a) => a.id === id)
        const xpReward = ach?.xp ?? 10
        const nextXP = state.xp + xpReward
        const nextLevel = 1 + Math.floor(nextXP / 250)
        set({
          unlocked: [...state.unlocked, id],
          xp: nextXP,
          level: nextLevel,
          rank: rankFor(nextLevel),
        })
      },
      setBooted: (b) => set({ booted: b }),
      setKonami: (k) => set({ konami: k }),
      toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
      markVisited: () => set({ firstVisit: false }),
      resetSave: () => set({ ...initialState, firstVisit: false }),
    }),
    {
      name: 'player01-save',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        rank: state.rank,
        unlocked: state.unlocked,
        konami: state.konami,
        audioOn: state.audioOn,
        firstVisit: state.firstVisit,
      }),
    }
  )
)
