import { readFileSync, writeFileSync } from 'fs';

const raw = readFileSync('sitemap.xml', 'utf8');
const blocks = raw.split(/(?=<url>)/); // ріжемо по кожному <url>, зберігаючи преамбулу окремо

const kept = blocks.filter(b => {
  if (!b.trim().startsWith('<url>')) return true; // преамбула (<?xml...?><urlset...>)
  return b.includes('<loc>'); // лишаємо тільки блоки з реальним loc
});

const removed = blocks.length - kept.length;
writeFileSync('sitemap.xml', kept.join(''));
console.log('Було url-блоків:', blocks.filter(b=>b.trim().startsWith('<url>')).length);
console.log('Видалено порожніх:', removed);
