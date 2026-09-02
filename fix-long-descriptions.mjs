import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === '.git') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (entry.endsWith('.html')) files.push(full);
  }
  return files;
}

const allFiles = walk('.');
const target = 'workers owe 15.3% SE tax on net earnings';
const files = allFiles.filter(f => readFileSync(f, 'utf8').includes(target));

console.log('Файлів знайдено:', files.length);

let changed = 0;
for (const f of files) {
  let html = readFileSync(f, 'utf8');
  const before = html;

  html = html.replace(
    /Self-employed ([^<]+?) workers owe 15\.3% SE tax on net earnings\. See every 2026 deduction — mileage, equipment, phone, insurance — and calculate your quarterly payments\. Free, instant, no signup\./g,
    '$1 1099 taxes 2026: 15.3% SE tax, mileage, equipment, phone. Free quarterly payment calculator, no signup.'
  );

  if (html !== before) {
    writeFileSync(f, html);
    changed++;
  }
}
console.log('Файлів змінено:', changed);
