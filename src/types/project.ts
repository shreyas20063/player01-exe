export type Accent = 'magenta' | 'cyan' | 'amber'

export type ProjectMetric = {
  label: string
  value: string
}

export type Project = {
  id: string
  slug: string
  number: string
  title: string
  year: string
  tagline: string
  description: string
  stack: string[]
  role: string
  accent: Accent
  metrics: ProjectMetric[]
  links: {
    live?: string
    repo?: string
  }
}
