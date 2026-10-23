// Notes, for this tab only, how the visitor found the site, so a contact message can say where it came from.
// It lives in sessionStorage (no cookie, never sent anywhere) and is read only if the visitor sends the contact form.
// Only a host name or a utm_source is kept, never a full URL.
try {
  if (!sessionStorage.getItem("ref")) {
    const utm = new URLSearchParams(location.search).get("utm_source");
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    sessionStorage.setItem("ref", (utm || (host && host !== location.hostname ? host : "") || "direct").toLowerCase().slice(0, 80));
  }
} catch {}
