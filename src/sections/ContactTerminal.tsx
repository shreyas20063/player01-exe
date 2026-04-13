import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '@/data/profile'
import { useGameStore } from '@/store/useGameStore'
import { TerminalLine } from '@/components/ui/TerminalLine'
import { cn } from '@/lib/cn'

type HistoryEntry = { command: string; response: string }

const HELP_TEXT = [
  'AVAILABLE COMMANDS:',
  '  help                 show this message',
  '  whoami               kai rios, creative technologist',
  '  cat resume.txt       one-line resume dump',
  '  ls -la /skills       list the arsenal',
  '  connect kai          open a mail channel',
  '  sudo hire kai        (permission denied)',
  '  credits              scroll to credits',
  '  clear                wipe the screen',
  '  restart              reboot the cabinet',
  '  exit                 close the terminal (just kidding)',
].join('\n')

const SANDWICH = `
   _.---._
  /, (@ @),\\
 ( (  ___  ) )
  \\\\ \\___/ //
   '-._-_.-'
  _/     \\_
 /  LETTUCE \\
| — TOMATO —|
| —  BACON —|
 \\_  CHEESE_/
   '-----'
`.trimEnd()

const BANNER = [
  '+--------------------------------------------+',
  '|  PLAYER_01 :: SECURE UPLINK v2.6.4         |',
  '|  STATUS: CONNECTION ESTABLISHED            |',
  '|  HOST:  kai@player_01.dev                  |',
  '+--------------------------------------------+',
  '',
  "type 'help' for a list of commands.",
].join('\n')

export function ContactTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [firstCmdDone, setFirstCmdDone] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // autoscroll
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  const runCommand = useCallback(
    (rawInput: string) => {
      const raw = rawInput.trim()
      if (raw.length === 0) return
      const lower = raw.toLowerCase()
      const store = useGameStore.getState()

      if (!firstCmdDone) {
        store.unlock('keyboard_warrior')
        setFirstCmdDone(true)
      }

      let response = ''
      let clear = false

      if (lower === 'help') {
        response = HELP_TEXT
      } else if (lower === 'whoami') {
        response = profile.bio.join('\n\n')
      } else if (lower === 'cat resume.txt') {
        response = `${profile.name} — ${profile.role}. ${profile.tagline} // ${profile.availability} // ${profile.location}`
      } else if (lower === 'ls -la /skills') {
        response =
          'drwxr-xr-x  kai  arsenal  — see the ARSENAL section for the full weapon rack.\n' +
          'total: ∞ (and counting)'
      } else if (lower === 'connect kai') {
        response = `opening mail channel → ${profile.email}`
        try {
          window.open(`mailto:${profile.email}`, '_blank', 'noopener,noreferrer')
        } catch {
          /* noop */
        }
      } else if (lower === 'sudo hire kai') {
        response =
          'Permission denied. (try: open calendar.html) ;)\n' +
          `or: connect kai  →  ${profile.email}`
      } else if (lower === 'sudo make me a sandwich') {
        response = 'Okay.\n' + SANDWICH
        store.unlock('nerd_recognized')
      } else if (lower === 'clear') {
        clear = true
      } else if (lower === 'credits') {
        response = 'rolling credits...'
        const el = document.getElementById('credits')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (lower === 'restart') {
        response = 'rebooting cabinet...'
        window.setTimeout(() => window.location.reload(), 240)
      } else if (lower === 'exit' || lower === 'quit' || lower === 'q') {
        response = 'closing uplink... returning to base.'
        window.setTimeout(() => {
          const el = document.getElementById('hero')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      } else {
        response = `command not found: ${raw}. try 'help'`
      }

      if (clear) {
        setHistory([])
      } else {
        setHistory((prev) => [...prev, { command: raw, response }])
      }
    },
    [firstCmdDone]
  )

  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full items-center justify-center bg-void px-4 py-24 sm:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-10" />

      <div
        className={cn(
          'relative mx-auto w-full max-w-3xl overflow-hidden border border-cyan/40 bg-surface/80 shadow-[0_0_24px_rgba(74,248,255,0.18)]'
        )}
        onClick={focusInput}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-cyan/30 bg-elev/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-magenta" />
            <span className="h-2 w-2 rounded-full bg-amber" />
            <span className="h-2 w-2 rounded-full bg-cyan" />
          </div>
          <span className="text-cyan">uplink //  kai@player_01</span>
          <span>● REC</span>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="crt-scanlines relative max-h-[62vh] min-h-[52vh] overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed text-text"
        >
          <pre className="m-0 mb-3 whitespace-pre font-mono text-[11px] leading-tight text-cyan">
            {BANNER}
          </pre>

          {history.map((entry, i) => (
            <TerminalLine
              key={i}
              command={entry.command}
              response={entry.response}
              className="mb-2"
            />
          ))}

          {/* Live input line */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              runCommand(input)
              setInput('')
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="term-input" className="text-cyan">
              kai@player_01:~$
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 border-none bg-transparent font-mono text-sm text-text outline-none placeholder:text-muted"
              placeholder="type 'help'"
              aria-label="terminal input"
            />
            <span
              aria-hidden
              className="inline-block animate-pulse text-cyan"
              style={{ animationDuration: '0.9s' }}
            >
              _
            </span>
          </form>
        </div>

        <div className="flex items-center justify-between border-t border-cyan/20 bg-elev/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <button
            type="button"
            className="pointer-events-auto text-magenta transition-colors hover:text-text"
            onClick={() => {
              const el = document.getElementById('hero')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            [ESC] EXIT UPLINK
          </button>
          <span>{history.length} transmissions</span>
          <span>enter to send</span>
        </div>
      </div>
    </section>
  )
}
