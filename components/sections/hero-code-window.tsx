"use client"

import { useEffect, useState } from "react"

const lines = [
  { prefix: "$ ", text: "taia init project" },
  { prefix: "> ", text: "Scaffolding architecture..." },
  { prefix: "> ", text: "Setting up database layer" },
  { prefix: "> ", text: "Configuring API endpoints" },
  { prefix: "> ", text: "Deploying to production" },
  { prefix: "", text: "\u2713 Build complete. Ready to launch." },
]

export function CodeWindow() {
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
    const el = document.getElementById("hero-code-window")
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
        const delay = charIdx === fullText.length ? 150 : 30 + Math.random() * 40
        timeout = setTimeout(type, delay)
      } else {
        lineIdx++
        charIdx = 0
        timeout = setTimeout(type, 200)
      }
    }

    timeout = setTimeout(type, 400)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [visible])

  return (
    <div id="hero-code-window" className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-lg border bg-card shadow-lg">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-muted-foreground">terminal</span>
        </div>
        <div className="p-4 font-mono text-xs leading-relaxed sm:text-sm">
          {!visible && <span className="text-muted-foreground">$ _</span>}
          {visible &&
            lines.map((line, i) => {
              const display = typedLines[i]
              const isLastLine = i === lines.length - 1
              const currentlyTyping = !done && display && display.length < (line.prefix + line.text).length

              if (!display) return null

              if (isLastLine) {
                return (
                  <div key={i}>
                    <span className="text-emerald-400">{display}</span>
                    {currentlyTyping && (
                      <span className="inline-block w-2 h-4 bg-primary align-middle animate-[terminal-cursor_1s_step-end_infinite]" />
                    )}
                  </div>
                )
              }

              return (
                <div key={i}>
                  <span className="text-primary/60">{display.slice(0, line.prefix.length)}</span>
                  <span className="text-muted-foreground">{display.slice(line.prefix.length)}</span>
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
      <div className="absolute -inset-1 -z-10 rounded-lg bg-primary/5 blur-xl" aria-hidden="true" />
    </div>
  )
}
