// Runs before first paint: apply the visitor's saved theme, else follow the system setting.
try {
  var t = localStorage.getItem("theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) {}

// Motion flags, set before first paint (brand/ui-ux.md, Motion).
// data-nav: arrived by following a link on this site, so the page curtain plays.
// data-intro="done": the home page's intro has already played this session.
try {
  var root = document.documentElement;
  var nav = performance.getEntriesByType("navigation")[0];
  if (nav && nav.type === "navigate" && document.referrer.indexOf(location.origin + "/") === 0) root.dataset.nav = "";
  if (location.pathname === "/") {
    if (sessionStorage.getItem("intro")) root.dataset.intro = "done";
    else sessionStorage.setItem("intro", "1");
  }
} catch (e) {}
