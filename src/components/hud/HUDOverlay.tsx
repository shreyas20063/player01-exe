import { HUDTopBar } from './HUDTopBar'
import { HUDXPBar } from './HUDXPBar'
import { HUDMiniMap } from './HUDMiniMap'
import { HUDAchievementToast } from './HUDAchievementToast'
import { HUDScanlines } from './HUDScanlines'

export function HUDOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
      data-hud-root=""
    >
      <HUDTopBar />
      <HUDXPBar />
      <HUDMiniMap />
      <HUDAchievementToast />
      <HUDScanlines />
    </div>
  )
}
