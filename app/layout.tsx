import type { Metadata, Viewport } from "next";
import {
  Geist,
  JetBrains_Mono,
  Roboto_Slab,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-heading",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Taia Tiniyara — Software Engineering Studio",
    template: "%s | Taia Tiniyara",
  },
  description:
    "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
  openGraph: {
    title: "Taia Tiniyara — Software Engineering Studio",
    description:
      "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
    siteName: "Taia Tiniyara",
    type: "website",
    images: [{ url: "/taia.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taia Tiniyara — Software Engineering Studio",
    description:
      "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
    images: ["/taia.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Taia Tiniyara",
  description:
    "Custom web apps, mobile apps, and API development. We build software that moves your business forward.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Taia Tiniyara",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        robotoSlab.variable,
        sourceSerif.variable,
        jetbrainsMono.variable,
        geist.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-none focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <ThemeProvider>
          {children}
          <Toaster
            toastOptions={{
              unstyled: true,
              className:
                "rounded-none bg-background flex gap-4 items-center text-white shadow-lg p-4 font-medium",
              classNames: {
                success: "bg-green-500",
                error: "bg-red-500",
                info: "bg-blue-500",
                warning: "bg-amber-500",
              },
            }}
            duration={7000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
