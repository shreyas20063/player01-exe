// Thin wrapper over @chenglou/pretext. Consumers only know this API so we can
// swap implementation without touching components.
//
// For the hero use case (text wrapping around a moving 3D rock), we use
// prepareWithSegments() once and call layoutNextLine() per visible line each
// frame with a variable maxWidth derived from the obstacle's screen rect.
import {
  prepareWithSegments,
  layoutNextLine,
  measureNaturalWidth,
  clearCache,
  type LayoutCursor,
  type LayoutLine,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'

export type FlowLine = {
  y: number
  x: number
  width: number
  text: string
}

export type Obstacle = {
  top: number
  bottom: number
  left: number
  right: number
}

export type PreparedBody = {
  prepared: PreparedTextWithSegments
  font: string
  lineHeight: number
  fontSize: number
}

export function prepareBody(
  text: string,
  font: string,
  fontSize: number,
  lineHeight: number
): PreparedBody {
  return {
    prepared: prepareWithSegments(text, font),
    font,
    lineHeight,
    fontSize,
  }
}

// Flow text into a vertical column of width `containerWidth`, starting at y=0.
// If `obstacle` is provided, lines whose vertical band overlaps it are shortened
// to the larger of (obstacle.left) or (containerWidth - obstacle.right).
export function flowAround(
  body: PreparedBody,
  containerWidth: number,
  obstacle: Obstacle | null
): FlowLine[] {
  const lines: FlowLine[] = []
  const { prepared, lineHeight } = body
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = 0
  let guard = 0
  while (guard++ < 400) {
    const lineTop = y
    const lineBottom = y + lineHeight
    let maxWidth = containerWidth
    let xOffset = 0
    if (obstacle && lineBottom > obstacle.top && lineTop < obstacle.bottom) {
      const leftRoom = Math.max(0, obstacle.left)
      const rightRoom = Math.max(0, containerWidth - obstacle.right)
      if (rightRoom >= leftRoom) {
        xOffset = obstacle.right
        maxWidth = rightRoom
      } else {
        xOffset = 0
        maxWidth = leftRoom
      }
      // If the chosen channel is too narrow to fit anything meaningful,
      // let the line hang and skip below the obstacle.
      if (maxWidth < body.fontSize * 3) {
        y = obstacle.bottom
        continue
      }
    }
    const line: LayoutLine | null = layoutNextLine(prepared, cursor, maxWidth)
    if (line === null) break
    lines.push({
      y,
      x: xOffset,
      width: line.width,
      text: line.text,
    })
    cursor = { segmentIndex: line.end.segmentIndex, graphemeIndex: line.end.graphemeIndex }
    y += lineHeight
    if (y > lineHeight * 60) break
  }
  return lines
}

export function naturalWidth(body: PreparedBody): number {
  return measureNaturalWidth(body.prepared)
}

export function clearPretextCache(): void {
  clearCache()
}
