import { readFileSync, writeFileSync } from 'fs';
const slugs = readFileSync('deductions_slugs.txt', 'utf8').trim().split('\n').filter(Boolean);
const lines = slugs.map(s => `deductions/${s}.html`);
writeFileSync('deductions_html_candidates.txt', lines.join('\n'));
console.log('OK:', lines.length, 'кандидатів записано');
