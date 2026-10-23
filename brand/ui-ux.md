# UI / UX rules

Draft. Tokens live in `colors.css`; the mark and type are defined in `index.html`.
**Open** items are decisions still to make.

## Principles
1. **Grid first.** Everything snaps to the tile. Base unit 8 px; spacing is 8 × n (8, 16, 24, 32, 48, 64, 96).
2. **Flat and blocky.** No gradients, no drop shadows, no glass. Depth comes from colour blocks and 1 px borders.
3. **Loud colour, quiet layout.** One spectrum colour per page or section; the rest is Ink, Blue, Mist and Green.
4. **Content first.** Fast, readable, one primary action per view.

## Shape
- Corners: 0. (Open: allow 2 px on inputs?)
- Hover/pressed states move or invert a block; they never blur or glow.
- Max content width 64 rem; running text max 60 ch.
- Breakpoints (mobile-first): 40 rem, 64 rem, 80 rem.

## Colour roles
| Role | Dark (default) | Light |
|---|---|---|
| Background | Ink `#00212E` | Mist `#F2F7F5` |
| Surface | Dark Blue `#003F57` | white, 1 px Dark Blue border |
| Text | Mist | Dark Blue |
| Accent / links / primary button | Neon Green (button text: Ink) | Dark Blue (button text: Mist) |
| Section highlight | one of Lagoon, Sun, Hibiscus, Flame, Violet | Violet or Dark Blue only |
| Error | Hibiscus + icon + message | Hibiscus on white, large or bold only |

- Neon colours never sit on light backgrounds (contrast 1.2–1.6:1).
- Small text needs 4.5:1. On Ink, Violet (3.3) and on Blue, Hibiscus (3.2) and Flame (3.6) are large text or shapes only.
- Never rely on colour alone: pair it with an icon, label or underline.

## Type
- **Dela Gothic One** for h1–h3 only. One weight, sentence case, 1.05 line height, 8 words or fewer, never below 24 px.
- **Martian Mono** for everything else, 14–16 px body, line height 1.75, weights 300–800.
- Scale: 14 / 16 / 24 / 32 / 48 / 72 px (fluid with `clamp()` at the top end).
- Links are underlined; the accent colour alone isn't enough.
- **Open:** long blog posts in mono, or a calmer reading face for article bodies?

## Components
- **Button:** rectangular, 44 px min height, 16 px / 24 px padding. Primary = Neon fill. Secondary = 2 px border. One primary per view.
- **Card:** flat, 1 px border or Blue fill. No shadow. Whole card is one link target.
- **Form:** label above field, inline validation on blur, errors say what to do ("Enter an email like name@site.com").
- **Focus:** 2 px Lagoon outline, 2 px offset, always visible. Never remove it.
- **Header:** mark (48 px wide minimum, links home), ≤ 5 nav items, theme toggle. No wordmark next to the mark.
- **Footer:** name as plain text, a privacy line, and contact links. Social links are optional.
- **Empty / error / loading:** skeletons (flat Blue blocks) for loading; short, plain-language messages with one next step.

## Motion
- 150–200 ms, `transform` and `opacity` only, `steps()` or ease-out. Nothing loops except loaders.
- Respect `prefers-reduced-motion`: no movement, only instant state changes.

## UX
- Mobile first. Tap targets 44 × 44 px minimum.
- WCAG 2.1 AA: semantic landmarks, keyboard reachable, alt text, visible focus, sensible heading order.
- Theme follows the system setting, with a manual toggle remembered per visitor. (Open: dark as the default for first-time visitors?)
- Performance budget: LCP under 2.5 s on mid-range mobile, no layout shift, fonts `swap` with matching fallbacks.
- One clear path per page type: Home → Work → Contact. Blog: list → post → subscribe.
- Voice: first person, plain, short sentences. No buzzwords.
