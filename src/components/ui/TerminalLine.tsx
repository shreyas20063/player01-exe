import { cn } from '@/lib/cn'

type TerminalLineProps = {
  command: string
  response: string
  className?: string
}

export function TerminalLine({ command, response, className }: TerminalLineProps) {
  return (
    <div className={cn('font-mono text-sm leading-relaxed', className)}>
      <div className="flex gap-2 text-text">
        <span className="text-cyan">kai@player_01:~$</span>
        <span>{command}</span>
      </div>
      {response ? (
        <pre
          className="m-0 whitespace-pre-wrap break-words font-mono text-muted"
          style={{ tabSize: 2 }}
        >
          {response}
        </pre>
      ) : null}
    </div>
  )
}
