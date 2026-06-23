import { test, expect } from '@playwright/test';

// ─── Navigation & Layout ─────────────────────────────────────────
test.describe('Navigation & Layout', () => {
  test('homepage loads with correct title and JSON-LD', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/blog\.dotmavriq\.life/);

    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toBeAttached();
    const json = JSON.parse(await ld.textContent() || '{}');
    expect(json['@type']).toBe('WebSite');
    expect(json.author.name).toBe('Jonatan Jansson');
  });

  test('all nav links present and correct', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.nav-links a');
    const hrefs = await nav.evaluateAll(links =>
      links.map(a => (a as HTMLAnchorElement).getAttribute('href'))
    );
    for (const path of ['/about', '/contact', '/cv', '/portfolio', '/blog']) {
      expect(hrefs).toContain(path);
    }
  });

  test('OG meta tags present on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
  });

  test('canonical URL is set', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('link[rel="canonical"]').first()).toHaveAttribute('href', /\/about/);
  });
});

// ─── Page Smoke Tests ────────────────────────────────────────────
test.describe('Pages load', () => {
  const pages = [
    { path: '/about',     heading: /about/i },
    { path: '/contact',   heading: /contact/i },
    { path: '/cv',        heading: /Jonatan Jansson/i },
    { path: '/portfolio', heading: /portfolio/i },
    { path: '/blog',      heading: /blog/i },
  ];

  for (const { path, heading } of pages) {
    test(`${path} renders with h1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1').first()).toContainText(heading);
    });
  }

  test('about page uses the existing WebP profile image', async ({ page }) => {
    await page.goto('/about');

    await expect(page.locator('.about-hero__photo img')).toHaveAttribute('src', '/cool.webp');
    const profileJson = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((script) => script.textContent || '');
    expect(profileJson).toContain('/cool.webp');
  });
});

// ─── Blog Index ──────────────────────────────────────────────────
test.describe('Blog index', () => {
  test('renders published posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1').first()).toContainText(/blog/i);
    expect(await page.locator('.post-card').count()).toBeGreaterThan(0);
    await expect(page.locator('main')).toContainText(/State of WordPress 2026|Model Context Protocol/i);
  });
});

// ─── View Transitions ───────────────────────────────────────────
test.describe('View Transitions', () => {
  test('nav and marquee stay visible during client-side navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.nav');
    const marquee = page.locator('.nav-cloud-border');
    const cloudTrack = page.locator('.cloud-track');

    await expect(nav).toBeVisible();
    await expect(marquee).toBeVisible();
    // Marquee should have cloud-art tiles rendered
    await expect(cloudTrack.locator('.cloud-art').first()).toBeAttached();

    // Navigate via click (client-side navigation)
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');

    await expect(nav).toBeVisible();
    await expect(marquee).toBeVisible();
    // Marquee must still have tiles after navigation
    await expect(cloudTrack.locator('.cloud-art').first()).toBeAttached({ timeout: 3000 });

    // Navigate again
    await page.click('a[href="/blog"]');
    await page.waitForURL('/blog');

    await expect(nav).toBeVisible();
    await expect(marquee).toBeVisible();
    await expect(cloudTrack.locator('.cloud-art').first()).toBeAttached({ timeout: 3000 });
  });

  test('theme persists across client-side navigation', async ({ page }) => {
    await page.goto('/');
    // Wait for init to bind the theme toggle listener
    await page.waitForFunction(() => document.getElementById('theme-toggle') !== null);
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Navigate via link click
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

// ─── Theme Toggle ────────────────────────────────────────────────
test.describe('Theme toggle', () => {
  test('toggles light/dark and persists across navigation', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Persists to another page
    await page.goto('/about');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Toggles back
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

// ─── Mobile Navigation ───────────────────────────────────────────
test.describe('Mobile navigation', () => {
  test('hamburger menu toggles on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveAttribute('hidden', '');

    await page.click('#nav-toggle');
    await expect(mobileMenu).not.toHaveAttribute('hidden', '');

    await page.click('#nav-toggle');
    await expect(mobileMenu).toHaveAttribute('hidden', '');
  });
});

// ─── Contact Page ────────────────────────────────────────────────
test.describe('Contact page', () => {
  test('shows all contact channels', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const channels = page.locator('.channel-row .channel');
    expect(await channels.count()).toBeGreaterThanOrEqual(4);
  });

  test('contact icons share a consistent square frame', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await expect(page.locator('.channel-row')).toBeVisible();
    const sizes = await page.locator('.channel-row .channel__icon').evaluateAll((icons) =>
      icons.map((icon) => {
        const rect = icon.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
    );

    expect(sizes.length).toBeGreaterThanOrEqual(4);
    const first = sizes[0];
    expect(first.width).toBe(first.height);
    for (const size of sizes) {
      expect(size.width).toBe(first.width);
      expect(size.height).toBe(first.height);
    }
  });

  test('email link uses obfuscation and decodes to mailto', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const emailCard = page.locator('#email-card');
    await expect(emailCard).toHaveAttribute('data-m', /.+/);
    // JS decodes the data-m attribute into a real mailto href
    await expect(emailCard).toHaveAttribute('href', /^mailto:.+@.+/);
  });
});

// ─── CV Page ─────────────────────────────────────────────────────
test.describe('CV page', () => {
  test('renders hero with name and title', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('.cv-hero')).toBeVisible();
    await expect(page.locator('.cv-hero h1')).toContainText('Jonatan Jansson');
    await expect(page.locator('.cv-title')).toContainText('Experienced Full-Stack Developer');
  });

  test('print button exists', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('#cv-print-btn')).toBeVisible();
  });

  test('print button only triggers one print dialog per click', async ({ page }) => {
    await page.goto('/cv');
    await page.evaluate(() => {
      let calls = 0;
      window.print = () => {
        calls += 1;
      };
      Object.defineProperty(window, '__printCalls', {
        configurable: true,
        get: () => calls,
      });
      document.dispatchEvent(new Event('astro:page-load'));
    });

    await page.locator('#cv-print-btn').click();

    await expect
      .poll(() => page.evaluate(() => (window as any).__printCalls))
      .toBe(1);
  });

  test('email uses obfuscation, not plaintext', async ({ page }) => {
    await page.goto('/cv');
    const emailLink = page.locator('#cv-email');
    await expect(emailLink).toHaveAttribute('data-m', /.+/);
    // JS decodes to a real mailto
    const href = await emailLink.getAttribute('href');
    expect(href).toMatch(/^mailto:.+@.+/);
    // Visible text should stay recruiter-friendly, not expose the address
    await expect(emailLink).toContainText('email me');
    await expect(emailLink).not.toContainText('@');
  });
});

// ─── Portfolio Page ──────────────────────────────────────────────
test.describe('Portfolio page', () => {
  test('renders featured project', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('.featured-card')).toBeVisible();
    await expect(page.locator('.featured-card h2')).toContainText('TEAL');
  });
});

// ─── External Link Safety ────────────────────────────────────────
test.describe('External links', () => {
  test('external links have rel="noopener" and target="_blank"', async ({ page }) => {
    await page.goto('/contact');
    const externals = page.locator('a[target="_blank"]');
    const count = await externals.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const rel = await externals.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });
});

// ─── Feeds & SEO Endpoints ───────────────────────────────────────
test.describe('Feeds & SEO', () => {
  test('RSS feed is valid XML', async ({ page }) => {
    const res = await page.goto('/rss.xml');
    expect(res?.status()).toBe(200);
    expect(res?.headers()['content-type'] || '').toContain('xml');
  });

  test('Atom feed is valid XML', async ({ page }) => {
    const res = await page.goto('/atom.xml');
    expect(res?.status()).toBe(200);
    expect(res?.headers()['content-type'] || '').toContain('xml');
  });

  test('robots.txt references sitemap', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBe(200);
    const body = await res?.text();
    expect(body).toContain('Sitemap:');
  });

  test('sitemap-index.xml exists in build output', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const sitemapPath = path.resolve('dist', 'sitemap-index.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    expect(content).toContain('sitemap');
  });

  test('sitemap emits <lastmod> for every blog post URL', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const xml = fs.readFileSync(path.resolve('dist', 'sitemap-0.xml'), 'utf-8');
    const blogUrls = [...xml.matchAll(/<loc>([^<]*\/blog\/[a-z0-9-]+)<\/loc>(<lastmod>[^<]*<\/lastmod>)?/g)];
    expect(blogUrls.length).toBeGreaterThan(0);
    for (const [, loc, lastmod] of blogUrls) {
      expect(lastmod, `missing <lastmod> for ${loc}`).toBeTruthy();
    }
  });

  test('search-index.json returns valid JSON array', async ({ page }) => {
    const res = await page.goto('/search-index.json');
    expect(res?.status()).toBe(200);
    const data = await res?.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

// ─── Skip Link ───────────────────────────────────────────────────
test.describe('Skip link', () => {
  test('skip-to-content link exists and targets #main', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('.skip-link');
    await expect(skip).toHaveAttribute('href', '#main');
    // Should be off-screen by default
    const box = await skip.boundingBox();
    expect(box?.x).toBeLessThan(0);
  });
});

// ─── Email Scraping Protection ───────────────────────────────────
test.describe('Email scraping protection', () => {
  test('no plaintext @dotmavriq.life emails in source href attributes', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/cv', '/portfolio', '/blog'];
    for (const p of pages) {
      await page.goto(p);
      // No href="mailto:...@dotmavriq.life" in raw source (JS-decoded is fine)
      await page.locator('a').evaluateAll(links =>
        links
          .map(a => a.getAttribute('href') || '')
          .filter(h => h.includes('@dotmavriq.life') && !h.startsWith('mailto:'))
      );
      // After JS runs, mailto: hrefs are expected (decoded from data-m)
      // But there should be NO anchor with a hardcoded mailto in the HTML source
      const hardcoded = await page.locator('a:not([data-m])').evaluateAll(links =>
        links.filter(a => (a.getAttribute('href') || '').includes('mailto:') && (a.getAttribute('href') || '').includes('@dotmavriq.life'))
      );
      expect(hardcoded.length, `Found hardcoded mailto on ${p}`).toBe(0);
    }
  });
});
