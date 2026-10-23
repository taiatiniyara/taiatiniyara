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
- Hover/pressed states move or invert a block; they never blur or glow. Cards move 4 px up and left (not under `prefers-reduced-motion`).
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
- **Band:** a full-width section on the page background, with a 64 px top and bottom. At most one Dark Blue band ("block") for every two plain ones. A block looks the same in both themes: Dark Blue ground, Mist text, Neon accent, Ink surfaces, and the page's spectrum colour at full strength (it is safe on Dark Blue even when the page is light). Use it for the hero and the contact section.
- **Feature card:** the first project, large (image beside text from 64 rem). The rest are ruled rows (below), not a card grid. A result line (`Result: …`) is a solid block in the section colour, full width of its container (text Ink, or Mist on Violet). No side bars.
- **Row list:** 1 px rules in the text colour, 24 px padding, title left and summary right from 40 rem. Used for projects and posts. The whole row is one link; hover inverts the block.
- **Split:** from 64 rem a section is a heading column (18 rem) beside its content, so sections don't all read heading-then-grid. Use it for proof, posts and contact; keep the work list full width.
- **Highlight word:** the hero headline sets one word on a solid block in the page colour. Once per page.
- **Proof ledger:** claim on the left, measurement (a Stat) on the right, rows ruled like a receipt. No equal cards, no accent bars.
- **No decoration for its own sake:** no kicker or eyebrow labels above headings, and no bar under headings. Colour marks something: the highlight word, a result, the current page.
- **Stat:** a number in Martian Mono 800 (32–48 px, never Dela Gothic), then one plain sentence saying what was measured. Only publish a number you measured; say when.
- **Field error:** 2 px Hibiscus border, a `!` icon and the message in body text colour (Hibiscus text is too weak on Dark Blue). It says what to do next, appears on blur, and clears once the answer is fixed.
- **Copy button:** secondary button, confirms with a text message in a live region, never by colour alone.
- **Empty / error / loading:** skeletons (flat Blue blocks) for loading; short, plain-language messages with one next step.

## Motion
- 150–200 ms, `transform` and `opacity` only, `steps()` or ease-out. Nothing loops except loaders.
- Respect `prefers-reduced-motion`: no movement, only instant state changes.
- **Signature motion** is the mark's ten tiles moving on the grid, always with `steps()`. Each tile or block moves for 150–200 ms; a sequence staggers them by 30–60 ms and never runs past about 1 s.
  - **Home intro:** the tiles drop in, then the highlight word is stamped on (a block wipes in behind it). Once per session.
  - **Page curtain:** five columns lift off the new page when you follow a link on the site. Not on a first visit, reload or Back.
  - **Loader and confirmation:** the tiles light up in turn while the contact form sends (the one allowed loop); on the "message sent" page they drop in and stay.
  - **Ledger:** proof rows step in as they scroll into view.
- Flat colour only: Dark Blue, the accent and the page's spectrum colour. In the light theme the curtain uses Dark Blue and Violet, never Neon.

## UX
- Mobile first. Tap targets 44 × 44 px minimum.
- WCAG 2.1 AA: semantic landmarks, keyboard reachable, alt text, visible focus, sensible heading order.
- Theme follows the system setting, with a manual toggle remembered per visitor. (Open: dark as the default for first-time visitors?)
- Performance budget: LCP under 2.5 s on mid-range mobile, no layout shift, fonts `swap` with matching fallbacks.
- One clear path per page type: Home → Work → Contact. Blog: list → post → subscribe.
- Voice: first person, plain, short sentences. No buzzwords.
