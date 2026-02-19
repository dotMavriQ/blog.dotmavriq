export interface PortfolioItem {
  slug: string;
  title: string;
  description: string;
  image: string | ImageMetadata; // can be imported asset or remote path
  tags: string[];
  links: { type: 'github' | 'live' | 'chrome' | 'firefox' | 'wordpress' | 'npm'; url: string }[];
  featured?: boolean;
  year?: number;
}

// Local logo image imports (Vite will emit optimized assets)
import habsiadLogo from '../assets/portfolio/habsiadlogo.png';
import linianLogo from '../assets/portfolio/linianlogo.png';
import slactacLogo from '../assets/portfolio/slactaclogo.png';
import blogLogo from '../assets/portfolio/dotmavriqlogo.png';
import teamtailorLogo from '../assets/portfolio/teamtailorwplogo.png';
import bufloLogo from '../assets/portfolio/buflo.png';
import lineawebLogo from '../assets/portfolio/lineaweb.png';
import lineatuiLogo from '../assets/portfolio/lineatui.png';
import tealScreenshot from '../assets/portfolio/tealscreenshot.png';
import foodtrotterScreenshot from '../assets/portfolio/foodtrotter.png';
export const portfolio: PortfolioItem[] = [
  {
    slug: 'habsiad',
    title: 'Habsiad',
  description: 'Your Obsidian ⚡ Habitica bridge. Sync tasks & stats, enrich daily notes, surface streak insights.',
    image: habsiadLogo,
    tags: ['TypeScript','Obsidian','API'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/Habsiad' } ],
    featured: true,
    year: 2025
  },
  {
    slug: 'linian',
    title: 'Linian',
    description: 'Transforms [TEAM-465] style Linear issue shortcodes into rich, status‑aware links in Obsidian notes.',
    image: linianLogo,
    tags: ['TypeScript','Obsidian','Linear'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/Linian' } ],
    year: 2025
  },
  {
    slug: 'slactac',
    title: 'Slactac',
    description: 'Chrome extension that overrides & thematically normalizes Slack channel names for cleaner focus.',
    image: slactacLogo,
    tags: ['JavaScript','Extension'],
    links: [
      { type: 'github', url: 'https://github.com/dotMavriQ/Slactac' },
      { type: 'chrome', url: 'https://chromewebstore.google.com/detail/slactac/gnjiocbockjlkpnlonimgihcbhpdephe' },
      { type: 'firefox', url: 'https://addons.mozilla.org/en-US/firefox/addon/slactac/' }
    ],
    year: 2024
  },
  {
    slug: 'blog-dotmavriq',
    title: 'blog.dotmavriq',
    description: 'Personal devBlog / CV / Portfolio: Astro + Tailwind, animated backgrounds, content collections.',
    image: blogLogo,
    tags: ['TypeScript','Astro','Tailwind'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/blog.dotmavriq' } ],
    year: 2025
  },
  {
    slug: 'teal',
    title: 'TEAL',
    description: 'Self-hosted media tracker for books, movies, and anime. Import from Goodreads, IMDb, and MyAnimeList. Metadata enrichment via OpenLibrary, TMDB, and Jikan.',
    image: tealScreenshot,
    tags: ['PHP', 'Laravel', 'Livewire', 'Tailwind'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/teal' } ],
    year: 2025
  },
  {
    slug: 'teamtailor-integrator',
    title: 'TeamTailor Integrator for WordPress',
    description: 'Imports TeamTailor job ads into WordPress CPTs with taxonomy mapping, cron sync & SEO‑friendly markup.',
    image: teamtailorLogo,
    tags: ['PHP','WordPress','API'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/TeamTailor-Integrator-For-WordPress' } ],
    year: 2024
  },
  {
    slug: 'linea-web',
    title: 'Linea Web',
    description: 'AI-powered Linear issue resolution that runs entirely in the browser. Connects Linear issues with Gemini AI, no backend required.',
    image: lineawebLogo,
    tags: ['TypeScript', 'AI', 'Linear', 'Gemini'],
    links: [
      { type: 'github', url: 'https://github.com/dotMavriQ/linea-web' },
      { type: 'live', url: 'https://dotmavriq.github.io/linea-web/' }
    ],
    year: 2025
  },
  {
    slug: 'linea-tui',
    title: 'Linea TUI',
    description: 'CLI tool connecting Linear issues with Gemini AI. TUI for triaging, resolving and managing issues from the terminal.',
    image: lineatuiLogo,
    tags: ['Lua', 'AI', 'Linear', 'Gemini', 'TUI'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/linea' } ],
    year: 2025
  },
  {
    slug: 'foodtrotter',
    title: 'Foodtrotter',
    description: 'Spin-the-wheel app for discovering global cuisines. Pick a random country and get recipes, cultural context, and Wikipedia deep links.',
    image: foodtrotterScreenshot,
    tags: ['JavaScript', 'CSS', 'HTML'],
    links: [
      { type: 'github', url: 'https://github.com/dotMavriQ/foodtrotter' },
      { type: 'live', url: 'https://dotmavriq.github.io/foodtrotter/' }
    ],
    year: 2024
  },
  {
    slug: 'buflo',
    title: 'BUFLO',
    description: 'Billing Unified Flow Language & Orchestrator. DSL for defining, validating and running billing pipelines.',
    image: bufloLogo,
    tags: ['Lua', 'Billing'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/Buflo' } ],
    year: 2025
  },
];
