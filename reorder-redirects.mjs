import { readFileSync, writeFileSync } from 'fs';

const lines = readFileSync('_redirects', 'utf8').trim().split('\n');

const wildcard = lines.filter(l => l.startsWith('/deductions/*'));
const other = lines.filter(l => l.startsWith('/privacy') || l.startsWith('/terms'));
const specific = lines.filter(l => l.startsWith('/deductions/') && l.endsWith(' 301'));

const reordered = [...specific, ...wildcard, ...other];
writeFileSync('_redirects', reordered.join('\n') + '\n');
console.log('Специфічних:', specific.length, '| wildcard:', wildcard.length, '| privacy/terms:', other.length, '| разом:', reordered.length);
