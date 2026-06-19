import fs from 'fs';
import path from 'path';

const ROOT = 'C:/Users/RUSLAN/Desktop/1099deductions';

const OLD = 'Helped 5,000+ freelancers and 1099/self-employed workers navigate tax compliance since 2017.';
const NEW = 'Writes about 1099 tax deductions, self-employment tax, and IRS rules for independent contractors and freelancers.';

// Знаходимо всі HTML файли рекурсивно
function findHtml(dir, results = []) {
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { findHtml(full, results); continue; }
    if (f.endsWith('.html')) results.push(full);
  }
  return results;
}

const files = findHtml(ROOT);
console.log('HTML файлів знайдено:', files.length);

let fixed = 0;
for (const f of files) {
  let txt = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  if (txt.includes(OLD)) {
    txt = txt.split(OLD).join(NEW);
    fs.writeFileSync(f, txt, 'utf8');
    fixed++;
  }
}
console.log('Файлів виправлено:', fixed);

// Фінальна перевірка
let remaining = 0;
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  if (txt.includes('Helped 5,000')) { remaining++; }
}
console.log('"Helped 5,000" залишилось:', remaining, remaining === 0 ? '✓ ЧИСТО' : '!!! ПЕРЕВІРТЕ');
if (remaining === 0) {
  console.log('\nГотово. Запустіть:');
  console.log('git add -A && git commit -m "fix: remove fabricated author stats" && git push');
}
