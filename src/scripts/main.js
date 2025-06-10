// Main JavaScript file for the site

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  setupMobileNav();

  // Animate skill bars
  animateSkillBars();

  // Animate cards
  animateCards();
});

function setupMobileNav() {
  const menuButton = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuButton && navMenu) {
    menuButton.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !menuButton.contains(event.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function animateSkillBars() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillProgress = entry.target;
          const value = skillProgress.getAttribute('data-value');
          skillProgress.style.transform = `scaleX(${value / 100})`;
          observer.unobserve(skillProgress);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-meter__progress').forEach(progress => {
      observer.observe(progress);
    });
  } else {
    // Fallback for browsers without IntersectionObserver support
    document.querySelectorAll('.skill-meter__progress').forEach(progress => {
      const value = progress.getAttribute('data-value');
      progress.style.transform = `scaleX(${value / 100})`;
    });
  }
}

function animateCards() {
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-slide-up');
          }, 100 * index);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(card => {
      cardObserver.observe(card);
    });
  }
}

// Prevent flash of unstyled content
document.documentElement.classList.add('has-loaded');

// Performance optimization - mark end of critical rendering
window.addEventListener('load', () => {
  // Use requestIdleCallback for non-critical operations
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Load non-critical resources here
      prefetchPages();
    });
  } else {
    setTimeout(prefetchPages, 1000);
  }
});

// Prefetch important pages for faster navigation
function prefetchPages() {
  const pagesToPrefetch = [
    '/about',
    '/blog',
    '/portfolio'
  ];

  if ('IntersectionObserver' in window) {
    pagesToPrefetch.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }
}
