import { readFileSync, writeFileSync } from 'fs';

const files = [
  'ai-trainer-tax-deductions-2026.html',
  'automation-expert-tax-deductions-2026.html',
  'crypto-specialist-tax-deductions-2026.html',
  'digital-nomad-advisor-tax-deductions-2026.html',
  'drone-pilot-tax-deductions-2026.html',
  'metaverse-architect-tax-deductions-2026.html',
  'nft-artist-tax-deductions-2026.html',
  'prompt-engineer-tax-deductions-2026.html',
  'remote-coach-tax-deductions-2026.html',
  'vr-developer-tax-deductions-2026.html'
];

for (const f of files) {
  let html = readFileSync(f, 'utf8');
  if (html.includes('name="robots"')) {
    console.log(f, '— вже має robots-тег, пропускаю');
    continue;
  }
  const updated = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n    <meta name="robots" content="noindex, follow">');
  if (updated === html) {
    console.log(f, '— ПОМИЛКА: charset-рядок не знайдено, нічого не змінено');
  } else {
    writeFileSync(f, updated);
    console.log(f, '— noindex додано');
  }
}
