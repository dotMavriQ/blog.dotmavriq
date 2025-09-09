export interface PortfolioItem {
  slug: string;
  title: string;
  description: string;
  image: string | ImageMetadata; // can be imported asset or remote path
  tags: string[];
  links: { type: 'github' | 'live' | 'chrome' | 'wordpress' | 'npm'; url: string }[];
  featured?: boolean;
  year?: number;
}

// Local logo image imports (Vite will emit optimized assets)
import habsiadLogo from '../pages/portfolio/habsiadlogo.png';
import linianLogo from '../pages/portfolio/linianlogo.png';
import slactacLogo from '../pages/portfolio/slactaclogo.png';
import blogLogo from '../pages/portfolio/dotmavriqlogo.png';
import teamtailorLogo from '../pages/portfolio/teamtailorwplogo.png';
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
    tags: ['JavaScript','Chrome Extension'],
    links: [
      { type: 'github', url: 'https://github.com/dotMavriQ/Slactac' },
  { type: 'chrome', url: 'https://chromewebstore.google.com/detail/slactac/gnjiocbockjlkpnlonimgihcbhpdephe' }
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
    title: 'teal',
    description: 'Essential aggregator library providing minimal abstractions for data collection & transformation.',
    image: 'https://opengraph.githubassets.com/1/dotMavriQ/teal',
    tags: ['PHP','Library'],
    links: [ { type: 'github', url: 'https://github.com/dotMavriQ/teal' } ],
    year: 2024
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
];
