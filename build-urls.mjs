import { readFileSync, writeFileSync, existsSync } from 'fs';

const urls = new Set();

// З файлів title/canonical-фіксів
const paths = readFileSync('changed_urls_paths.txt', 'utf8').trim().split('\n').filter(Boolean);
for (const p of paths) {
  if (p.startsWith('deductions/') && p.endsWith('/index.html')) {
    const slug = p.slice('deductions/'.length, -'/index.html'.length);
    urls.add(`https://www.1099deductions.com/deductions/${slug}/`);
  } else if (p.endsWith('.html')) {
    const name = p.slice(0, -'.html'.length);
    urls.add(`https://www.1099deductions.com/${name}`);
  }
}

// З sitemap-додачі /deductions/
if (existsSync('deductions_slugs.txt')) {
  const slugs = readFileSync('deductions_slugs.txt', 'utf8').trim().split('\n').filter(Boolean);
  for (const slug of slugs) {
    urls.add(`https://www.1099deductions.com/deductions/${slug}/`);
  }
}

const list = [...urls];
writeFileSync('changed_urls.txt', list.join('\n'));
console.log('OK:', list.length, 'унікальних URL зібрано');
