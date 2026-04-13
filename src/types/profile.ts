export type SocialLink = {
  label: string
  handle: string
  url: string
}

export type Stat = {
  label: string
  value: number
  max: number
  flavor: string
}

export type Profile = {
  name: string
  alias: string
  role: string
  tagline: string
  location: string
  bio: string[]
  email: string
  availability: string
  socials: SocialLink[]
  stats: Stat[]
}
