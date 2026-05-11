// ── Social feed: live Pleroma timeline rendered client-side ──
// Fetches https://social.dotmavriq.life/api/v1/timelines/public, renders posts,
// wires up a fullscreen lightbox and a remote-follow modal.

const SOCIAL_BASE = "https://social.dotmavriq.life";
const PROFILE_URI = `${SOCIAL_BASE}/users/dotmavriq`;
const API = `${SOCIAL_BASE}/api/v1/timelines/public`;
const LIMIT = 20;

interface MediaAttachment {
  type: string;
  url: string;
  preview_url?: string;
  description?: string;
}

interface Post {
  id: string;
  url?: string;
  uri?: string;
  created_at: string;
  content: string;
  sensitive?: boolean;
  spoiler_text?: string;
  in_reply_to_id?: string | null;
  reblog?: Post | null;
  account: {
    avatar: string;
    display_name?: string;
    acct: string;
  };
  media_attachments?: MediaAttachment[];
}

interface GalleryItem {
  full: string;
  preview: string;
  alt: string;
  postIndex: number;
  sensitive: boolean;
  spoiler: string;
}

let prevAbort: AbortController | null = null;

export function initSocialFeed() {
  prevAbort?.abort();
  prevAbort = new AbortController();
  const { signal } = prevAbort;

  const feedEl = document.getElementById("social-feed");
  if (!feedEl) return;

  const loadMoreEl = document.getElementById("social-load-more");
  const loadMoreBtn = document.getElementById("social-load-more-btn") as HTMLButtonElement | null;

  let maxId: string | null = null;
  let loading = false;
  let postCount = 0;
  const galleryImages: GalleryItem[] = [];

  function formatDate(iso: string): string {
    const d = new Date(iso);
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function escAttr(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderPost(post: Post): HTMLElement {
    const article = document.createElement("article");
    article.className = "social-post";
    const thisPost = postCount++;

    const date = formatDate(post.created_at);

    let mediaHtml = "";
    if (post.media_attachments && post.media_attachments.length > 0) {
      const count = Math.min(post.media_attachments.length, 4);
      const gridClass = `media-${count}`;
      const isSensitive = !!post.sensitive;
      const spoiler = (post.spoiler_text || "").trim();
      const cwLabel = spoiler ? escAttr(spoiler) : "sensitive content";
      const wrapCW = (inner: string) => isSensitive
        ? `<div class="social-post-media-item social-post-media-item--cw">${inner}` +
          `<button class="social-cw" type="button" aria-label="Reveal ${cwLabel}">` +
            `<span class="social-cw__inner">` +
              `<span class="social-cw__title">// ${cwLabel}</span>` +
              `<span class="social-cw__hint">click to reveal</span>` +
            `</span>` +
          `</button></div>`
        : inner;

      const items = post.media_attachments.slice(0, 4).map((m) => {
        const desc = m.description || "";
        const descAttr = desc ? escAttr(desc) : "attached image";
        if (m.type === "video" || m.type === "gifv") {
          return wrapCW(
            `<video src="${escAttr(m.url)}" controls muted playsinline${desc ? ` title="${escAttr(desc)}"` : ""}></video>`
          );
        }
        const gIdx = galleryImages.length;
        galleryImages.push({
          full: m.url,
          preview: m.preview_url || m.url,
          alt: desc,
          postIndex: thisPost,
          sensitive: isSensitive,
          spoiler,
        });
        return wrapCW(
          `<img src="${escAttr(m.preview_url || m.url)}" alt="${descAttr}" loading="lazy" data-gallery="${gIdx}">`
        );
      }).join("");
      mediaHtml = `<div class="social-post-media ${gridClass}">${items}</div>`;
    }

    article.innerHTML =
      `<button type="button" class="social-post-header" data-profile-trigger ` +
        `aria-label="Open profile for ${escAttr(post.account.display_name || post.account.acct)}">` +
        `<img class="social-post-avatar" src="${escAttr(post.account.avatar)}" alt="">` +
        `<div class="social-post-meta">` +
          `<span class="social-post-author">${escAttr(post.account.display_name || post.account.acct)}</span>` +
          `<span class="social-post-date">${date}</span>` +
        `</div>` +
      `</button>` +
      `<div class="social-post-content">${post.content}</div>` +
      mediaHtml;

    return article;
  }

  function loadPosts() {
    if (loading) return;
    loading = true;
    if (loadMoreBtn) loadMoreBtn.disabled = true;

    let url = `${API}?local=true&limit=${LIMIT}`;
    if (maxId) url += `&max_id=${maxId}`;

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json() as Promise<Post[]>;
      })
      .then((posts) => {
        const filtered = posts.filter((p) => {
          if (p.reblog) return false;
          if (p.in_reply_to_id) return false;
          const txt = p.content.replace(/^<p>/, "").trimStart();
          if (txt.match(/^<span class="h-card">/)) return false;
          return true;
        });

        if (posts.length === 0) {
          if (!maxId) feedEl!.innerHTML = '<div class="social-empty">no posts yet.</div>';
          if (loadMoreEl) loadMoreEl.style.display = "none";
          loading = false;
          return;
        }

        if (!maxId) feedEl!.innerHTML = "";

        filtered.forEach((post) => {
          feedEl!.appendChild(renderPost(post));
        });

        maxId = posts[posts.length - 1].id;

        if (loadMoreEl) loadMoreEl.style.display = posts.length >= LIMIT ? "block" : "none";

        if (filtered.length === 0 && posts.length >= LIMIT) {
          loading = false;
          return loadPosts();
        }

        loading = false;
        if (loadMoreBtn) loadMoreBtn.disabled = false;
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        if (!maxId) feedEl!.innerHTML = '<div class="social-empty">could not load posts.</div>';
        // eslint-disable-next-line no-console
        console.error(err);
        loading = false;
        if (loadMoreBtn) loadMoreBtn.disabled = false;
      });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadPosts, { signal });
  }

  loadPosts();

  // ── Follow modal ──
  initFollow(signal);

  // ── Profile card (in-page replacement for direct links to social.dotmavriq.life) ──
  initProfileCard(signal);

  // ── Tag panel (in-page hashtag results, sliding from the left) ──
  initTagPanel(signal, renderPost);

  // ── Lightbox ──
  initLightbox(galleryImages, signal);
}

