# Jonatan's DevBlog

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
