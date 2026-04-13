import type { Achievement } from '@/types/game'

export const achievements: Achievement[] = [
  { id: 'first_boot', label: 'FIRST_BOOT', xp: 10, hint: 'Watched the system come online.' },
  { id: 'first_blood', label: 'FIRST_BLOOD', xp: 15, hint: 'Hovered your first target.' },
  { id: 'rock_solid', label: 'ROCK_SOLID', xp: 30, hint: 'Stared at the hero for three seconds.' },
  { id: 'bibliophile', label: 'BIBLIOPHILE', xp: 40, hint: 'Read the origin story.' },
  { id: 'boss_hunter', label: 'BOSS_HUNTER', xp: 80, hint: 'Visited every boss.' },
  { id: 'arsenal_master', label: 'ARSENAL_MASTER', xp: 100, hint: 'Touched every weapon in the rack.' },
  { id: 'keyboard_warrior', label: 'KEYBOARD_WARRIOR', xp: 50, hint: 'Typed a command into the terminal.' },
  { id: 'nerd_recognized', label: 'NERD_RECOGNIZED', xp: 25, hint: 'Found the xkcd reference.' },
  { id: 'konami', label: 'KONAMI', xp: 120, hint: 'Old habits die hard.' },
  { id: 'night_owl', label: 'NIGHT_OWL', xp: 30, hint: 'Visited between 00:00 and 04:00.' },
  { id: 'speedrunner', label: 'SPEEDRUNNER', xp: 75, hint: 'Reached the credits in under 90 seconds.' },
  { id: 'completionist', label: 'COMPLETIONIST', xp: 200, hint: 'All other achievements earned.' },
  { id: 'eye_contact', label: 'EYE_CONTACT', xp: 60, hint: 'It noticed you.' },
  { id: 'the_lurker', label: 'THE_LURKER', xp: 20, hint: 'Idle for 60 seconds.' },
  { id: 'backseat_dev', label: 'BACKSEAT_DEV', xp: 15, hint: 'Opened the devtools console.' },
]