function initFollow(signal: AbortSignal) {
  const btn = document.getElementById("social-follow-btn");
  const overlay = document.getElementById("social-follow-overlay");
  const closeBtn = document.getElementById("social-follow-close");
  const input = document.getElementById("social-follow-handle") as HTMLInputElement | null;
  const submit = document.getElementById("social-follow-submit") as HTMLButtonElement | null;
  const errorEl = document.getElementById("social-follow-error");

  if (!btn || !overlay || !input || !submit || !errorEl || !closeBtn) return;

  const open = () => {
    overlay.classList.add("open");
    input.value = "";
    errorEl.style.display = "none";
    setTimeout(() => input.focus(), 50);
  };
  const close = () => overlay.classList.remove("open");
  const showError = (msg: string) => {
    errorEl.textContent = msg;
    errorEl.style.display = "block";
  };

  const doFollow = () => {
    const handle = (input.value || "").trim();
    if (!handle) {
      showError("enter your fediverse handle");
      return;
    }
    const match = handle.match(/^@?([^@]+)@([^@/]+)$/);
    if (!match) {
      showError("format: user@instance.tld");
      return;
    }
    const instance = match[2];
    errorEl.style.display = "none";
    // Skip WebFinger preflight (avoids broad CSP connect-src). Go straight to
    // authorize_interaction — supported by Mastodon 3.x+, Pleroma, Akkoma, Misskey.
    window.location.href =
      `https://${instance}/authorize_interaction?uri=${encodeURIComponent(PROFILE_URI)}`;
  };

  btn.addEventListener("click", open, { signal });
  closeBtn.addEventListener("click", close, { signal });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  }, { signal });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  }, { signal });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doFollow();
  }, { signal });
  submit.addEventListener("click", doFollow, { signal });
}

// ── Profile card ──
// Replaces direct outbound links from post meta (avatar / display name / date)
// with an in-page card showing the author's full Pleroma account info. The
// card has a single, deliberate outbound link (top-right arrow) for users who
// want to view the live profile on social.dotmavriq.life.

interface AccountField {
  name: string;
  value: string;
}

interface AccountInfo {
  display_name?: string;
  username: string;
  acct: string;
  avatar: string;
  header?: string;
  note?: string;
  url?: string;
  created_at?: string;
  fields?: AccountField[];
  followers_count?: number;
  following_count?: number;
  statuses_count?: number;
}

