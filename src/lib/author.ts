/**
 * Single source of truth for author identity.
 * Consumed by JSON-LD on all pages, RSS, atom, llms.txt generation, and any
 * future surface that needs to identify the author. Do not hardcode author
 * strings elsewhere.
 */

export const AUTHOR = {
  name: "Jonatan Jansson",
  alternateName: "dotMavriQ",
  jobTitle: "Senior Full-Stack Developer",
  email: "dotmavriq@gmail.com",
  url: "https://blog.dotmavriq.life",
  image: "https://blog.dotmavriq.life/cool.webp",
  description:
    "Developer and systems thinker. Builds tools that reduce cognitive load and writes about the craft of software, productivity, and the practice of paying attention.",
  location: {
    city: "Lisbon",
    countryCode: "PT",
  },
  /** External profiles for schema.org `sameAs` and llms.txt */
  sameAs: [
    "https://github.com/dotMavriQ",
    "https://www.linkedin.com/in/janssonjonatan/",
    "https://social.dotmavriq.life/users/dotmavriq",
  ],
  /** Topic areas the author writes/works on — used by Person JSON-LD `knowsAbout` */
  knowsAbout: [
    "Software Engineering",
    "Web Development",
    "Developer Tools",
    "Systems Design",
    "Cognitive Load Theory",
    "Productivity Systems",
    "AI Tooling",
    "Model Context Protocol",
    "Static Site Generation",
    "ASCII Art",
  ],
} as const;

export type Author = typeof AUTHOR;

/** Site-level constants paired with the author for convenience. */
export const SITE = {
  url: AUTHOR.url,
  name: "blog.dotmavriq.life",
  title: "blog.dotmavriq.life",
  description: AUTHOR.description,
  language: "en",
} as const;
