import type { Profile } from '@/types/profile'

export const profile: Profile = {
  name: 'KAI RIOS',
  alias: 'PLAYER_01',
  role: 'CREATIVE TECHNOLOGIST // SF',
  tagline: 'Builds interfaces with body language.',
  location: 'San Francisco, CA',
  availability: 'OPEN — LEAD MOTION / DESIGN ENG / WEIRD COLLABS',
  email: 'kai@player01.dev',
  bio: [
    'Kai Rios is a creative technologist in San Francisco who treats web pages like arcade cabinets. For nine years he has been the person teams call when "it works, but it doesn\'t feel right" — the engineer who can read a Figma file and a fragment shader in the same breath, ship a Stripe integration on Tuesday and a WebGL particle system on Thursday, and explain both to a non-technical founder over coffee.',
    'He started in 2014 with a pirated copy of Flash MX and a dial-up connection in a small town nobody has heard of. He has since shipped at two YC startups, advised three Series B design teams, and quietly maintained an open-source motion library used by ~14,000 developers a month. He believes interfaces should have body language, that delight is a load-bearing wall, and that the best portfolios are the ones the visitor accidentally plays for ten minutes.',
    'Currently building a tool that turns design tokens into shader uniforms, out of his Mission District apartment.',
  ],
  socials: [
    { label: 'GITHUB', handle: '@kairios', url: 'https://github.com/kairios' },
    { label: 'TWITTER', handle: '@kai_exe', url: 'https://twitter.com/kai_exe' },
    { label: 'READ.CV', handle: '/kai', url: 'https://read.cv/kai' },
    { label: 'DRIBBBLE', handle: '/kairios', url: 'https://dribbble.com/kairios' },
  ],
  stats: [
    { label: 'STAMINA', value: 12, max: 15, flavor: 'YEARS SHIPPED // 09' },
    { label: 'FOCUS', value: 15, max: 15, flavor: 'COFFEE/DAY // 04' },
    { label: 'CHAOS', value: 5, max: 15, flavor: 'TYPOS/COMMIT // 02' },
    { label: 'EMPATHY', value: 14, max: 15, flavor: 'TEAMS LED // 03' },
    { label: 'CURIOSITY', value: 15, max: 15, flavor: 'RABBIT HOLES // ∞' },
  ],
}
