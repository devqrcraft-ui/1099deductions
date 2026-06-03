import { readFileSync, writeFileSync } from 'fs';

const path = 'C:/Users/RUSLAN/Desktop/1099deductions/sitemap.xml';
let xml = readFileSync(path, 'utf8');

const newUrls = [
  'doordash-california-2026',
  'doordash-texas-2026',
  'lyft-texas-2026',
  'doordash-florida-2026',
  'instacart-california-2026',
  'doordash-new-york-2026',
  'uber-texas-2026',
  'instacart-texas-2026',
  'lyft-florida-2026',
  'walmart-spark-2026',
].map(slug =>
  `<url><loc>https://www.1099deductions.com/deductions/${slug}</loc><lastmod>2026-06-04</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
).join('\n');

xml = xml.replace('</urlset>', newUrls + '\n</urlset>');
writeFileSync(path, xml, 'utf8');
const count = (xml.match(/<loc>/g) || []).length;
console.log('OK: sitemap updated. Total URLs:', count);