let cachedAccount: AccountInfo | null = null;
let pendingAccount: Promise<AccountInfo | null> | null = null;

function fetchAccount(signal: AbortSignal): Promise<AccountInfo | null> {
  if (cachedAccount) return Promise.resolve(cachedAccount);
  if (pendingAccount) return pendingAccount;
  pendingAccount = fetch(
    `${SOCIAL_BASE}/api/v1/accounts/lookup?acct=dotmavriq`,
    { signal }
  )
    .then((res) => (res.ok ? res.json() as Promise<AccountInfo> : null))
    .then((acc) => {
      if (acc) cachedAccount = acc;
      pendingAccount = null;
      return acc;
    })
    .catch(() => {
      pendingAccount = null;
      return null;
    });
  return pendingAccount;
}

function formatJoined(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatCount(n: number | undefined): string {
  if (n == null) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

function initProfileCard(signal: AbortSignal) {
  const overlay = document.getElementById("social-profile-overlay");
  const closeBtn = document.getElementById("social-profile-close");
  const feed = document.getElementById("social-feed");
  if (!overlay || !closeBtn || !feed) return;

  const avatarEl = document.getElementById("social-profile-avatar") as HTMLImageElement | null;
  const nameEl = document.getElementById("social-profile-name");
  const handleEl = document.getElementById("social-profile-handle");
  const bioEl = document.getElementById("social-profile-bio");
  const fieldsEl = document.getElementById("social-profile-fields");
  const statsPostsEl = document.getElementById("social-profile-stat-posts");
  const statsFollowingEl = document.getElementById("social-profile-stat-following");
  const statsFollowersEl = document.getElementById("social-profile-stat-followers");
  const joinedEl = document.getElementById("social-profile-joined");

  const close = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  const populate = (acc: AccountInfo) => {
    if (avatarEl) {
      avatarEl.src = acc.avatar;
      avatarEl.alt = "";
    }
    if (nameEl) nameEl.textContent = acc.display_name || acc.username;

    // Render "@user@host" — derive host from acct or url since the local API
    // returns acct without the host for local accounts.
    let handle = acc.acct;
    if (!handle.includes("@")) {
      try {
        const host = acc.url ? new URL(acc.url).host : new URL(SOCIAL_BASE).host;
        handle = `${acc.acct}@${host}`;
      } catch { /* keep raw acct */ }
    }
    if (handleEl) handleEl.textContent = `@${handle}`;

    if (bioEl) bioEl.innerHTML = acc.note || "";

    if (fieldsEl) {
      fieldsEl.innerHTML = "";
      (acc.fields || []).forEach((f) => {
        const row = document.createElement("div");
        row.className = "social-profile-field";
        row.innerHTML =
          `<span class="social-profile-field__name">${f.name}</span>` +
          `<span class="social-profile-field__value">${f.value}</span>`;
        fieldsEl.appendChild(row);
      });
      fieldsEl.style.display = (acc.fields && acc.fields.length) ? "" : "none";
    }

    if (statsPostsEl) statsPostsEl.textContent = formatCount(acc.statuses_count);
    if (statsFollowingEl) statsFollowingEl.textContent = formatCount(acc.following_count);
    if (statsFollowersEl) statsFollowersEl.textContent = formatCount(acc.followers_count);

    if (joinedEl) {
      const joined = formatJoined(acc.created_at);
      joinedEl.textContent = joined ? `joined ${joined}` : "";
    }
  };

  const open = () => {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    fetchAccount(signal).then((acc) => {
      if (acc) populate(acc);
    });
  };

  // Delegate clicks at the document level so post-header triggers in the
  // main feed AND the tag panel both open the card.
  document.addEventListener("click", (e) => {
    const trigger = (e.target as HTMLElement).closest("[data-profile-trigger]");
    if (!trigger) return;
    e.preventDefault();
    open();
  }, { signal });

  closeBtn.addEventListener("click", close, { signal });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  }, { signal });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  }, { signal });
}

// ── Tag panel ──
// Side panel that slides in from the left when a hashtag is clicked, listing
// posts with that tag. Re-uses the main `renderPost` so panel posts share
// styling, the lightbox gallery, and the profile-card trigger. Clicking a
// hashtag in either the feed or the panel itself replaces the panel contents.

