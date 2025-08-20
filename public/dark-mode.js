// Simple script to detect and apply dark mode
document.addEventListener('DOMContentLoaded', function() {
  // Check if we should be in dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply dark mode
  if (prefersDark) {
    document.documentElement.classList.add('dark');

    // Find the hero image and ensure it's inverted
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.classList.add('dark:invert');
    }
  }

  // Listen for changes in system preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('dark');

      // Find the hero image and ensure it's inverted
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.classList.add('dark:invert');
      }
    } else {
      document.documentElement.classList.remove('dark');

      // Find the hero image and ensure it's not inverted
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.classList.remove('dark:invert');
      }
    }
  });
});
