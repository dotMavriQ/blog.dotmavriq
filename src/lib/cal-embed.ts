// ── Cal.com — lazy-load on click, open their full-viewport modal ──

declare global {
  interface Window { Cal: CalFn & { loaded?: boolean; ns: Record<string, unknown>; q: unknown[] }; }
}

type CalFn = (...args: unknown[]) => void;

let calLoaded = false;
let calListenersBound = false;
let calObserver: MutationObserver | null = null;

function getBlogTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function bootCal() {
  (function (C: Window, A: string, L: string) {
    const p = function (a: { q: unknown[] }, ar: unknown) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal; const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        (d.head.appendChild(d.createElement("script")) as HTMLScriptElement).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api: { q: unknown[]; (...args: unknown[]): void } = function () { p(api, arguments); } as never;
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          return void p(cal.ns[namespace] as { q: unknown[] }, ar);
        }
        p(cal, ar);
        return;
      }
      p(cal, ar);
    } as typeof C.Cal;
  })(window, "https://app.cal.com/embed/embed.js", "init");
  const Cal = window.Cal as CalFn;
  Cal("init", { origin: "https://cal.com" });
  Cal("ui", { styles: { branding: { brandColor: "#000000" } } });
}

function closeCalModal() {
  if (calLoaded && typeof window.Cal === 'function') {
    window.Cal("closeModal");
    return;
  }

  document.querySelectorAll('cal-modal-box').forEach((el) => el.remove());
}

function isCalBackdropClick(event: MouseEvent) {
  const path = event.composedPath();

  return path.some((target) => target instanceof HTMLElement && target.classList.contains('my-backdrop'))
    && !path.some((target) => target instanceof HTMLElement && target.classList.contains('modal-box'));
}

function bindCalDocumentListeners() {
  if (calListenersBound) return;
  calListenersBound = true;

  // Close modal on Escape key or backdrop click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCalModal();
    }
  });

  // Backdrop click: the cal-modal-box renders a full-viewport overlay
  // with the iframe centered. Route backdrop clicks through Cal's own
  // closeModal instruction so its overlay/body cleanup matches the X button.
  document.addEventListener('click', (e) => {
    const modal = document.querySelector('cal-modal-box');
    if (!modal) return;
    if (isCalBackdropClick(e)) {
      closeCalModal();
    }
  });

  // Clean up zombie modal wrappers
  calObserver = new MutationObserver(() => {
    document.querySelectorAll('cal-modal-box').forEach((box) => {
      const iframe = box.querySelector('iframe');
      if (!iframe) { box.remove(); return; }
      const innerObserver = new MutationObserver(() => {
        if (!box.querySelector('iframe')) { box.remove(); innerObserver.disconnect(); }
      });
      innerObserver.observe(box, { childList: true, subtree: true });
    });
  });
  calObserver.observe(document.body, { childList: true });
}

export function initCalEmbed(buttonId: string, calLink: string) {
  bindCalDocumentListeners();

  const calBtn = document.getElementById(buttonId);

  if (!calBtn || calBtn.dataset.calEmbedBound === 'true') return;

  calBtn.dataset.calEmbedBound = 'true';
  calBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeCalModal();
    if (!calLoaded) { calLoaded = true; bootCal(); }
    (window.Cal as CalFn)("modal", { calLink, config: { theme: getBlogTheme() } });
  });
}