function initTagPanel(
  signal: AbortSignal,
  renderPost: (post: Post) => HTMLElement,
) {
  const panel = document.getElementById("social-tag-panel");
  const closeBtn = document.getElementById("social-tag-close");
  const titleEl = document.getElementById("social-tag-title");
  const bodyEl = document.getElementById("social-tag-list");
  if (!panel || !closeBtn || !titleEl || !bodyEl) return;

  let prevAbort: AbortController | null = null;

  const close = () => {
    prevAbort?.abort();
    prevAbort = null;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-tag-panel-open");
  };

  const open = (tag: string) => {
    prevAbort?.abort();
    prevAbort = new AbortController();
    const tagSignal = prevAbort.signal;

    titleEl.textContent = `#${tag}`;
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-tag-panel-open");
    bodyEl.innerHTML = '<div class="social-loading">loading…</div>';
    bodyEl.scrollTop = 0;

    const url =
      `${SOCIAL_BASE}/api/v1/timelines/tag/${encodeURIComponent(tag)}` +
      `?local=true&limit=20`;

    fetch(url, { signal: tagSignal })
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json() as Promise<Post[]>;
      })
      .then((posts) => {
        const filtered = posts.filter((p) => !p.reblog && !p.in_reply_to_id);
        bodyEl.innerHTML = "";
        if (filtered.length === 0) {
          bodyEl.innerHTML = '<div class="social-empty">no posts with this tag.</div>';
          return;
        }
        filtered.forEach((p) => bodyEl.appendChild(renderPost(p)));
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        bodyEl.innerHTML = '<div class="social-empty">could not load.</div>';
      });
  };

  // Document-level delegation: any hashtag link anywhere (feed or panel)
  // intercepts and opens the tag panel instead of leaving the site.
  // We match by href shape rather than rel="tag" because Pleroma's rendered
  // post HTML doesn't always emit rel="tag" on hashtag anchors. Anchors
  // whose href ends with /tag/<name> or /tags/<name> (with optional trailing
  // slash and ignoring query/hash) are treated as hashtag links.
  const TAG_HREF_RE = /\/tags?\/([^/?#]+)\/?(?:[?#].*)?$/i;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    if ((e as MouseEvent).button !== 0 || (e as MouseEvent).metaKey ||
        (e as MouseEvent).ctrlKey || (e as MouseEvent).shiftKey ||
        (e as MouseEvent).altKey) {
      return; // let modified-clicks pass through (open in new tab, etc.)
    }
    const link = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute("href") || "";

    let tag = link.getAttribute("data-tag") || "";
    if (!tag) {
      const m = href.match(TAG_HREF_RE);
      if (m) tag = decodeURIComponent(m[1]);
    }
    if (!tag) return;

    e.preventDefault();
    e.stopPropagation();
    open(tag);
  }, { signal });

  closeBtn.addEventListener("click", close, { signal });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) close();
  }, { signal });
}

