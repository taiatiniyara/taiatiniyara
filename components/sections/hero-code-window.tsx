"use client"

import { useEffect, useState, useRef } from "react"

type Line = {
  prefix: string
  text: string
}

const lines: Line[] = [
  { prefix: "$ ", text: "taia build --stack nextjs" },
  { prefix: "  ", text: "" },
  { prefix: "  ", text: "\u25C9 analyzing requirements \u2026" },
  { prefix: "  ", text: "\u25C9 designing data model \u2026" },
  { prefix: "  ", text: "\u25C9 scaffolding project \u2026" },
  { prefix: "  ", text: "\u25C9 building auth \u00B7 payments \u00B7 dashboard" },
  { prefix: "  ", text: "\u25C9 integrating APIs & services" },
  { prefix: "  ", text: "\u25C9 writing tests \u2026" },
  { prefix: "  ", text: "\u2713 214/214 tests passing" },
  { prefix: "  ", text: "\u25C9 running CI checks \u2026" },
  { prefix: "  ", text: "\u2713 lint \u00B7 typecheck \u00B7 build \u00B7 all green" },
  { prefix: "  ", text: "" },
  { prefix: "  ", text: "\u2713 Build complete. Ready for review." },
  { prefix: "$ ", text: "" },
]

function getLineColor(text: string): string {
  if (text.includes("\u2713")) return "text-emerald-400"
  if (text.includes("\u25C9")) return "text-muted-foreground"
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
            build terminal
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
              const lineColor = getLineColor(line.text)

              return (
                <div key={i} className={lineColor}>
                  <span className="text-muted-foreground">
                    {display.slice(0, line.prefix.length)}
                  </span>
                  <span className={lineColor || "text-muted-foreground"}>
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
