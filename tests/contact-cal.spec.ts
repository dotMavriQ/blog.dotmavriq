import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    __calCalls: string[];
  }
}

const calEmbedMock = `
(() => {
  window.__calCalls = [];

  class CalModalBox extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;

      this.setAttribute('state', 'loaded');
      this.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
      this.appendChild(document.createElement('iframe'));

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = \`
        <style>
          .my-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); }
          .modal-box { position: fixed; inset: 20% 25%; background: white; }
          .close { position: fixed; top: 16px; right: 16px; }
        </style>
        <div class="my-backdrop">
          <button class="close" type="button" aria-label="Close">x</button>
          <div class="modal-box"><iframe title="Book a call"></iframe></div>
        </div>
      \`;

      root.querySelector('.close').addEventListener('click', () => window.Cal('closeModal'));
    }
  }

  customElements.define('cal-modal-box', CalModalBox);

  function openModal() {
    let modal = document.querySelector('cal-modal-box');
    if (!modal) {
      modal = document.createElement('cal-modal-box');
      document.body.appendChild(modal);
    }
    modal.setAttribute('state', 'loaded');
    modal.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.querySelectorAll('cal-modal-box').forEach((modal) => {
      modal.setAttribute('state', 'closed');
      modal.style.visibility = 'hidden';
    });
    document.body.style.overflow = '';
  }

  window.Cal = function Cal(command) {
    window.__calCalls.push(command);
    if (command === 'modal') openModal();
    if (command === 'closeModal') closeModal();
  };
  window.Cal.loaded = true;
  window.Cal.ns = {};
  window.Cal.q = [];
})();
`;

test.describe('Contact booking modal', () => {
  test('backdrop and close button both use the Cal modal close path', async ({ page }) => {
    await page.goto('/contact');
    await page.evaluate(calEmbedMock);

    expect(await page.evaluate(() => typeof window.Cal)).toBe('function');
    await page.click('#cal-btn');
    expect(await page.evaluate(() => window.__calCalls)).toContain('modal');
    await expect(page.locator('cal-modal-box')).toHaveCount(1);
    await expect(page.locator('cal-modal-box')).toHaveAttribute('state', 'loaded');
    await expect
      .poll(() => page.locator('body').evaluate((body) => (body as HTMLElement).style.overflow))
      .toBe('hidden');

    await page.locator('cal-modal-box').evaluate((modal) => {
      modal.shadowRoot
        ?.querySelector('.my-backdrop')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    });
    await expect(page.locator('cal-modal-box')).toHaveAttribute('state', 'closed');
    await expect(page.locator('cal-modal-box')).toHaveCSS('visibility', 'hidden');
    await expect
      .poll(() => page.locator('body').evaluate((body) => (body as HTMLElement).style.overflow))
      .not.toBe('hidden');

    await page.click('#cal-btn');
    await expect(page.locator('cal-modal-box')).toHaveCount(1);
    await expect(page.locator('cal-modal-box')).toHaveAttribute('state', 'loaded');

    await page.locator('cal-modal-box').evaluate((modal) => {
      modal.shadowRoot?.querySelector<HTMLButtonElement>('.close')?.click();
    });
    await expect(page.locator('cal-modal-box')).toHaveAttribute('state', 'closed');
    await expect
      .poll(() => page.locator('body').evaluate((body) => (body as HTMLElement).style.overflow))
      .not.toBe('hidden');
  });
});
