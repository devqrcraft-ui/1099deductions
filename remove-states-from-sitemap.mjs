import { readFileSync, writeFileSync } from 'fs';

const deadStates = [
  'alabama', 'arizona', 'arkansas', 'colorado', 'connecticut', 'iowa',
  'kansas', 'kentucky', 'maryland', 'minnesota', 'mississippi', 'missouri',
  'nevada', 'oklahoma', 'oregon', 'south-carolina', 'tennessee', 'utah',
  'virginia', 'wisconsin'
];

const lines = readFileSync('sitemap.xml', 'utf8').split('\n');
const kept = lines.filter(line => !deadStates.some(s => line.includes(`/1099-deductions-${s}-2026.html`)));

console.log('Було:', lines.length, '| Стало:', kept.length, '| Видалено:', lines.length - kept.length);
writeFileSync('sitemap.xml', kept.join('\n'));
