import { readFileSync, writeFileSync } from 'fs';

const files = [
  '1099-deductions-alabama-2026.html', '1099-deductions-arizona-2026.html',
  '1099-deductions-arkansas-2026.html', '1099-deductions-colorado-2026.html',
  '1099-deductions-connecticut-2026.html', '1099-deductions-iowa-2026.html',
  '1099-deductions-kansas-2026.html', '1099-deductions-kentucky-2026.html',
  '1099-deductions-maryland-2026.html', '1099-deductions-minnesota-2026.html',
  '1099-deductions-mississippi-2026.html', '1099-deductions-missouri-2026.html',
  '1099-deductions-nevada-2026.html', '1099-deductions-oklahoma-2026.html',
  '1099-deductions-oregon-2026.html', '1099-deductions-south-carolina-2026.html',
  '1099-deductions-tennessee-2026.html', '1099-deductions-utah-2026.html',
  '1099-deductions-virginia-2026.html', '1099-deductions-wisconsin-2026.html'
];

for (const f of files) {
  let html = readFileSync(f, 'utf8');
  if (html.includes('name="robots"')) {
    console.log(f, '— вже має robots-тег, пропускаю');
    continue;
  }
  if (!html.includes('<head>')) {
    console.log(f, '— ПОМИЛКА: <head> не знайдено');
    continue;
  }
  let updated = html.replace('<head>', '<head><meta name="robots" content="noindex, follow">');
  // Заодно прибрати ★ з title і H1, той самий клас косметики
  updated = updated.replace(/★ ✓/g, '').replace(/<title>([^<]*?)\s*<\/title>/, (m, t) => `<title>${t.trim()}</title>`);
  updated = updated.replace(/<h1>★\s*/g, '<h1>');
  writeFileSync(f, updated);
  console.log(f, '— noindex додано, ★ прибрано');
}
