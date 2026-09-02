import { readFileSync, writeFileSync } from 'fs';

const deadSlugs = [
  'ai-trainer', 'automation-expert', 'crypto-specialist', 'digital-nomad-advisor',
  'drone-pilot', 'metaverse-architect', 'nft-artist', 'prompt-engineer',
  'remote-coach', 'vr-developer'
];

const lines = readFileSync('sitemap.xml', 'utf8').split('\n');
const kept = lines.filter(line => !deadSlugs.some(slug => line.includes(`/${slug}-tax-deductions-2026.html`)));

console.log('Було рядків:', lines.length, '| Стало:', kept.length, '| Видалено:', lines.length - kept.length);
writeFileSync('sitemap.xml', kept.join('\n'));
