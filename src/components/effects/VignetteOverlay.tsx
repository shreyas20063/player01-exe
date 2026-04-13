export function VignetteOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 41,
        background:
          'radial-gradient(ellipse at center, transparent 55%, rgba(7,5,12,0.85) 100%)',
      }}
    />
  )
}
