export const SITE = "https://taiatiniyara.com";
export const SITE_NAME = "Taia Tiniyara";
export const DEFAULT_DESCRIPTION = "Web apps, mobile apps and APIs that load fast and work for everyone. Tell me what you need.";
export const DEFAULT_IMAGE = "/og.png";

export const absUrl = (path: string) => new URL(path, SITE).href;

/** Social previews want a raster image near 1200 px; our own media is resized on the fly. */
export const socialImage = (path: string | undefined) =>
  absUrl(!path ? DEFAULT_IMAGE : path.startsWith("/media/") && !path.includes("?") ? `${path}?w=1200` : path);

export const isoDate = (sec: number | null | undefined) => (sec ? new Date(sec * 1000).toISOString() : undefined);

export const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: SITE_NAME,
  url: SITE,
  jobTitle: "Software engineer",
  email: "mailto:mail@taiatiniyara.com",
  address: { "@type": "PostalAddress", addressCountry: "FJ" },
};

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    person,
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: SITE_NAME, inLanguage: "en", publisher: { "@id": person["@id"] } },
  ],
});

export const breadcrumbLd = (trail: [name: string, path: string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absUrl(path) })),
});

export const articleLd = (a: { title: string; description: string; path: string; image?: string; published: number | null; updated: number }) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: a.title,
  description: a.description || undefined,
  url: absUrl(a.path),
  mainEntityOfPage: absUrl(a.path),
  image: socialImage(a.image),
  datePublished: isoDate(a.published),
  dateModified: isoDate(a.updated),
  inLanguage: "en",
  author: person,
  publisher: person,
});

/** JSON for a <script type="application/ld+json">: "<" is escaped so a title can't close the tag. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
