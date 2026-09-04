import { readFileSync, writeFileSync } from 'fs';
const deadStates = [
  'alabama', 'arizona', 'arkansas', 'colorado', 'connecticut', 'iowa',
  'kansas', 'kentucky', 'maryland', 'minnesota', 'mississippi', 'missouri',
  'nevada', 'oklahoma', 'oregon', 'south-carolina', 'tennessee', 'utah',
  'virginia', 'wisconsin'
];
const raw = readFileSync('sitemap.xml', 'utf8');
const blocks = raw.split(/(?=<url>)/);
const kept = blocks.filter(b => !deadStates.some(s => b.includes(`/1099-deductions-${s}-2026.html`)));
console.log('Було:', blocks.length, '| Стало:', kept.length, '| Видалено:', blocks.length - kept.length);
writeFileSync('sitemap.xml', kept.join(''));