function initLightbox(galleryImages: GalleryItem[], signal: AbortSignal) {
  const lightbox = document.getElementById("social-lightbox");
  const lbImg = document.getElementById("social-lb-img") as HTMLImageElement | null;
  const lbAlt = document.getElementById("social-lb-alt");
  const lbCounter = document.getElementById("social-lb-counter");
  const lbClose = document.getElementById("social-lb-close");
  const lbPrev = document.getElementById("social-lb-prev") as HTMLButtonElement | null;
  const lbNext = document.getElementById("social-lb-next") as HTMLButtonElement | null;
  const lbSkip = document.getElementById("social-lb-skip");
  const lbStage = document.getElementById("social-lb-stage");
  const lbCw = document.getElementById("social-lb-cw");
  const lbCwTitle = document.getElementById("social-lb-cw-title");
  const feed = document.getElementById("social-feed");

  if (!lightbox || !lbImg || !lbAlt || !lbCounter || !lbClose || !lbPrev || !lbNext || !lbSkip || !lbStage || !lbCw || !lbCwTitle || !feed) return;

  let currentIdx = -1;
  let touchStartX = 0;
  let touchStartY = 0;

  const findNextPostStart = (fromIdx: number) => {
    const currentPost = galleryImages[fromIdx].postIndex;
    for (let i = fromIdx + 1; i < galleryImages.length; i++) {
      if (galleryImages[i].postIndex !== currentPost) return i;
    }
    return -1;
  };

  const findPrevPostEnd = (fromIdx: number) => {
    const currentPost = galleryImages[fromIdx].postIndex;
    for (let i = fromIdx - 1; i >= 0; i--) {
      if (galleryImages[i].postIndex !== currentPost) return i;
    }
    return -1;
  };

  const show = (idx: number) => {
    if (idx < 0 || idx >= galleryImages.length) return;
    currentIdx = idx;
    const item = galleryImages[idx];

    lbImg.style.opacity = "0";
    lbImg.src = item.full;
    lbImg.alt = item.alt || "";
    lbImg.onload = () => {
      lbImg.style.opacity = "1";
    };

    if (item.sensitive) {
      lbCwTitle.textContent = `// ${item.spoiler || "sensitive content"}`;
      lightbox.classList.add("is-cw");
    } else {
      lightbox.classList.remove("is-cw");
    }

    lbAlt.textContent = item.alt || "";

    const postIdx = item.postIndex;
    const postImages: number[] = [];
    for (let i = 0; i < galleryImages.length; i++) {
      if (galleryImages[i].postIndex === postIdx) postImages.push(i);
    }
    const posInPost = postImages.indexOf(idx) + 1;
    lbCounter.textContent = `${posInPost} / ${postImages.length}`;

    lbPrev.disabled = idx <= 0;
    lbNext.disabled = idx >= galleryImages.length - 1;

    let skipText = "";
    if (idx >= galleryImages.length - 1 || galleryImages[idx + 1].postIndex !== postIdx) {
      if (findNextPostStart(idx) >= 0) skipText = "shift + → next post";
    }
    if (idx <= 0 || galleryImages[idx - 1].postIndex !== postIdx) {
      if (findPrevPostEnd(idx) >= 0) {
        skipText = skipText ? "shift + ←/→ skip post" : "shift + ← prev post";
      }
    }
    lbSkip.textContent = skipText;

    if (idx + 1 < galleryImages.length) new Image().src = galleryImages[idx + 1].full;
    if (idx - 1 >= 0) new Image().src = galleryImages[idx - 1].full;

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const hide = () => {
    lightbox.classList.remove("open");
    lightbox.classList.remove("is-cw");
    document.body.style.overflow = "";
    currentIdx = -1;
  };
  const prev = () => currentIdx > 0 && show(currentIdx - 1);
  const next = () => currentIdx < galleryImages.length - 1 && show(currentIdx + 1);
  const skipNextPost = () => {
    const target = findNextPostStart(currentIdx);
    if (target >= 0) show(target);
  };
  const skipPrevPost = () => {
    const target = findPrevPostEnd(currentIdx);
    if (target < 0) return;
    const postIdx = galleryImages[target].postIndex;
    for (let i = 0; i <= target; i++) {
      if (galleryImages[i].postIndex === postIdx) {
        show(i);
        return;
      }
    }
    show(target);
  };

  feed.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const cwBtn = target.closest(".social-cw") as HTMLElement | null;
    if (cwBtn) {
      e.preventDefault();
      e.stopPropagation();
      const item = cwBtn.parentElement;
      if (item) item.classList.add("social-post-media-item--revealed");
      return;
    }
    const img = target.closest("img[data-gallery]") as HTMLImageElement | null;
    if (!img) return;
    e.preventDefault();
    const idx = parseInt(img.getAttribute("data-gallery") || "", 10);
    if (!isNaN(idx)) show(idx);
  }, { signal });

  lbCw.addEventListener("click", (e) => {
    e.stopPropagation();
    lightbox.classList.remove("is-cw");
  }, { signal });

  lbClose.addEventListener("click", hide, { signal });
  lbPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  }, { signal });
  lbNext.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  }, { signal });
  lbImg.addEventListener("click", (e) => e.stopPropagation(), { signal });
  lbStage.addEventListener("click", (e) => {
    if (e.target === lbStage) hide();
  }, { signal });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") {
      hide();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (e.shiftKey) skipPrevPost();
      else prev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (e.shiftKey) skipNextPost();
      else next();
    }
  }, { signal });

  lbStage.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true, signal });

  lbStage.addEventListener("touchend", (e) => {
    if (e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) next();
        else prev();
      }
    }
  }, { passive: true, signal });
}
