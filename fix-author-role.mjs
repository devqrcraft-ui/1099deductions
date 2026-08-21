// fix-author-role.mjs
// Run from repo root: node fix-author-role.mjs
//
// Purpose: two things happened that both need fixing in ONE pass, sitewide:
//   1. Commit bfbea9c accidentally pushed "Ethan Blake" -> "1099Deductions.com" as author
//      on ~154 files (swept in by `git add deductions/` picking up unrelated local changes).
//      That needs undoing — bring the NAME back to "Ethan Blake".
//   2. Separately, the owner decided (02.08.2026): keep the name, but change the ROLE from
//      "Tax Compliance Specialist" to "Website Developer" — a non-credential title, since
//      no actual tax professional reviews this content.
//
// This script is IDEMPOTENT and SAFE to run more than once — it only rewrites text that
// matches known old patterns; if a file already has the target text, it's left alone.
// It prints a per-file change count so you can `git diff --stat` and sanity-check before
// committing — do NOT `git add .` blindly again; see the printed git commands at the end.

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'fs';
import { execSync } from 'child_process';

// Find every index.html under deductions/, plus known root-level article pages.
const files = execSync('git ls-files "deductions/*/index.html" "*.html" "blog/*.html"', { encoding: 'utf8' })
  .split('\n').filter(Boolean);

const replacements = [
  // 1) undo the accidental org-name swap in <meta author>
  [/<meta name="author" content="1099Deductions\.com">/g, '<meta name="author" content="Ethan Blake">'],

  // 2) JSON-LD author block: GENERALIZED — catches ANY name (Ethan Blake OR
  //    1099Deductions.com) with ANY jobTitle value ("Tax Compliance Specialist",
  //    "Small Business Tax & Compliance Expert", or anything else) and normalizes
  //    to name=Ethan Blake, jobTitle=Website Developer. This is deliberately broad
  //    because we've now found 3 different role-text variants across the site —
  //    don't assume there isn't a 4th.
  [/"author":\{"@type":"Person","name":"(?:Ethan Blake|1099Deductions\.com)"(?:,"jobTitle":"[^"]*")?[^}]*\}/g,
    '"author":{"@type":"Person","name":"Ethan Blake","jobTitle":"Website Developer"}'],
  [/,"reviewedBy":\{"@type":"Person","name":"Ethan Blake"[^}]*\}/g, ''],

  // 3) visible author box — the deduction-page 2-line variant (name + combined role/org line)
  [/Written by<\/div>\s*<div[^>]*>1099Deductions\.com<\/div>\s*<div[^>]*>Free tax deduction guides for 1099 workers<\/div>/gs,
    'Written by</div>\n      <div style="font-size:15px;font-weight:700;color:#E8F0FA;margin-bottom:2px;">Ethan Blake</div>\n      <div style="font-size:12px;color:#7A96B8;margin-bottom:10px;">Website Developer, 1099Deductions.com</div>'],

  // 4) visible author box — the ORIGINAL "Tax Compliance Specialist" 3-line variant
  [/Written &amp; reviewed by<\/div>\s*<div[^>]*>Ethan Blake<\/div>\s*<div[^>]*>Tax Compliance Specialist<\/div>/gs,
    'Written by</div>\n      <div style="font-size:15px;font-weight:700;color:#E8F0FA;margin-bottom:2px;">Ethan Blake</div>\n      <div style="font-size:12px;color:#7A96B8;margin-bottom:10px;">Website Developer, 1099Deductions.com</div>'],

  // 5) visible author box — the root-article "Small Business Tax & Compliance Expert"
  //    4-line variant (name div, THEN separate role div, THEN separate bio paragraph).
  //    Handles both "Ethan Blake" and the already-swapped "1099Deductions.com" as the name.
  [/(Written(?: &amp; reviewed)? by<\/div>\s*<div[^>]*>)(?:Ethan Blake|1099Deductions\.com)(<\/div>\s*<div[^>]*>)Small Business Tax &amp; Compliance Expert(<\/div>)/gs,
    '$1Ethan Blake$2Website Developer, 1099Deductions.com$3'],

  // 6) catch-all for any remaining bare occurrences of known bad role strings —
  //    lower precision but low collision risk since these are specific multi-word phrases
  [/Tax Compliance Specialist/g, 'Website Developer, 1099Deductions.com'],
  [/Small Business Tax &amp; Compliance Expert/g, 'Website Developer, 1099Deductions.com'],
  [/Small Business Tax & Compliance Expert/g, 'Website Developer, 1099Deductions.com'],
  [/"jobTitle":"Tax Compliance Specialist"/g, '"jobTitle":"Website Developer"'],
  [/"jobTitle":"Small Business Tax & Compliance Expert"/g, '"jobTitle":"Website Developer"'],
];

let totalFiles = 0, totalChanges = 0;
const changedFiles = [];

for (const f of files) {
  let text = readFileSync(f, 'utf8');
  const before = text;
  let fileChanges = 0;
  for (const [pattern, replacement] of replacements) {
    const matches = text.match(pattern);
    if (matches) fileChanges += matches.length;
    text = text.replace(pattern, replacement);
  }
  if (text !== before) {
    writeFileSync(f, text);
    totalFiles++;
    totalChanges += fileChanges;
    changedFiles.push(f);
  }
}

console.log(`\n${totalFiles} files changed, ${totalChanges} replacements total.\n`);

// verification — should be ZERO after this runs
const stillBad = execSync('git ls-files "deductions/*/index.html" "*.html" | xargs grep -l "Tax Compliance Specialist\\|1099Deductions.com</div>\\|reviewedBy" 2>/dev/null || true', { encoding: 'utf8' }).trim();
if (stillBad) {
  console.log('⚠️  These files STILL contain old text — check manually:');
  console.log(stillBad);
} else {
  console.log('✅ No remaining "Tax Compliance Specialist" / reviewedBy / org-as-author text found.');
}

console.log(`
Next steps — review before committing, do NOT blind-add:
  git diff --stat                         # confirm only the expected files changed
  git diff deductions/uber-california/index.html | head -40   # spot-check one file's actual diff
  git add -u                              # stages only already-tracked MODIFIED files (safe here — no untracked new-page mess to accidentally sweep in)
  git commit -m "fix: restore Ethan Blake as author, role Website Developer (not tax specialist)"
  git push
`);
