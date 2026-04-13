import type { Skill } from '@/types/skill'

export const skills: Skill[] = [
  { id: 'typescript', name: 'TypeScript', tier: 'S', category: 'engineering', xp: 9800, description: 'Types as design documents. Generics as architecture.' },
  { id: 'react', name: 'React 19', tier: 'S', category: 'engineering', xp: 9200, description: 'Concurrent rendering, server components, and knowing when to drop to raw DOM.' },
  { id: 'threejs', name: 'Three.js', tier: 'S', category: 'three', xp: 8400, description: 'Scenes, materials, and the quiet patience of a scene graph.' },
  { id: 'glsl', name: 'GLSL', tier: 'A', category: 'three', xp: 6600, description: 'Fragment shaders for people who like math with their design.' },
  { id: 'gsap', name: 'GSAP', tier: 'S', category: 'motion', xp: 9100, description: 'Timelines, pinning, and the only animation lib that respects prefers-reduced-motion without being asked.' },
  { id: 'framer', name: 'Framer Motion', tier: 'A', category: 'motion', xp: 7800, description: 'Declarative springs and variants for componentized motion.' },
  { id: 'figma', name: 'Figma', tier: 'S', category: 'design', xp: 8900, description: 'Design tokens, auto-layout, and the discipline to never nest a frame eight deep.' },
  { id: 'blender', name: 'Blender', tier: 'A', category: 'three', xp: 6200, description: 'Low-poly modeling, procedural nodes, and the occasional Eevee beauty shot.' },
  { id: 'rust', name: 'Rust', tier: 'B', category: 'engineering', xp: 4400, description: 'When the CRDT needs to not panic.' },
  { id: 'r3f', name: 'R3F', tier: 'A', category: 'three', xp: 7400, description: 'Declarative Three.js that plays nice with React\'s diffing.' },
  { id: 'claude', name: 'Claude', tier: 'S', category: 'ai', xp: 8700, description: 'Prompt engineering as a senior skill. Not a replacement, a collaborator.' },
  { id: 'cursor', name: 'Cursor', tier: 'A', category: 'ai', xp: 7100, description: 'Inline edits, agent mode, and learning when to trust it.' },
  { id: 'postgres', name: 'PostgreSQL', tier: 'A', category: 'engineering', xp: 6900, description: 'Window functions, CTEs, and knowing which index to write by hand.' },
  { id: 'webgl', name: 'WebGL2', tier: 'A', category: 'three', xp: 7200, description: 'Raw API for when R3F abstractions need to get out of the way.' },
]
