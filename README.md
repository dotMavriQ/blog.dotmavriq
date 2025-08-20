# Jonatan's DevBlog
# Jonatan's Astro DevBlog

A fast, accessible, gruvbox-dark themed developer blog and portfolio, built with Astro and deployable to GitHub Pages.

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

If you encounter issues with the `astro` command not being found, try one of these solutions:

1. Use the included script to fix dependencies:
```bash
# Make the script executable
chmod +x fix-dependencies.sh

# Run the script
./fix-dependencies.sh
```

2. Use the alternative start script:
```bash
# Make the script executable
chmod +x start-dev.sh

# Run the script
./start-dev.sh
```

3. Run Astro directly with npx:
```bash
npx astro dev
```

### Building for Production

```bash
npm run build
```

### Deployment

```bash
npm run deploy
```

This will build the site and deploy it to the `gh-pages` branch.

## Project Structure

- `src/components/`: Reusable UI components
- `src/layouts/`: Page layouts
- `src/pages/`: Routes and pages
- `src/styles/`: Global stylesheets (including gruvbox.css)
- `public/`: Static assets

## Features

- Gruvbox dark color theme
- Responsive design
- Canvas-based road animation on the homepage
- Blog posts with MDX support
- GitHub Pages deployment
- Accessibility features

## Note on Animation

The homepage features a canvas-based road animation where a ninja character appears to be running toward the viewer. The animation respects user preferences for reduced motion.
A fast, accessible, gruvbox-dark themed developer blog and portfolio, built with Astro and deployable to GitHub Pages.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 🧰 Tech Stack

- **[Astro](https://astro.build/)** - Core framework with static site generation
- **[MDX](https://mdxjs.com/)** - Markdown with JSX for rich content
- **Gruvbox Dark** - Color scheme

## 📁 Project Structure

```
.
├─ public/
│  ├─ favicon.svg
│  ├─ social‑icons/
│  └─ robots.txt, sitemap.xml (auto‑generated)
├─ src/
│  ├─ components/
│  │  ├─ Nav.astro
│  │  ├─ Footer.astro
│  │  ├─ SkillMeter.astro
│  │  └─ Card.astro
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ pages/
│  │  ├─ index.astro              ← landing
│  │  ├─ about.astro
│  │  ├─ cv.astro
│  │  ├─ portfolio.astro
│  │  ├─ contact.astro
│  │  └─ blog/
│  │     ├─ index.astro           ← blog list
│  │     └─ [slug].astro          ← dynamic post route
│  └─ styles/theme.css            ← gruvbox dark
└─ astro.config.mjs
```

## 🌟 Features

- **Fast Performance**: Static site generation with minimal JavaScript
- **Accessible**: Semantic HTML, ARIA attributes, and keyboard navigation
- **Responsive**: Mobile-first design that works on all devices
- **Dark Theme**: Gruvbox dark color scheme for reduced eye strain
- **Blog with MDX**: Write content in Markdown with component support
- **GitHub Pages Deployment**: Simple deployment process

## 🔄 Deployment

The site is configured to deploy to GitHub Pages under the domain `blog.dotmavriq.life`.

To deploy:

```bash
npm run deploy
```

This builds the site and pushes it to the `gh-pages` branch, which GitHub Pages serves automatically.

## 🌐 Custom Domain

The site is configured to use `blog.dotmavriq.life` as its custom domain. This is set up via:

1. The `CNAME` file in the repository root
2. DNS settings pointing to GitHub Pages

## 📝 License

Copyleft 2023. All rights reserved.
