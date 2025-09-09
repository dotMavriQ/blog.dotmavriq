#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PAGES = ['/', '/blog/'];
const LIVE = 'https://blog.dotmavriq.life';

function fetch(url){
  return execSync(`curl -fsSL ${url}`, { encoding:'utf8' });
}

function normalize(html){
  return html
    .replace(/\s+/g,' ') // collapse whitespace
    .replace(/data-astro-cid-[a-z0-9]+/g,'')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'') // remove inlined styles (dev/prod variance)
    .replace(/\b[A-Za-z0-9_-]{6,}\.css/g,'')
    .trim();
}

let exit = 0;
for (const route of PAGES){
  const builtPath = route === '/' ? 'dist/index.html' : `dist${route}index.html`;
  if(!existsSync(builtPath)) { console.log(`[PARITY] SKIP missing ${builtPath}`); continue; }
  const built = readFileSync(builtPath,'utf8');
  const live = fetch(`${LIVE}${route}`);
  const nBuilt = normalize(built);
  const nLive = normalize(live);
  const headBuilt = nBuilt.slice(0,400);
  const headLive = nLive.slice(0,400);
  const similar = headBuilt.replace(/[0-9]/g,'') === headLive.replace(/[0-9]/g,'');
  if(!similar){
    exit = 1;
    const diffFile = join(tmpdir(), `parity${route.replace(/\//g,'_')||'root'}.diff.txt`);
    writeFileSync(diffFile, `BUILT_HEAD:\n${headBuilt}\n---\nLIVE_HEAD:\n${headLive}\n`);
    console.log(`[PARITY] MISMATCH ${route} -> ${diffFile}`);
  } else {
    console.log(`[PARITY] OK ${route}`);
  }
}
process.exit(exit);