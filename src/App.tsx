import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { AudioProvider } from '@/providers/AudioProvider'
import { BootSequence } from '@/components/boot/BootSequence'
import { KonamiUnlock } from '@/components/easter/KonamiUnlock'
import { HUDOverlay } from '@/components/hud/HUDOverlay'
import { CustomCursor } from '@/components/cursor/CustomCursor'
import { NoiseOverlay } from '@/components/effects/NoiseOverlay'
import { ScanlineOverlay } from '@/components/effects/ScanlineOverlay'
import { VignetteOverlay } from '@/components/effects/VignetteOverlay'
import { TitleCard } from '@/sections/TitleCard'
import { HeroSection } from '@/sections/HeroSection'
import { CharacterSelect } from '@/sections/CharacterSelect'
import { LoreScroll } from '@/sections/LoreScroll'
import { WorldMap } from '@/sections/WorldMap'
import { BossGauntlet } from '@/sections/BossGauntlet'
import { ArsenalSection } from '@/sections/ArsenalSection'
import { SideQuests } from '@/sections/SideQuests'
import { ContactTerminal } from '@/sections/ContactTerminal'
import { CreditsRoll } from '@/sections/CreditsRoll'

function App() {
  return (
    <SmoothScrollProvider>
      <AudioProvider>
        <KonamiUnlock />
        <BootSequence />
        <main className="relative" style={{ zIndex: 10 }}>
          <TitleCard />
          <HeroSection />
          <CharacterSelect />
          <LoreScroll />
          <WorldMap />
          <BossGauntlet />
          <ArsenalSection />
          <SideQuests />
          <ContactTerminal />
          <CreditsRoll />
        </main>
        <HUDOverlay />
        <CustomCursor />
        <NoiseOverlay />
        <ScanlineOverlay />
        <VignetteOverlay />
      </AudioProvider>
    </SmoothScrollProvider>
  )
}

export default App
