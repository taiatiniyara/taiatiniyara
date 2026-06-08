"use client"

import { useEffect, useState, useRef } from "react"

type Line = {
  prefix: string
  text: string
}

const lines: Line[] = [
  { prefix: "$ ", text: "taia deploy --crew" },
  { prefix: "  ", text: "" },
  { prefix: "  ", text: "\u250C\u2500\u2500 spawning AI agents" },
  { prefix: "  ", text: "\u251C \u25CF Architect   \u2192 scaffolding project" },
  { prefix: "  ", text: "\u251C \u25CF Builder     \u2192 generating components" },
  { prefix: "  ", text: "\u2502  \u25CF Reviewer    \u2192 code review pass" },
  { prefix: "  ", text: "\u2502  \u25CF Designer    \u2192 styling interface" },
  { prefix: "  ", text: "\u251C \u25CF Tester      \u2192 47/47 tests passing" },
  { prefix: "  ", text: "\u251C \u25CF Scribe      \u2192 docs generated" },
  { prefix: "  ", text: "\u2514 \u25CF DevOps      \u2192 deploying \u2026" },
  { prefix: "  ", text: "" },
  { prefix: "  ", text: "\u2713 Deployment complete" },
  { prefix: "  ", text: "\u2713 All agents done. Ship it." },
  { prefix: "$ ", text: "" },
]

const agentColors: Record<string, string> = {
  "Architect": "text-purple-400",
  "Builder": "text-blue-400",
  "Reviewer": "text-emerald-400",
  "Designer": "text-pink-400",
  "Tester": "text-amber-400",
  "Scribe": "text-indigo-400",
  "DevOps": "text-red-400",
}

function getAgentColor(line: string): string {
  for (const [agent, color] of Object.entries(agentColors)) {
    if (line.includes(agent)) return color
  }
  return ""
}

export function CodeWindow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [typedLines, setTypedLines] = useState<string[]>(Array(lines.length).fill(""))
  const [done, setDone] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    const el = containerRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return

    let lineIdx = 0
    let charIdx = 0
    let timeout: ReturnType<typeof setTimeout>
    let cancelled = false

    function type() {
      if (cancelled) return
      if (lineIdx >= lines.length) {
        setDone(true)
        return
      }

      const fullText = lines[lineIdx].prefix + lines[lineIdx].text

      if (charIdx < fullText.length) {
        setTypedLines((prev) => {
          const next = [...prev]
          next[lineIdx] = fullText.slice(0, charIdx + 1)
          return next
        })
        charIdx++
        const delay = charIdx === fullText.length ? 200 : 20 + Math.random() * 30
        timeout = setTimeout(type, delay)
      } else {
        lineIdx++
        charIdx = 0
        timeout = setTimeout(type, 180)
      }
    }

    timeout = setTimeout(type, 400)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [visible])

  return (
    <div id="hero-code-window" ref={containerRef} className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden border bg-card shadow-lg">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-muted-foreground">
            crew terminal
          </span>
        </div>
        <div className="p-4 font-mono text-xs leading-relaxed sm:text-sm">
          {!visible && <span className="text-muted-foreground">$ _</span>}

          {visible &&
            lines.map((line, i) => {
              const display = typedLines[i]
              if (!display) return null

              const fullLength = (line.prefix + line.text).length
              const currentlyTyping = !done && display.length < fullLength
              const agentColor = getAgentColor(line.text)

              return (
                <div key={i} className={agentColor}>
                  <span className="text-muted-foreground">
                    {display.slice(0, line.prefix.length)}
                  </span>
                  <span className={agentColor || "text-muted-foreground"}>
                    {display.slice(line.prefix.length)}
                  </span>
                  {currentlyTyping && (
                    <span className="inline-block w-2 h-4 bg-primary align-middle animate-[terminal-cursor_1s_step-end_infinite]" />
                  )}
                </div>
              )
            })}

          {done && (
            <span className="inline-block w-2 h-4 bg-primary align-middle animate-[terminal-cursor_1s_step-end_infinite]" />
          )}
        </div>
      </div>
      <div
        className="absolute -inset-1 -z-10 bg-primary/5 blur-xl"
        aria-hidden="true"
      />
    </div>
  )
}
