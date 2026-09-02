import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (entry.endsWith('.html')) files.push(full);
  }
  return files;
}

const files = walk('.');
const pattern = /\$(\d{1,3})\u00a0(\d{3})/g;

let filesChanged = 0;
let totalReplacements = 0;

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const matches = html.match(pattern);
  if (matches) {
    const updated = html.replace(pattern, (_, a, b) => `$${a},${b}`);
    writeFileSync(f, updated);
    filesChanged++;
    totalReplacements += matches.length;
  }
}

console.log('Файлів перевірено:', files.length);
console.log('Файлів змінено:', filesChanged);
console.log('Разом замін:', totalReplacements);
