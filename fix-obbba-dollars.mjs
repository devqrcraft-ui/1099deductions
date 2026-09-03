import { readFileSync, writeFileSync } from 'fs';

const f = 'obbba-tax-changes-2026.html';
let html = readFileSync(f, 'utf8');
const before = html;

const replacements = [
  ['No Tax on Tips up to \u0005,000, permanent QBI deduction', 'No Tax on Tips up to $25,000, permanent QBI deduction'],
  ['1099-NEC threshold raised to ,000. Complete guide', '1099-NEC threshold raised to $2,000. Complete guide'],
  ['No Tax on Tips up to 5,000, made the QBI deduction permanent, restored 100% bonus depreciation, raised the 1099-NEC reporting threshold to ,000, and raised the SALT deduction cap to 0,000.',
   'No Tax on Tips up to $25,000, made the QBI deduction permanent, restored 100% bonus depreciation, raised the 1099-NEC reporting threshold to $2,000, and raised the SALT deduction cap to $40,000.'],
  ['can deduct up to 5,000 in tips from their federal taxable income. You must be in a qualifying occupation.',
   'can deduct up to $25,000 in tips from their federal taxable income. You must be in a qualifying occupation.'],
  ['The 1099-NEC reporting threshold was raised from 00 to ,000 for 2026. Companies only need to issue a 1099-NEC if they paid you ,000 or more.',
   'The 1099-NEC reporting threshold was raised from $600 to $2,000 for 2026. Companies only need to issue a 1099-NEC if they paid you $2,000 or more.'],
  ['No Tax on Tips — Up to 5,000 Federal Deduction', 'No Tax on Tips — Up to $25,000 Federal Deduction'],
  ['Eligible workers can now deduct up to 5,000 in tips from their federal taxable income. Qualifying occupations include delivery drivers, restaurant workers, hotel staff, salon workers, and other service workers who customarily receive tips. If you earned 2,000 in tips as a DoorDash or Uber Eats driver in 2026',
   'Eligible workers can now deduct up to $25,000 in tips from their federal taxable income. Qualifying occupations include delivery drivers, restaurant workers, hotel staff, salon workers, and other service workers who customarily receive tips. If you earned $2,000 in tips as a DoorDash or Uber Eats driver in 2026'],
  ['On 0,000 net profit that is a 0,000 deduction — reducing your taxable income to 0,000 before any other deductions. Income limits apply above 97,300 (single) and 94,600 (married filing jointly) for 2026.',
   'On $50,000 net profit that is a $10,000 deduction — reducing your taxable income to $40,000 before any other deductions. Income limits apply above $197,300 (single) and $394,600 (married filing jointly) for 2026.'],
  ['1099-NEC Reporting Threshold Raised to ,000', '1099-NEC Reporting Threshold Raised to $2,000'],
  ['Companies are now only required to issue a 1099-NEC if they paid you ,000 or more in 2026, up from the previous 00 threshold. If a client paid you ,500 in 2026 they are not required to send a 1099-NEC.',
   'Companies are now only required to issue a 1099-NEC if they paid you $2,000 or more in 2026, up from the previous $600 threshold. If a client paid you $1,500 in 2026 they are not required to send a 1099-NEC.'],
  ['SALT Deduction Cap Raised to 0,000', 'SALT Deduction Cap Raised to $40,000'],
  ['The State and Local Tax (SALT) deduction cap was raised from 0,000 to 0,000 for 2026.',
   'The State and Local Tax (SALT) deduction cap was raised from $10,000 to $40,000 for 2026.'],
  ['<td>Up to 5,000 federal deduction</td>', '<td>Up to $25,000 federal deduction</td>'],
  ['<td>00</td><td>,000</td>', '<td>$600</td><td>$2,000</td>'],
  ['<td>0,000</td><td>0,000</td>', '<td>$10,000</td><td>$40,000</td>'],
  ['A DoorDash driver earning 0,000 gross with 0,000 in tips and 5,000 in mileage deductions could reduce their federal taxable income to approximately 1,000 after all deductions',
   'A DoorDash driver earning $40,000 gross with $3,000 in tips and $5,000 in mileage deductions could reduce their federal taxable income to approximately $32,000 after all deductions'],
  ['No Tax on Tips: up to 5,000 deduction for eligible tipped workers', 'No Tax on Tips: up to $25,000 deduction for eligible tipped workers'],
  ['SALT: deduct up to 0,000 in state and local taxes if you itemize', 'SALT: deduct up to $40,000 in state and local taxes if you itemize'],
  ['1099-NEC threshold: fewer forms to track at ,000 limit', '1099-NEC threshold: fewer forms to track at $2,000 limit'],
  ['The deduction covers up to 5,000 in tips per year', 'The deduction covers up to $25,000 in tips per year'],
];

let applied = 0;
for (const [oldStr, newStr] of replacements) {
  if (html.includes(oldStr)) {
    html = html.split(oldStr).join(newStr);
    applied++;
  } else {
    console.log('НЕ ЗНАЙДЕНО:', oldStr.slice(0, 60));
  }
}

console.log('Замін застосовано:', applied, 'з', replacements.length);
if (html !== before) writeFileSync(f, html);
