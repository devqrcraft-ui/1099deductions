import { readFileSync } from 'fs';

const urls = ['https://www.1099deductions.com/obbba-tax-changes-2026'];

const key = readFileSync('80f1e7fa645c610a38eacf080a58b661.txt', 'utf8').trim().split('\n')[0] || '80f1e7fa645c610a38eacf080a58b661';

const payload = {
  host: 'www.1099deductions.com',
  key: '80f1e7fa645c610a38eacf080a58b661',
  keyLocation: 'https://www.1099deductions.com/80f1e7fa645c610a38eacf080a58b661.txt',
  urlList: urls
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});

console.log('HTTP статус:', res.status);
console.log('Відповідь:', await res.text());
console.log('URL:', urls);
