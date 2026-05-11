import { test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('measure CV print page count', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'page.pdf() requires Chromium');

  await page.goto('/cv', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  const dir = mkdtempSync(join(tmpdir(), 'cv-pages-'));
  const pdfPath = join(dir, 'cv.pdf');
  const txtPath = join(dir, 'cv.txt');

  try {
    const buf = await page.pdf({ format: 'A4', printBackground: true });
    writeFileSync(pdfPath, buf);

    const info = execFileSync('pdfinfo', [pdfPath]).toString();
    execFileSync('pdftotext', ['-layout', pdfPath, txtPath]);
    const text = readFileSync(txtPath, 'utf8');
    writeFileSync('/tmp/cv-current.txt', text);
    writeFileSync('/tmp/cv-pages-info.txt', info + `\nTEXT_BYTES: ${text.length}\nLINES: ${text.split('\n').length}\n`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
