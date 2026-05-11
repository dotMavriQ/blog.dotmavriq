import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('CV print PDF does not contain "// summary"', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'page.pdf() requires Chromium');

  await page.goto('/cv', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  const dir = mkdtempSync(join(tmpdir(), 'cv-pdf-'));
  const pdfPath = join(dir, 'cv.pdf');
  const txtPath = join(dir, 'cv.txt');

  try {
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    writeFileSync(pdfPath, pdfBuffer);

    execFileSync('pdftotext', ['-layout', pdfPath, txtPath]);
    const text = readFileSync(txtPath, 'utf8');

    expect(text, 'PDF must not contain "// summary"').not.toMatch(/\/\/\s*summary/i);
    expect(text, 'PDF must still contain candidate name').toContain('Jonatan Jansson');
    expect(text, 'PDF must still contain summary copy').toContain('Experienced full-stack developer');
    expect(text, 'PDF must still contain the current email address').toContain('jonatan@dotmavriq.life');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
