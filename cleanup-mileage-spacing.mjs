import { readFileSync, writeFileSync } from 'fs';

const files = readFileSync('mileage_files.txt', 'utf8').trim().split('\n')
  .map(f => f.replace(/^\.\//, ''));

let fixed = 0;
for (const f of files) {
  try {
    let html = readFileSync(f, 'utf8');
    const before = html;
    html = html.replace(/  +/g, ' ');           // подвійні пробіли -> один
    html = html.replace(/ ,/g, ',');              // пробіл перед комою
    html = html.replace(/ \./g, '.');             // пробіл перед крапкою
    if (html !== before) {
      writeFileSync(f, html);
      fixed++;
    }
  } catch (e) { /* файл міг не існувати (skip list) */ }
}
console.log('Виправлено пробілів у файлах:', fixed);
