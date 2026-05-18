/**
 * Run `init` on first load + on every SPA navigation (astro:page-load).
 * Safe to call from any component <script>; `init` should be idempotent
 * (typically by aborting a previous AbortController on each run).
 */
export function bootOnReady(init: () => void): void {
  document.addEventListener("astro:page-load", init);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
