# PLAYER_01.exe

> You double-clicked the wrong `.exe`. Now you're inside Kai Rios's portfolio and there's no Task Manager to save you.

**A gamified synthwave portfolio** built for The Coding Club's **Vibe-a-thon** (12 Apr 2026). The entire site is framed as a retro arcade game boot sequence — complete with XP bars, achievement toasts, a konami code, and a contact terminal where `sudo make me a sandwich` actually works.

Built with Claude Opus 4.6, an army of 6 parallel AI agents, and an unreasonable amount of GLSL.

---

## Live Demo

**https://shreyas20063.github.io/player01-exe/**

---

## How to Navigate

1. **Boot sequence** types itself out. Press any key to skip (or wait, it's kinda cool).
2. **Scroll down.** That's it. That's the entire interaction model. We told you upfront.
3. The HUD in the corners is real — your XP bar fills as you explore, achievements pop when you do things.
4. When you reach the **Contact Terminal**, type `help`. Or `sudo make me a sandwich`. We won't judge.
5. The **Konami Code** works. Yes, really. `↑↑↓↓←→←→BA`.
6. Press `R` on the credits screen if you want to go again. We respect your time, but also we don't.

---

## Component Mapping — What We Replicated & How

The event requires at least **4 components** from the provided Drive folder (hover effects, scroll transitions, 3D interactions, cursor effects, cards/decks, popups, etc). Here's what we built, what inspired each, and how we went harder than the reference.

### 1. Hover Effect Component — `Arsenal Magnetic Grid`

**Drive reference**: Basic hover animations (tilt cards, glow-on-hover)

**What we built**: A 12-card weapon rack where EACH card has **5 layered hover interactions** stacked simultaneously:

| Layer | What it does |
|---|---|
| **Magnetic pull** | Card translates toward cursor within 140px radius via `useMagnetic` hook |
| **3D tilt** | `rotateX`/`rotateY` up to 12deg driven by pointer position, spring physics (stiffness 280, damping 22) |
| **Radial glow** | CSS `--mx`/`--my` custom properties track cursor, driving a `radial-gradient` that follows the mouse inside the card |
| **RGB border glitch** | Three stacked absolute borders (magenta/cyan/lime) offset in different directions on hover with `mix-blend-mode: screen` |
| **Label scramble** | Card name scrambles through ASCII garbage for 420ms on hover entry, then resolves |

Plus: `whileInView` staggered entry (50ms per card), achievement tracking (`FIRST_BLOOD` on first hover, `ARSENAL_MASTER` after all 12), corner tick decorations, mastery progress bars.

**File**: [`src/sections/ArsenalSection.tsx`](src/sections/ArsenalSection.tsx)

---

### 2. Scroll Transition Component — `Boss Gauntlet Horizontal Pin`

**Drive reference**: Horizontal scroll sections, scroll-triggered reveals

**What we built**: A GSAP ScrollTrigger **pinned horizontal gallery** where vertical scroll drives horizontal movement through 3 full-viewport "boss fight" project panels. Each boss panel features:

- Giant stroke-only boss number (`BOSS 01`, 220px)
- Liquid-metal splash: a **real-time 3D morphing icosahedron** (R3F + custom GLSL shaders) with accent-matched colors per boss (magenta/cyan/amber), cursor-reactive rotation, and noise-driven vertex displacement
- Per-panel parallax on the 3D shape and copy via `containerAnimation`
- Stack tags, metric stat boxes, engagement links
- VS splash dividers between panels
- Reduced-motion fallback: degrades to a vertical stack, no pin

**Files**: [`src/sections/BossGauntlet.tsx`](src/sections/BossGauntlet.tsx), [`src/three/BossShape.tsx`](src/three/BossShape.tsx), [`src/three/shaders/rock.vert.glsl`](src/three/shaders/rock.vert.glsl), [`src/three/shaders/rock.frag.glsl`](src/three/shaders/rock.frag.glsl)

---

### 3. 3D Interactive Element — `Morphing Shader Orbs`

**Drive reference**: 3D hover objects, interactive WebGL elements

**What we built**: Custom GLSL shader material on an `IcosahedronGeometry(1.4, 48)`:

- **Vertex shader**: 4-octave FBM noise displacement with `pow(abs(n), 0.6)` for spiky peaks, mouse-warped noise field, breathing wave animation
- **Fragment shader**: `uAccent` uniform drives the ENTIRE color scheme — fresnel rim glow, inner noise bleed, pulsing energy veins, surface cracks, cursor-reactive hotspot. Reinhard tonemapping prevents bloom blowout.
- **Cursor interaction**: Shape tilts and rotates toward the mouse. Noise field warps where the cursor points. A visible hotspot glow follows the mouse on the surface.
- Each boss panel gets its own accent: Boss 01 = magenta, Boss 02 = cyan, Boss 03 = amber.

**Files**: [`src/three/BossShape.tsx`](src/three/BossShape.tsx), [`src/three/shaders/`](src/three/shaders/)

---

### 4. Cursor Interaction Component — `Custom Crosshair Cursor`

**Drive reference**: Custom cursor effects, cursor followers

**What we built**: A system-replacing custom cursor with 3 context-aware modes:

| Mode | Trigger | Visual |
|---|---|---|
| **Idle** | Default | Crosshair `+` with center dot, `mix-blend-mode: difference` |
| **Lock** | Hovering buttons/links/inputs | Filled white square with glow — "target acquired" feel |
| **Label** | Hovering `data-cursor="..."` elements | Crosshair + floating mono label tooltip |

Spring physics via `useMotionValue` + `useSpring` (stiffness 500, damping 40). Uses `elementFromPoint` + parent walk to find `data-cursor` attributes. Returns `null` on touch devices. Whole thing is `pointer-events-none` at z-100.

**File**: [`src/components/cursor/CustomCursor.tsx`](src/components/cursor/CustomCursor.tsx)

---

### 5. Scroll Reveal Component — `Lore Scroll Comic Panels`

**Drive reference**: Scroll-triggered animations, reveal-on-scroll

**What we built**: 4-panel origin story rendered as comic-strip frames with:

- GSAP `clipPath: polygon()` shard wipe reveals on scroll entry
- Parallax background layers with velocity-reactive skew (capped at ±6deg) driven by scroll velocity
- Thick comic-book borders with offset drop shadows
- Giant background year numerals with `yPercent` scrub parallax
- Achievement unlock on final panel (`BIBLIOPHILE`)

**File**: [`src/sections/LoreScroll.tsx`](src/sections/LoreScroll.tsx)

---

### 6. Card/Deck Component — `Character Select Stat Sheet`

**Drive reference**: Card animations, flip effects, animated data displays

**What we built**: An RPG-style character stat sheet with:

- 5 animated segmented bars (15 segments each) that fill sequentially on enter-view via Framer Motion with staggered delays
- Count-up numbers using `useMotionValue` + `animate()`
- A wireframe SVG portrait drawn with `motion.path` `pathLength: 0 → 1` animation
- Flavor text per stat in RPG idiom ("YEARS SHIPPED // 09", "COFFEE/DAY // 04")

**File**: [`src/sections/CharacterSelect.tsx`](src/sections/CharacterSelect.tsx)

---

### 7. Popup/Toast Component — `Achievement Toast System`

**Drive reference**: Popup/notification animations

**What we built**: A real-time achievement notification system:

- Subscribes to Zustand store `unlocked` array, diff-detects new entries via `prevRef`
- Toasts queue and slide in from right with blur via `AnimatePresence`
- Auto-dismiss after 3 seconds with animated progress bar
- Shows achievement label + XP reward
- 15 achievable achievements persisted to `localStorage`

**File**: [`src/components/hud/HUDAchievementToast.tsx`](src/components/hud/HUDAchievementToast.tsx)

---

### 8. Interactive Terminal — `Contact CRT Shell`

**Drive reference**: (Beyond the Drive folder — bonus interactive element)

**What we built**: A fully focusable CRT terminal with a real command parser. 10 commands including `help`, `whoami`, `cat resume.txt`, `connect kai` (opens mailto), `sudo hire kai` (permission denied), `sudo make me a sandwich` (ASCII art + achievement), `exit` (scrolls back to hero), `credits`, `clear`, `restart`. Blinking caret, scanline overlay, auto-scroll, command history.

**File**: [`src/sections/ContactTerminal.tsx`](src/sections/ContactTerminal.tsx)

---

## Full Component Count

17 animated components shipped vs. 4 required. Because restraint is a myth.

---

## Tech Stack

| Role | Library |
|---|---|
| Build | Vite 8 |
| Framework | React 19.2 + TypeScript 6 |
| Styling | Tailwind v4 (tokens via `@theme`) |
| Declarative motion | Framer Motion 11 |
| Scroll pinning | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis |
| 3D | Three.js + React Three Fiber v9 + drei v10 |
| Shaders | Custom GLSL via vite-plugin-glsl |
| State | Zustand + persist middleware |

---

## AI Development Process

Built with **Claude Opus 4.6 (1M context)** via Claude Code. Strategy: **parallel agent architecture**.

### The Prompt That Started It All

```
bro first I need u to cook up a crazy realization plan, put wtever u can
dream of, think of it in this way, if u have unlimited tokens and wanted
to prove to the world if u were claude opus 4.6 with extended thinking
on max efforts, spinning up ur own self as friends to help u out, wt
would u do with an army.
```

And then it did. Not sub-agents, baby — it's the experimental **agent teams mode**. 6 actual duking agents running in parallel, each with their own file ownership manifest, zero conflicts.

1. Two planning agents (tech architecture + creative direction) dispatched in parallel
2. Solo foundation pass: design tokens, types, data, store, hooks, providers
3. **Six build agents dispatched in parallel**, each owning non-overlapping files:
   - A1 RENDER_CORE — 3D shaders + hero
   - A2 SCROLL_RIDER — boss gauntlet + lore + credits
   - A3 FRAME_FORGE — arsenal hover + world map + character select
   - A4 TERMINAL_OPS — boot sequence + contact terminal + text components
   - A5 HUD_OPERATOR — HUD overlay + cursor + effects
   - A6 ARCADE_CABINET — konami code + mini-game
4. Solo integration + debugging pass

Full prompt history in [`PROMPTS.md`](PROMPTS.md).

---

## Easter Eggs

Because what's a game without secrets:

- **Konami Code** (`↑↑↓↓←→←→BA`) — lime flash, DEBUG MODE badge, `[KONAMI]` achievement
- **`sudo make me a sandwich`** in the terminal — ASCII sandwich + `[NERD_RECOGNIZED]`
- **`sudo hire kai`** — permission denied with a wink
- **Save file** — `localStorage` persists XP/achievements. Return visitors get a 400ms speed-boot instead of the full typewriter
- **`[R]` to restart** on credits — yes, it genuinely reloads

---

## Local Dev

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle
npm run preview    # serve the build
```

Node 22, npm 10.

---

## Credits

- **Fonts** — Anton, JetBrains Mono, Space Grotesk (Google Fonts)
- **Text layout** — [`@chenglou/pretext`](https://github.com/chenglou/pretext) by Cheng Lou (MIT) — had an idea to use this for dynamic text reflow around the 3D hero bust, never got the chance to integrate it but it actually looks great
- **3D** — Three.js, React Three Fiber, drei, postprocessing
- **Motion** — GSAP, Framer Motion, Lenis
- **AI** — Claude Opus 4.6 via Claude Code. The vibes were human. The boilerplate was not.

The profile (Kai Rios) is fictional. The projects are fictional. The cat named Segfault is aspirational.

## License

MIT — go fork it, we dare you.
