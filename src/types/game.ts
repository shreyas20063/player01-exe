export type Achievement = {
  id: string
  label: string
  xp: number
  hint: string
}

export type GameState = {
  xp: number
  level: number
  rank: string
  unlocked: string[]
  booted: boolean
  konami: boolean
  audioOn: boolean
  firstVisit: boolean
}

export type GameActions = {
  addXP: (amount: number) => void
  unlock: (id: string) => void
  setBooted: (b: boolean) => void
  setKonami: (k: boolean) => void
  toggleAudio: () => void
  markVisited: () => void
  resetSave: () => void
}
