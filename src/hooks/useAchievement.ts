import { useCallback } from 'react'
import { useGameStore } from '@/store/useGameStore'

export function useAchievement() {
  const unlock = useGameStore((s) => s.unlock)
  return useCallback((id: string) => unlock(id), [unlock])
}
