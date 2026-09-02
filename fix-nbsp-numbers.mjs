import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const files = execSync(`grep -rlP '\\$\\d{1,3}\\u00a0\\d{3}' . --include="*.html"`, { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

console.log('Файлів знайдено:', files.length);

let totalReplacements = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const updated = html.replace(/\$(\d{1,3})\u00a0(\d{3})/g, '$$$1,$2');
  const count = (html.match(/\$(\d{1,3})\u00a0(\d{3})/g) || []).length;
  if (count > 0) {
    writeFileSync(f, updated);
    totalReplacements += count;
  }
}
console.log('Разом замін:', totalReplacements);
