import fs from 'fs';
import path from 'path';

const ROOT = 'C:/Users/RUSLAN/Desktop/1099deductions';
const NEW_TEXT = 'Writes about 1099 tax deductions, self-employment tax, and IRS rules for independent contractors and freelancers.';

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

// Варіант 1 — точний рядок (вже виправлено першим скриптом)
// Варіант 2 — <p> блок з "Tax compliance specialist since 2017. Helped 5,000+..."
// Варіант 3 — <p> блок з "Helped 5,000+ freelancers navigate IRS rules. Specializes..."

const START = 'Helped 5,000+';
const TAG_START = '<p ';
const TAG_END = '</p>';

let fixed = 0;

for (const f of files) {
  let txt = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  const before = txt;

  // Варіант 3: простий <p> без Tax compliance prefix
  const SIMPLE = "Helped 5,000+ freelancers navigate IRS rules. Specializes in gig economy and 1099 taxation.";
  if (txt.includes(SIMPLE)) {
    txt = txt.split(SIMPLE).join(NEW_TEXT);
  }

  // Варіант 2: "Tax compliance specialist since 2017. Helped 5,000+..." до </p>
  while (txt.includes('Tax compliance specialist since 2017. Helped 5,000+')) {
    const marker = 'Tax compliance specialist since 2017. Helped 5,000+';
    const markerIdx = txt.indexOf(marker);
    const pTagIdx = txt.lastIndexOf(TAG_START, markerIdx);
    const endIdx = txt.indexOf(TAG_END, markerIdx);
    if (pTagIdx === -1 || endIdx === -1) break;
    const pTagEnd = txt.indexOf('>', pTagIdx) + 1;
    const pOpenTag = txt.substring(pTagIdx, pTagEnd);
    txt = txt.substring(0, pTagIdx) + pOpenTag + NEW_TEXT + TAG_END + txt.substring(endIdx + TAG_END.length);
  }

  if (txt !== before) {
    fs.writeFileSync(f, txt, 'utf8');
    fixed++;
  }
}

console.log('Файлів виправлено:', fixed);

// Фінальна перевірка
let remaining = 0;
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  if (txt.includes('Helped 5,000')) {
    remaining++;
    console.log('ЗАЛИШИВСЯ:', f.replace(ROOT, ''));
  }
}
console.log('\n"Helped 5,000" залишилось:', remaining, remaining === 0 ? '✓ ЧИСТО' : '!!! ПЕРЕВІРТЕ');
if (remaining === 0) {
  console.log('\nГотово. Запустіть:');
  console.log('git add -A && git commit -m "fix: remove fabricated author stats (all variants)" && git push');
}
