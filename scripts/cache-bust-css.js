#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = join(process.cwd(), 'dist');
const astroDir = join(distDir, '_astro');
const stamp = new Date().toISOString().replace(/[-:T]/g,'').slice(0,12); // YYYYMMDDHHMM
const cssFiles = readdirSync(astroDir).filter(f => f.endsWith('.css'));
if(cssFiles.length===0){
  console.log('[cache-bust] No CSS files found.');
  process.exit(0);
}
const renameMap = new Map();
for(const f of cssFiles){
  const parts = f.split('.');
  const base = parts.slice(0,-1).join('.');
  const ext = parts.at(-1);
  const busted = `${base}.v${stamp}.${ext}`;
  const origPath = join(astroDir,f);
  const content = readFileSync(origPath,'utf8');
  writeFileSync(join(astroDir,busted), content);
  renameMap.set(f,busted);
  console.log(`[cache-bust] duplicate ${f} -> ${busted}`);
}

// Update all HTML files
function walk(dir){
  for(const entry of readdirSync(dir, { withFileTypes:true })){
    const p = join(dir, entry.name);
    if(entry.isDirectory()) walk(p);
    else if(entry.name.endsWith('.html')){
      let html = readFileSync(p,'utf8');
      let changed=false;
      for(const [orig,newName] of renameMap){
        if(html.includes(orig)){
          html = html.split(orig).join(newName);
          changed=true;
        }
      }
      if(changed){ writeFileSync(p, html); console.log('[cache-bust] patched', p); }
    }
  }
}
walk(distDir);
console.log('[cache-bust] Done.');