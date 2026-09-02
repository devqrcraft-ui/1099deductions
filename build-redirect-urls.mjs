import { readFileSync, writeFileSync } from 'fs';

const lines = readFileSync('_redirects', 'utf8').trim().split('\n');
const urls = lines
  .filter(l => l.startsWith('/deductions/') && l.endsWith(' 301'))
  .map(l => `https://www.1099deductions.com${l.split(' ')[0]}`);

writeFileSync('redirect_urls.txt', urls.join('\n'));
console.log('OK:', urls.length, 'URL зібрано');
