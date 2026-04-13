import type { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: 'hologram-fm',
    slug: 'hologram.fm',
    number: 'BOSS 01',
    title: 'HOLOGRAM.fm',
    year: '2026',
    tagline: 'The radio station that listens back.',
    description:
      'A real-time AI radio interface where an LLM DJ responds to listeners in voice, with reactive visualizers that shift between four shader regimes based on the music\'s harmonic content. Built in 11 weeks, shipped on a Tuesday, featured on Hacker News the next morning.',
    stack: ['Next.js', 'WebGL2', 'Web Audio', 'ElevenLabs', 'Cloudflare Workers', 'Tone.js'],
    role: 'Lead Design Eng',
    accent: 'magenta',
    metrics: [
      { label: 'MAU', value: '84K' },
      { label: 'HN RANK', value: '#3' },
      { label: 'AVG SESSION', value: '6.2 MIN' },
    ],
    links: {
      live: 'https://hologram.fm',
      repo: 'https://github.com/kairios/hologram',
    },
  },
  {
    id: 'latency-coffee',
    slug: 'latency.coffee',
    number: 'BOSS 02',
    title: 'LATENCY.coffee',
    year: '2025',
    tagline: 'A cafe POS that doesn\'t make baristas cry.',
    description:
      'Rebuilt the order-management UI for a Bay Area coffee chain after watching a barista miss a ticket at 7:42am on a Wednesday. Net new POS layer running on iPad with offline-first CRDT sync and a custom haptic feedback grammar that taught itself to the team in three shifts.',
    stack: ['SwiftUI', 'Rust', 'CRDT', 'PostgreSQL', 'Tailscale'],
    role: 'Solo Build',
    accent: 'cyan',
    metrics: [
      { label: 'MIS-POURS', value: '-47%' },
      { label: 'TICKET TIME', value: '-2.1s' },
      { label: 'LOCATIONS LIVE', value: '11' },
    ],
    links: {
      live: 'https://latency.coffee',
    },
  },
  {
    id: 'kernel-panic',
    slug: 'kernel_panic.exe',
    number: 'BOSS 03',
    title: 'KERNEL_PANIC.exe',
    year: '2025',
    tagline: 'A type-system tutorial disguised as a roguelike.',
    description:
      'An in-browser teaching game for TypeScript\'s type system where each floor of the dungeon is a generic constraint puzzle. Built as an experiment, became a course, became a Tuesday-night livestream that three bootcamps now assign as homework.',
    stack: ['React 19', 'Zustand', 'ts-morph', 'WebAssembly', 'Three.js'],
    role: 'Creator + Engineer',
    accent: 'amber',
    metrics: [
      { label: 'LEARNERS', value: '23K' },
      { label: 'RATING', value: '4.9★' },
      { label: 'BOOTCAMPS', value: '3' },
    ],
    links: {
      live: 'https://kernelpanic.rocks',
      repo: 'https://github.com/kairios/kernel-panic',
    },
  },
]
