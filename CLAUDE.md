# Taia Tiniyara

## Branding (always apply)

Everything built here (website, emails, docs, social assets, slides) must use the brand in `brand/`. Read these before making any visual or UX decision:

- `brand/ui-ux.md`: UI/UX rules (grid, colour roles, type, components, motion, accessibility). Follow them; resolve **Open** items by asking, not guessing.
- `brand/colors.css`: the only source of colour. Use the CSS variables; never introduce new hex values.
- `brand/index.html`: visual reference (mark, colourways, type, UI preview). Match it.
- `brand/mark*.svg`, `brand/avatar.svg`: the logo files. Use them as-is; don't redraw the mark.

Non-negotiables:
- The mark is the logo. **No wordmark, tagline or outline** next to or inside it.
- Neon Green `#05FF00` and Dark Blue `#003F57` are the anchors; add one spectrum colour per page or section. Neon never goes on light backgrounds.
- Headlines (h1–h3): **Dela Gothic One**. Everything else: **Martian Mono**. No other fonts.
- Flat and blocky: square corners, no gradients, no shadows, 8 px spacing grid.
- Keep WCAG AA contrast and a visible focus ring.

If a request conflicts with the brand, say so and ask before deviating. If the brand needs to change, update `brand/` first, then the code.
