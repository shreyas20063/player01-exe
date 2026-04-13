export type Tier = 'S' | 'A' | 'B'
export type SkillCategory = 'design' | 'engineering' | 'motion' | 'three' | 'ai'

export type Skill = {
  id: string
  name: string
  tier: Tier
  category: SkillCategory
  xp: number
  description: string
}
