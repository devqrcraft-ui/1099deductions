import { readFileSync, writeFileSync } from 'fs';
const path = 'C:/Users/RUSLAN/Desktop/1099deductions/sitemap.xml';
let xml = readFileSync(path, 'utf8');
const newUrls = [
  'doordash-pennsylvania',
  'uber-pennsylvania',
  'lyft-pennsylvania',
  'instacart-pennsylvania',
  'grubhub-pennsylvania',
  'doordash-massachusetts',
  'uber-massachusetts',
  'lyft-massachusetts',
  'instacart-massachusetts',
  'doordash-north-carolina',
  'uber-north-carolina',
  'lyft-north-carolina',
  'instacart-north-carolina',
  'airbnb-california',
  'airbnb-florida',
  'airbnb-texas',
  'airbnb-new-york',
  'lyft-michigan',
  'grubhub-michigan',
  'instacart-georgia',
].map(slug =>
  `<url><loc>https://www.1099deductions.com/deductions/${slug}/</loc><lastmod>2026-08-03</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
).join('\n');
xml = xml.replace('</urlset>', newUrls + '\n</urlset>');
writeFileSync(path, xml, 'utf8');
const count = (xml.match(/<loc>/g) || []).length;
console.log('OK: sitemap updated. Total URLs:', count);
