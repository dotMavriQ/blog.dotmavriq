export const THEME_STORAGE_KEY = "blog-theme";

export type Theme = "light" | "dark";

export function toggleTheme(): Theme {
  const html = document.documentElement;
  const next: Theme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* storage may be unavailable (private mode, etc.) */
  }
  return next;
}
