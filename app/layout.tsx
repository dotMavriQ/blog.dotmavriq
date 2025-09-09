import Head from "next/head";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import ClientShakeWrapper from "./components/ClientShakeWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

// Define your JSON‑LD schema as an object
const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://blog.dotmavriq.life/#website",
      "url": "https://blog.dotmavriq.life/",
      "name": "blog.dotMavriQ",
      "description": "Personal blog of Jonatan Jansson (dotMavriQ) - a problem-solving developer with a passion for Linux, full-stack development, and creating user-centered solutions.",
      "publisher": {
        "@type": "Organization",
        "name": "dotMavriQ",
        "logo": {
          "@type": "ImageObject",
          "url": "https://blog.dotmavriq.life/logo.png"
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://blog.dotmavriq.life/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Blog",
      "@id": "https://blog.dotmavriq.life/#blog",
      "url": "https://blog.dotmavriq.life/blog",
      "name": "Blog",
      "description": "Personal blog of Jonatan Jansson (dotMavriQ) - a problem-solving developer with a passion for Linux, full-stack development, and creating user-centered solutions.",
      "publisher": {
        "@type": "Organization",
        "name": "dotMavriQ"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "blog.dotMavriQ",
  description:
    "Personal blog of Jonatan Jansson (dotMavriQ) - a problem-solving developer with a passion for Linux, full-stack development, and creating user-centered solutions.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en" className="scroll-smooth">
      <Head>
        {/* Inject the JSON‑LD schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
    <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="dotMavriQ Blog RSS" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#282828" />
    <meta name="color-scheme" content="dark light" />
    <meta name="format-detection" content="telephone=no" />
      </Head>
      <body
    className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable} flex flex-col min-h-screen antialiased bg-background text-foreground`}
      >
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#fabd2f] text-[#282828] px-3 py-2 rounded-md z-50">Skip to content</a>
        {/* Global shake detection works on all pages */}
        <ClientShakeWrapper />
        
        <header className="sticky top-0 z-50 p-4 bg-[#282828] bg-opacity-90 backdrop-blur-md shadow-lg border-b border-[#665c53]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#ebdbb2]">
              <Link href="/">blog.dotMavriQ</Link>
            </h1>
            <Navbar />
          </div>
        </header>
  <main id="main-content" className="flex-grow p-4" role="main">{children}</main>
        <footer className="p-4 bg-[#282828] bg-opacity-90 backdrop-blur-md shadow-inner border-t border-[#665c53] text-center">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-[#ebdbb2]">
              🄯 {new Date().getFullYear()} dotMavriQ. <a 
                href="https://archive.org/details/flash_allyourbase" 
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-[#ebdbb2] hover:text-[#ebdbb2] cursor-default"
                title="All your base are belong to us"
              >All base are belong to us.</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
