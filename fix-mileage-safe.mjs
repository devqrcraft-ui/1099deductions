import { readFileSync, writeFileSync } from 'fs';

const skipList = new Set([
  'blog/best-expense-tracker-apps-1099-2026.html',
  'deductions/amazon-flex-california-2026/index.html',
  'deductions/amazon-flex-texas-2026/index.html',
  'deductions/doordash-california-2026/index.html',
  'deductions/doordash-florida-2026/index.html',
  'deductions/doordash-illinois-2026/index.html',
  'deductions/grubhub-california-2026/index.html',
  'deductions/grubhub-florida-2026/index.html',
  'deductions/grubhub-new-york-2026/index.html',
  'deductions/grubhub-texas-2026/index.html',
  'deductions/instacart-florida-2026/index.html',
  'deductions/instacart-new-york-2026/index.html',
  'deductions/lyft-california-2026/index.html',
  'deductions/lyft-new-york-2026/index.html',
  'deductions/lyft-texas-2026/index.html',
  'deductions/qbi-deduction-2026/index.html',
  'deductions/shipt-2026/index.html',
  'deductions/standard-mileage-vs-actual-expenses-2026/index.html',
  'deductions/tips-deduction-2026/index.html',
  'deductions/uber-driver-2026/index.html',
  'deductions/uber-florida-2026/index.html',
  'deductions/uber-illinois-2026/index.html',
  'deductions/uber-texas-2026/index.html',
  'doordash-tax-deductions-2026.html',
  'instacart-tax-deductions-2026.html'
]);

const files = readFileSync('mileage_files.txt', 'utf8').trim().split('\n')
  .map(f => f.replace(/^\.\//, ''))
  .filter(f => !skipList.has(f));

console.log('Файлів для обробки:', files.length);

let changed = 0;
const longDescriptions = [];

for (const f of files) {
  let html = readFileSync(f, 'utf8');
  const before = html;

  // Короткий варіант всередині будь-яких meta/title/og тегів (одним рядком)
  html = html.replace(/(<title>[^<]*?)\$0\.725\/mile([^<]*?<\/title>)/g, '$1 72.5¢–76¢/mile $2');
  html = html.replace(/(<meta[^>]*content="[^"]*?)\$0\.725\/mile([^"]*?")/g, '$1 72.5¢–76¢/mile $2');
  html = html.replace(/("headline":"[^"]*?)\$0\.725\/mile([^"]*?")/g, '$1 72.5¢–76¢/mile $2');
  html = html.replace(/("description":"[^"]*?)\$0\.725\/mile([^"]*?")/g, '$1 72.5¢–76¢/mile $2');

  // Повна фраза у видимому тексті (усе, що лишилось за межами тегів вище)
  html = html.replace(/\$0\.725\/mile/g, '72.5¢/mile (Jan–Jun) or 76¢/mile (Jul–Dec)');

  if (html !== before) {
    writeFileSync(f, html);
    changed++;
  }

  // Перевірити довжину description після заміни
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (descMatch && descMatch[1].length > 155) {
    longDescriptions.push(`${f}: ${descMatch[1].length} символів`);
  }
}

console.log('Файлів змінено:', changed);
console.log('Description > 155 символів після заміни:', longDescriptions.length);
longDescriptions.slice(0, 10).forEach(l => console.log(' -', l));
