/**
 * Email obfuscation — decodes a reversed base64 string on user interaction.
 * Bots see href="#" and a data attribute; JS reveals the real address.
 */
export function initEmailLink(elementId: string): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  const enc = el.getAttribute('data-m') || '';
  const decoded = atob(enc.split('').reverse().join(''));

  // For anchor elements: set href and optionally reveal the address as text
  if (el.tagName === 'A') {
    el.setAttribute('href', 'mailto:' + decoded);
    if (el.dataset.reveal !== undefined) {
      el.textContent = decoded;
    }
    return;
  }

  // For hero page: decode on click
  el.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:' + decoded;
  });
}
