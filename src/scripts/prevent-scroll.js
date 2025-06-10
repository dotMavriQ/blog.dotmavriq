// Script to prevent any scrolling on the landing page
document.addEventListener('DOMContentLoaded', function() {
  // Prevent default behavior for wheel events
  document.addEventListener('wheel', function(e) {
    e.preventDefault();
  }, { passive: false });

  // Prevent default behavior for touch events that could cause scrolling
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });

  // Prevent keyboard navigation scrolling
  document.addEventListener('keydown', function(e) {
    // Arrow keys, space, page up/down, home/end
    const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];
    if (scrollKeys.includes(e.code)) {
      e.preventDefault();
    }
  });

  // Reset scroll position to ensure it stays at top
  window.scrollTo(0, 0);
});
