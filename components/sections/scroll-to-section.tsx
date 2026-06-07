"use client"

const HEADER_HEIGHT = 64

interface ScrollToSectionProps {
  target: string
  children: React.ReactNode
  className?: string
  "aria-label"?: string
}

export function ScrollToSection({
  target,
  children,
  className,
  "aria-label": ariaLabel,
}: ScrollToSectionProps) {
  function handleClick() {
    const el = document.getElementById(target)
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT - 16
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
