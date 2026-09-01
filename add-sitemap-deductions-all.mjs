import { readFileSync, writeFileSync } from 'fs';
const path = 'C:/Users/RUSLAN/Desktop/1099deductions/sitemap.xml';
let xml = readFileSync(path, 'utf8');
const slugs = readFileSync('deductions_slugs.txt', 'utf8').trim().split('\n');
const newUrls = slugs.map(slug =>
  `<url><loc>https://www.1099deductions.com/deductions/${slug}/</loc><lastmod>2026-09-01</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
).join('\n');
xml = xml.replace('</urlset>', newUrls + '\n</urlset>');
writeFileSync(path, xml, 'utf8');
const count = (xml.match(/<loc>/g) || []).length;
console.log('OK: sitemap updated. Total URLs:', count);
