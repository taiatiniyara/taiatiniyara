// Measured facts about this site, shown on the home page as proof for the three promises.
// They are lab results from one day against a production build, not live numbers: re-run after meaningful changes and update this file.
//   Accessibility: axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa) on the live site's 7 public pages (home, about, contact, contact sent, blog, projects, 404), light and dark, desktop and mobile: 0 violations.
//     The live site had no projects or posts yet, so the same run on a local build with placeholder content (13 pages) also found 0.
//   Third parties: every request on every page went to this site's own host, and no cookies were set.
//   Weight: the home page's HTML, CSS, scripts and fonts, brotli-compressed, images excluded: 44.5 kB.
// Not claimed because it depends on the real cover images: LCP. Run
//   npx lighthouse https://taiatiniyara.com --form-factor=mobile --only-categories=performance
// on the live site and add it here if it is good.
export const proof = {
  measuredOn: "2026-10-23",
  firstLoadKb: 45,
  pages: 7,
  axeViolations: 0,
  thirdParty: 0,
};
