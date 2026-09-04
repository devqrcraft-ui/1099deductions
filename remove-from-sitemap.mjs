import { readFileSync, writeFileSync } from 'fs';
const deadSlugs = [
  'ai-trainer', 'automation-expert', 'crypto-specialist', 'digital-nomad-advisor',
  'drone-pilot', 'metaverse-architect', 'nft-artist', 'prompt-engineer',
  'remote-coach', 'vr-developer'
];
const raw = readFileSync('sitemap.xml', 'utf8');
const blocks = raw.split(/(?=<url>)/);
const kept = blocks.filter(b => !deadSlugs.some(slug => b.includes(`/${slug}-tax-deductions-2026.html`)));
console.log('Було блоків:', blocks.length, '| Стало:', kept.length, '| Видалено:', blocks.length - kept.length);
writeFileSync('sitemap.xml', kept.join(''));
