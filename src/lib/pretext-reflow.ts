// ── Pretext: intelligent slogan reflow ──
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

export function initPretextReflow(elementId: string) {
  const slogan = document.getElementById(elementId);
  if (!slogan) return;

  const text = slogan.getAttribute('data-text') || '';
  const font = getComputedStyle(slogan).font;
  let cachedPrepared: ReturnType<typeof prepareWithSegments> | null = null;
  let lastWidth = 0;
  let rafId: number | null = null;

  function reflowSlogan() {
    if (!slogan || !text) return;
    const maxWidth = slogan.clientWidth;
    if (maxWidth <= 0 || maxWidth === lastWidth) return;
    lastWidth = maxWidth;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      try {
        if (!cachedPrepared) {
          cachedPrepared = prepareWithSegments(text, font);
        }
        const result = layoutWithLines(cachedPrepared, maxWidth, 1.5);
        const nextHTML = result.lines.map((l: { text: string }) => l.text.trim()).join('<br>');

        if (slogan.innerHTML !== nextHTML) {
          slogan.innerHTML = nextHTML;
        }
      } catch {
        // Pretext failed — keep original
      }
    });
  }

  // Only reflow if not reduced-motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reflowSlogan();

    let debounceTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(reflowSlogan, 100);
    });
    ro.observe(slogan);
  }
}
