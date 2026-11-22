/*
 * 2026 federal calculator inputs for 1099Deductions.
 * Checked against the cited primary sources on 2026-11-21.
 * IRS changes must be reviewed before editing these values; this file never
 * fetches or applies tax rules at runtime.
 */
(function (root) {
  'use strict';

  const rules = Object.freeze({
    taxYear: 2026,
    verifiedOn: '2026-11-21',
    sources: Object.freeze({
      federalRates: 'https://www.irs.gov/irb/2025-45_IRB',
      socialSecurityBase: 'https://www.ssa.gov/OACT/COLA/cbb.html',
      selfEmploymentTax: 'https://www.irs.gov/taxtopics/tc554',
      additionalMedicareTax: 'https://www.irs.gov/taxtopics/tc560',
      qbi: 'https://www.irs.gov/pub/irs-dft/f8995--dft.pdf'
    }),
    standardDeduction: Object.freeze({ single: 16100, mfj: 32200 }),
    federalBrackets: Object.freeze({
      single: Object.freeze([
        Object.freeze([0, 12400, 0.10]),
        Object.freeze([12400, 50400, 0.12]),
        Object.freeze([50400, 105700, 0.22]),
        Object.freeze([105700, 201775, 0.24]),
        Object.freeze([201775, 256225, 0.32]),
        Object.freeze([256225, 640600, 0.35]),
        Object.freeze([640600, Infinity, 0.37])
      ]),
      mfj: Object.freeze([
        Object.freeze([0, 24800, 0.10]),
        Object.freeze([24800, 100800, 0.12]),
        Object.freeze([100800, 211400, 0.22]),
        Object.freeze([211400, 403550, 0.24]),
        Object.freeze([403550, 512450, 0.32]),
        Object.freeze([512450, 768700, 0.35]),
        Object.freeze([768700, Infinity, 0.37])
      ])
    }),
    selfEmployment: Object.freeze({
      netEarningsFactor: 0.9235,
      socialSecurityRate: 0.124,
      medicareRate: 0.029,
      socialSecurityWageBase: 184500,
      additionalMedicareRate: 0.009,
      additionalMedicareThreshold: Object.freeze({ single: 200000, mfj: 250000 })
    }),
    qbi: Object.freeze({
      taxableIncomeThreshold: Object.freeze({ single: 201750, mfs: 201775, mfj: 403500 }),
      phaseInRange: Object.freeze({ single: 276750, mfs: 276775, mfj: 553500 }),
      minimumDeduction: 400,
      minimumQualifiedIncome: 1000,
      appliedByTaxMath: false
    })
  });

  function federalIncomeTax(taxableIncome, filingStatus) {
    const taxable = Number(taxableIncome);
    const status = filingStatus === 'mfj' ? 'mfj' : 'single';
    if (!Number.isFinite(taxable)) return NaN;
    return rules.federalBrackets[status].reduce((tax, bracket) => {
      const [lower, upper, rate] = bracket;
      return tax + Math.max(0, Math.min(Math.max(0, taxable), upper) - lower) * rate;
    }, 0);
  }

  function regularSelfEmploymentTax(netEarnings, socialSecurityWages) {
    const earnings = Number(netEarnings);
    const priorWages = Math.max(0, Number(socialSecurityWages) || 0);
    if (!Number.isFinite(earnings)) return NaN;
    const taxableEarnings = Math.max(0, earnings);
    const remainingWageBase = Math.max(0, rules.selfEmployment.socialSecurityWageBase - priorWages);
    return Math.min(taxableEarnings, remainingWageBase) * rules.selfEmployment.socialSecurityRate
      + taxableEarnings * rules.selfEmployment.medicareRate;
  }

  function additionalMedicareTax(medicareEarnings, filingStatus) {
    const earnings = Number(medicareEarnings);
    const status = filingStatus === 'mfj' ? 'mfj' : 'single';
    if (!Number.isFinite(earnings)) return NaN;
    return Math.max(0, earnings - rules.selfEmployment.additionalMedicareThreshold[status])
      * rules.selfEmployment.additionalMedicareRate;
  }

  const math = Object.freeze({ federalIncomeTax, regularSelfEmploymentTax, additionalMedicareTax });
  root.TAX_RULES_2026 = rules;
  root.TaxMath2026 = math;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { rules, math };
  }
})(typeof window !== 'undefined' ? window : globalThis);
