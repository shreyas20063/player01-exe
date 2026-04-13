export type ArsenalKind = 'weapon' | 'tool' | 'shader' | 'kit'

export type ArsenalItem = {
  id: string
  name: string
  kind: ArsenalKind
  slot: string
  mastery: number
}
