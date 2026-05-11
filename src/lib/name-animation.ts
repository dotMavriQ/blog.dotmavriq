// ── Name Animation ──
// Human-feel typing: dot MavriQ ↔ Jonatan Jansson

export function initNameAnimation() {
  const firstEl = document.getElementById("name-first") as HTMLElement;
  const lastEl = document.getElementById("name-last") as HTMLElement;
  const heroName = document.getElementById("hero-name");

  if (!firstEl || !lastEl || !heroName) return;

  // Idempotency guard: this function is wired to both astro:page-load and a
  // DOMContentLoaded/immediate fallback, which can fire on the same page
  // load. A second concurrent typing loop fights the first on the same DOM
  // and produces jittery, non-smooth output. The marker is per-node so SPA
  // navigation back to "/" (which renders a fresh element) re-initializes.
  if (heroName.dataset.nameAnimInit === "1") return;
  heroName.dataset.nameAnimInit = "1";

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    firstEl.textContent = "dot";
    lastEl.textContent = "MavriQ";
    heroName.classList.add("hero-name--alias");
    return;
  }

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Gaussian-ish random: clusters around the mean, occasionally outliers
  const humanDelay = (base: number, jitter: number) => {
    const r = (Math.random() + Math.random() + Math.random()) / 3;
    return Math.floor(base + (r - 0.5) * 2 * jitter);
  };

  // Typing speed varies by position in word
  const typeDelay = (ch: string, i: number, len: number) => {
    if (i === 0) return humanDelay(140, 60);
    if (ch === " " || ch === "\u200B") return humanDelay(180, 80);
    if (i === len - 1) return humanDelay(110, 40);
    if (Math.random() < 0.12) return humanDelay(220, 80);
    return humanDelay(75, 30);
  };

  // Erase like holding backspace: first char slow, then accelerating
  const eraseDelay = (remaining: number, total: number) => {
    const progress = 1 - remaining / total;
    const base = 80 - progress * 45;
    return humanDelay(base, 15);
  };

  // Per-character optical kerning
  const kernMap: Record<string, Record<string, number[]>> = {
    alias: {
      first: [-0.08, -0.12, 0],                        // d  o  t
      last:  [-0.06, -0.06, -0.06, -0.15, -0.08, 0],  // M  a  v  r  i  Q
    },
    real: {
      first: [],
      last:  [],
    },
  };

  const kernedHTML = (word: string, kern: number[], upTo: number) => {
    let html = "";
    for (let i = 0; i < upTo; i++) {
      const ch = word[i];
      const ls = kern[i] ?? 0;
      html += ls !== 0
        ? `<span style="letter-spacing:${ls}em">${ch}</span>`
        : ch;
    }
    return html;
  };

  const typeKerned = async (el: HTMLElement, word: string, kern: number[]) => {
    for (let i = 1; i <= word.length; i++) {
      el.innerHTML = kernedHTML(word, kern, i);
      await wait(typeDelay(word[i - 1], i - 1, word.length));
    }
  };

  const typePlain = async (el: HTMLElement, word: string) => {
    let text = "";
    for (let i = 0; i < word.length; i++) {
      text += word[i];
      el.textContent = text;
      await wait(typeDelay(word[i], i, word.length));
    }
  };

  const erase = async (el: HTMLElement) => {
    let text = el.textContent || "";
    const total = text.length;
    while (text.length > 0) {
      text = text.slice(0, -1);
      el.textContent = text.length > 0 ? text : "\u200B";
      await wait(eraseDelay(text.length, total));
    }
  };

  const setNameState = (state: "alias" | "real") => {
    heroName.classList.remove("hero-name--alias", "hero-name--real");
    heroName.classList.add(`hero-name--${state}`);
  };

  // Initial state
  setNameState("alias");
  firstEl.innerHTML = kernedHTML("dot", kernMap.alias.first, 3);
  lastEl.innerHTML = kernedHTML("MavriQ", kernMap.alias.last, 6);

  // Main loop
  const loop = async () => {
    while (true) {
      await wait(10000);

      await erase(lastEl);
      await wait(humanDelay(250, 100));
      await erase(firstEl);

      await wait(humanDelay(500, 200));

      setNameState("real");
      await typePlain(firstEl, "Jonatan");
      await wait(humanDelay(350, 120));
      await typePlain(lastEl, "Jansson");

      await wait(10000);

      await erase(lastEl);
      await wait(humanDelay(250, 100));
      await erase(firstEl);

      await wait(humanDelay(500, 200));

      setNameState("alias");
      await typeKerned(firstEl, "dot", kernMap.alias.first);
      await wait(humanDelay(350, 120));
      await typeKerned(lastEl, "MavriQ", kernMap.alias.last);
    }
  };

  setTimeout(loop, 3000);
}
