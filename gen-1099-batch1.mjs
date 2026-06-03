import { writeFileSync } from 'fs';

const BASE = 'C:/Users/RUSLAN/Desktop/1099deductions/deductions/';

// Shared CSS + header template (matches uber-california-2026 etalon exactly)
const css = `<script>
window.addEventListener('load',function(){
  var s=document.createElement('script');
  s.src='https://www.googletagmanager.com/gtag/js?id=G-B2GFS4HWY4';
  s.async=true;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  gtag('js',new Date());gtag('config','G-B2GFS4HWY4');
});
</script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--ink:#07111F;--navy:#0B1E36;--navy2:#102540;--navy3:#163052;--steel:#1E3D65;--gold:#B8924A;--gold2:#D4AA66;--gold3:#F0CB82;--crimson:#7A1520;--text:#C8D8EC;--text2:#7A96B8;--text3:#4A6A8A;--border:rgba(184,146,74,0.18);--border2:rgba(30,61,101,0.8);--white:#E8F0FA}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{width:100%;max-width:100%}
body{background:var(--ink);color:var(--text);font-family:'IBM Plex Sans',sans-serif;font-size:14px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.alert-bar{background:var(--crimson);color:#F8D0D4;text-align:center;padding:9px 24px;font-size:12px;font-family:'IBM Plex Mono',monospace;letter-spacing:.06em;border-bottom:1px solid #5A0A12}
nav{background:var(--navy);border-bottom:1px solid var(--border2);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:100}
.logo{font-family:'IBM Plex Mono',monospace;font-size:15px;font-weight:500;color:var(--gold2);text-decoration:none}
.logo span{color:var(--text2);font-size:11px;display:block;font-weight:300;letter-spacing:.05em}
.nav-links{display:flex;gap:24px;align-items:center}
.nav-links a{color:var(--text2);text-decoration:none;font-size:13px}
.nav-links a:hover{color:var(--gold2)}
.nav-cta{background:var(--crimson);color:#F8D0D4 !important;padding:8px 16px;border-radius:4px;font-weight:600 !important;font-size:12px !important}
.hero{padding:52px 32px 40px;max-width:900px;margin:0 auto}
.breadcrumb{font-size:12px;color:var(--text3);margin-bottom:16px;font-family:'IBM Plex Mono',monospace}
.breadcrumb a{color:var(--text3);text-decoration:none}
.breadcrumb a:hover{color:var(--gold2)}
.breadcrumb span{color:var(--text3);margin:0 6px}
h1{font-family:'Playfair Display',serif;font-size:clamp(26px,5vw,40px);color:var(--white);line-height:1.2;margin-bottom:14px}
h1 em{color:var(--gold2);font-style:normal}
h2{font-family:'Playfair Display',serif;font-size:22px;color:var(--white);margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.hero-sub{color:var(--text2);font-size:15px;line-height:1.7;max-width:640px;margin-bottom:28px}
.badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:36px}
.badge{background:var(--navy2);border:1px solid var(--border);padding:5px 12px;border-radius:3px;font-size:11px;font-family:'IBM Plex Mono',monospace;color:var(--text2);letter-spacing:.04em}
.badge.gold{border-color:var(--gold);color:var(--gold2)}
.section{max-width:900px;margin:0 auto 48px;padding:0 32px}
.state-notice{display:flex;gap:14px;padding:16px 20px;border-radius:6px;margin-bottom:32px;align-items:flex-start;font-size:14px;line-height:1.6}
.state-warn{background:rgba(184,146,74,.08);border:1px solid var(--border);color:var(--gold2)}
.sn-icon{font-size:18px;flex-shrink:0;margin-top:1px}
.state-notice strong{display:block;margin-bottom:4px}
.deduction-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.deduction-card{background:var(--navy2);border:1px solid var(--border2);border-radius:6px;padding:18px}
.ded-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.ded-name{font-weight:600;color:var(--white);font-size:14px}
.ded-amount{color:var(--gold2);font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;white-space:nowrap;margin-left:8px}
.ded-desc{color:var(--text2);font-size:13px;line-height:1.5}
.faq-item{border-bottom:1px solid var(--border2);padding:18px 0}
.faq-item:last-child{border-bottom:none}
.faq-q{font-weight:600;color:var(--white);margin-bottom:8px;font-size:14px}
.faq-a{color:var(--text2);font-size:13px;line-height:1.7}
.related-links{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-top:16px}
.rel-link{background:var(--navy2);border:1px solid var(--border2);border-radius:6px;padding:12px 16px;text-decoration:none;color:var(--text2);font-size:13px;transition:border-color .2s}
.rel-link:hover{border-color:var(--gold);color:var(--gold2)}
.rel-link strong{display:block;color:var(--white);font-size:13px;margin-bottom:2px}
footer{border-top:1px solid var(--border2);padding:32px;text-align:center;font-size:12px;color:var(--text3);font-family:'IBM Plex Mono',monospace}
footer a{color:var(--text3);text-decoration:none}
@media(max-width:768px){body{font-size:16px!important}.hero{padding:32px 14px 28px!important}.section{padding:0 14px;margin-bottom:32px!important}nav{padding:0 14px!important;height:auto!important;min-height:52px!important;flex-wrap:wrap!important;gap:8px!important;padding-top:10px!important;padding-bottom:10px!important}.nav-links{flex-wrap:wrap;gap:10px!important}h1{font-size:26px!important;line-height:1.25!important}.deduction-grid{grid-template-columns:1fr!important}.related-links{grid-template-columns:repeat(2,1fr)!important}footer{padding:24px 14px!important}}
@media(max-width:480px){h1{font-size:24px!important}.related-links{grid-template-columns:1fr!important}}
</style>
<script defer src="/_vercel/insights/script.js"></script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;

const nav = `<div class="alert-bar">Q3 2026 ESTIMATED TAX DEADLINE — SEPTEMBER 15, 2026 &nbsp;&bull;&nbsp; <a href="https://www.1099deductions.com">Calculate your payment &rarr;</a></div>
<nav>
  <a class="logo" href="https://www.1099deductions.com">1099Deductions.com<span>Free &middot; Independent &middot; United States</span></a>
  <div class="nav-links">
    <a href="https://www.1099deductions.com">Home</a>
    <a href="https://www.1099deductions.com/deductions/">By Job</a>
    <a href="https://www.1099deductions.com" class="nav-cta">Find My Deductions</a>
  </div>
</nav>`;

const footer = `<footer>
  <p>&copy; 2026 1099Deductions.com &mdash; Free tax deduction checklists for independent contractors. Not legal or financial advice.</p>
  <p style="margin-top:8px"><a href="https://www.1099deductions.com">Home</a> &middot; <a href="https://www.1099deductions.com/deductions/">By Job</a> &middot; <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" rel="nofollow" target="_blank">IRS Self-Employed</a></p>
</footer>`;

// ── PAGE DEFINITIONS ──────────────────────────────────────────────────────────
const pages = [
  {
    slug: 'doordash-california-2026',
    title: 'DoorDash Tax Deductions in California 2026 — Free Checklist',
    desc: 'DoorDash driver tax deductions for California 2026. Mileage $0.725/mile, state tax 1%–13.3%, SDI, hot bag, phone. Free checklist.',
    h1: 'DoorDash Tax Deductions in <em>California</em> 2026',
    platform: 'DoorDash', state: 'California', stateCode: 'CA',
    income: '$40,000', tax: '$8,852', quarterly: '$2,213', setAside: '22%',
    stateTax: '1%–13.3% (California FTB)', stateExtra: 'California SDI 1.3% if opted in as self-employed. Prop 22 does not apply to DoorDash — you are an independent contractor.',
    mileNote: 'All miles driven for DoorDash — including driving to the restaurant and returning to your zone — are deductible at $0.725/mile.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All DoorDash delivery miles including restaurant pick-up. 10,000 miles = $7,250 deduction.'},
      {name:'Hot Bags & Equipment', amount:'100%', desc:'Insulated bags, drink carriers, and any equipment used exclusively for deliveries.'},
      {name:'Phone & Data', amount:'Business %', desc:'Proportion of your monthly plan used for DoorDash navigation, app, and customer contact.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Oil changes, tyres, brakes — proportional to business miles vs total miles.'},
      {name:'Parking & Tolls', amount:'100%', desc:'Parking fees and tolls paid during DoorDash deliveries are fully deductible.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums are deductible above the line on Schedule 1.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct half your self-employment tax ($15.3%) from gross income on Schedule 1.'},
      {name:'Home Office', amount:'Business %', desc:'Proportional home costs if you use a dedicated space for DoorDash admin and record-keeping.'},
    ],
    faqs: [
      {q:'What can California DoorDash drivers deduct in 2026?', a:'Mileage at $0.725/mile, hot bags, phone (business %), car maintenance (business %), parking, tolls, health insurance premiums, and 50% of self-employment tax. California SDI is also deductible if opted in.'},
      {q:'How much tax does a DoorDash driver pay in California in 2026?', a:'On $40,000 net income: approximately $5,652 SE tax + $3,200 federal + $3,100 CA state = roughly $11,952 total before deductions. After mileage (10,000 miles = $7,250) the taxable base drops significantly.'},
      {q:'Do DoorDash California drivers pay quarterly taxes?', a:'Yes — federal (IRS Form 1040-ES) and state (CA FTB Form 540-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027.'},
      {q:'Is DoorDash mileage deductible in California?', a:'Yes. All miles driven for DoorDash — to the restaurant, to the customer, and between deliveries — are deductible at the IRS standard rate of $0.725 per mile for 2026.'},
      {q:'What is the 1099-NEC threshold for DoorDash in 2026?', a:'Under OBBBA 2026 the federal 1099-NEC threshold increased to $2,000. However you must report all self-employment income over $400 net profit regardless of whether you receive a 1099.'},
    ],
    related: [
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'No state income tax'},
      {href:'/deductions/doordash-florida-2026', strong:'DoorDash Florida 2026', text:'No state income tax'},
      {href:'/deductions/doordash-new-york-2026', strong:'DoorDash New York 2026', text:'NYC surcharge rules'},
      {href:'/deductions/uber-california-2026', strong:'Uber California 2026', text:'Prop 22 comparison'},
    ],
  },
  {
    slug: 'doordash-texas-2026',
    title: 'DoorDash Tax Deductions in Texas 2026 — Free Checklist',
    desc: 'DoorDash driver tax deductions for Texas 2026. No state income tax. Mileage $0.725/mile, SE tax 15.3%, hot bag, phone. Free checklist.',
    h1: 'DoorDash Tax Deductions in <em>Texas</em> 2026',
    platform: 'DoorDash', state: 'Texas', stateCode: 'TX',
    income: '$40,000', tax: '$8,852', quarterly: '$2,213', setAside: '22%',
    stateTax: 'None — Texas has no state income tax', stateExtra: 'Texas has no state income tax. You only pay federal income tax and self-employment tax. This makes Texas one of the best states for DoorDash drivers.',
    mileNote: 'Texas drivers often cover 10,000–15,000 miles per year across suburban routes. At $0.725/mile, that is $7,250–$10,875 in deductions.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All DoorDash delivery miles in Texas. Large suburban areas mean high mileage totals.'},
      {name:'Hot Bags & Equipment', amount:'100%', desc:'Insulated bags, pizza bags, drink carriers used exclusively for deliveries.'},
      {name:'Phone & Data', amount:'Business %', desc:'Proportion of your monthly bill used for DoorDash app, navigation, and customer texts.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Texas heat accelerates tyre wear. Deduct maintenance proportional to business miles.'},
      {name:'Parking & Tolls', amount:'100%', desc:'Texas toll roads (TxTag, TollTag) paid during deliveries are fully deductible.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums deductible above the line.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct half your self-employment tax from gross income on Schedule 1.'},
      {name:'Vehicle Registration', amount:'Business %', desc:'Texas vehicle registration fees proportional to business use percentage.'},
    ],
    faqs: [
      {q:'Do DoorDash drivers in Texas pay state income tax?', a:'No. Texas has no state income tax. DoorDash drivers in Texas only pay federal income tax (10%–22% at typical earnings) and self-employment tax of 15.3% on net profit.'},
      {q:'How much tax does a DoorDash driver pay in Texas in 2026?', a:'On $40,000 net income: approximately $5,652 SE tax + $3,200 federal income tax = $8,852 total. No state tax. After mileage deductions the total drops significantly.'},
      {q:'What is the mileage deduction for DoorDash Texas drivers in 2026?', a:'$0.725 per mile for all business miles. A Texas driver covering 12,000 miles per year deducts $8,700 — reducing taxable income by that amount.'},
      {q:'Do Texas DoorDash drivers pay quarterly estimated taxes?', a:'Yes — federal only (IRS Form 1040-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027. No state estimated tax required in Texas.'},
      {q:'Are toll road charges deductible for DoorDash in Texas?', a:'Yes. Texas toll road charges (TxTag, TollTag, EZ TAG) paid during DoorDash deliveries are fully deductible as a business expense on Schedule C.'},
    ],
    related: [
      {href:'/deductions/doordash-california-2026', strong:'DoorDash California 2026', text:'State tax 1%–13.3%'},
      {href:'/deductions/doordash-florida-2026', strong:'DoorDash Florida 2026', text:'No state income tax'},
      {href:'/deductions/lyft-texas-2026', strong:'Lyft Texas 2026', text:'Same tax rules'},
      {href:'/deductions/uber-new-york-2026', strong:'Uber New York 2026', text:'Highest tax state'},
    ],
  },
  {
    slug: 'lyft-texas-2026',
    title: 'Lyft Tax Deductions in Texas 2026 — Free Checklist',
    desc: 'Lyft driver tax deductions for Texas 2026. No state income tax. Mileage $0.725/mile, SE tax 15.3%, phone, car expenses. Free checklist.',
    h1: 'Lyft Tax Deductions in <em>Texas</em> 2026',
    platform: 'Lyft', state: 'Texas', stateCode: 'TX',
    income: '$35,000', tax: '$7,750', quarterly: '$1,938', setAside: '22%',
    stateTax: 'None — Texas has no state income tax', stateExtra: 'Texas Lyft drivers pay no state income tax — only federal income tax and self-employment tax. Airport pickups at DFW, IAH, and AUS generate significant mileage.',
    mileNote: 'Lyft miles include driving to the passenger, the trip itself, and deadhead miles between rides. All qualify at $0.725/mile.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All Lyft miles: to passenger, trip miles, and between-ride deadhead miles in Texas.'},
      {name:'Phone & Data', amount:'Business %', desc:'Proportion of your plan used for the Lyft driver app, navigation, and ride communication.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Oil changes, tyre rotations, brakes — proportional to Lyft business miles vs personal miles.'},
      {name:'Car Washes', amount:'Business %', desc:'Regular car washes to maintain passenger-facing vehicle standards.'},
      {name:'Water & Snacks', amount:'100%', desc:'Water bottles and snacks provided to Lyft passengers are fully deductible.'},
      {name:'Parking & Tolls', amount:'100%', desc:'Texas toll charges (TxTag, EZ TAG) and parking during Lyft pickups are deductible.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct half your 15.3% self-employment tax above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums deductible above the line on Schedule 1.'},
    ],
    faqs: [
      {q:'Do Lyft drivers in Texas pay state income tax?', a:'No. Texas has no state income tax. Lyft drivers in Texas pay only federal income tax and self-employment tax (15.3% on net profit). This saves $1,500–$3,500 compared to California drivers at equivalent earnings.'},
      {q:'How much tax does a Lyft driver pay in Texas in 2026?', a:'On $35,000 net income: approximately $4,946 SE tax + $2,804 federal = $7,750 total before deductions. After mileage (10,000 miles = $7,250) the taxable base falls significantly.'},
      {q:'What mileage can Lyft Texas drivers claim in 2026?', a:'$0.725 per mile for all business miles — including driving to the passenger, the trip itself, and between-ride deadhead miles. A driver covering 10,000 annual miles deducts $7,250.'},
      {q:'Are airport deadhead miles deductible for Lyft in Texas?', a:'Yes. Miles driven to DFW, IAH, AUS, or other Texas airports to pick up a Lyft passenger are business miles and fully deductible at $0.725/mile.'},
      {q:'Do Texas Lyft drivers need to pay quarterly estimated taxes?', a:'Yes — federal only. Pay via IRS Form 1040-ES by Apr 15, Jun 16, Sep 15, and Jan 15 2027. No Texas state estimated tax is required.'},
    ],
    related: [
      {href:'/deductions/lyft-california-2026', strong:'Lyft California 2026', text:'State tax 1%–13.3%'},
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'Same no-state-tax rules'},
      {href:'/deductions/uber-new-york-2026', strong:'Uber New York 2026', text:'Highest combined tax'},
      {href:'/deductions/instacart-california-2026', strong:'Instacart California 2026', text:'Grocery delivery rules'},
    ],
  },
  {
    slug: 'doordash-florida-2026',
    title: 'DoorDash Tax Deductions in Florida 2026 — Free Checklist',
    desc: 'DoorDash driver tax deductions for Florida 2026. No state income tax. Mileage $0.725/mile, SE tax 15.3%, hot bag, phone. Free checklist.',
    h1: 'DoorDash Tax Deductions in <em>Florida</em> 2026',
    platform: 'DoorDash', state: 'Florida', stateCode: 'FL',
    income: '$40,000', tax: '$8,852', quarterly: '$2,213', setAside: '22%',
    stateTax: 'None — Florida has no state income tax', stateExtra: 'Florida has no state income tax. DoorDash drivers pay only federal taxes. Florida Turnpike and SunPass toll charges during deliveries are fully deductible.',
    mileNote: 'Florida suburban sprawl — Miami, Orlando, Tampa, Jacksonville — means high delivery mileage. At $0.725/mile, every 1,000 miles saves $181 in federal tax.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All DoorDash delivery miles including restaurant pick-up and between-order driving.'},
      {name:'Hot Bags & Equipment', amount:'100%', desc:'Insulated delivery bags, drink carriers, and equipment used solely for DoorDash.'},
      {name:'Phone & Data', amount:'Business %', desc:'Business proportion of your monthly phone bill for DoorDash app and navigation.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Florida heat and humidity accelerate wear. Deduct proportional to business miles.'},
      {name:'Tolls (SunPass / Turnpike)', amount:'100%', desc:'Florida Turnpike, SunPass, and local tolls paid during DoorDash deliveries.'},
      {name:'Parking', amount:'100%', desc:'Parking fees paid during delivery pick-ups and drop-offs are fully deductible.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of your self-employment tax ($15.3%) above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums are fully deductible on Schedule 1.'},
    ],
    faqs: [
      {q:'Do DoorDash drivers in Florida pay state income tax?', a:'No. Florida has no state income tax. DoorDash drivers in Florida pay only federal income tax (10%–22%) and self-employment tax (15.3% on net profit).'},
      {q:'How much tax does a DoorDash driver pay in Florida in 2026?', a:'On $40,000 net income: approximately $5,652 SE tax + $3,200 federal = $8,852 total. No state tax. After mileage deductions the effective bill drops substantially.'},
      {q:'Are Florida Turnpike tolls deductible for DoorDash drivers?', a:'Yes. Florida Turnpike and SunPass charges paid during DoorDash deliveries are fully deductible as a business expense on Schedule C.'},
      {q:'What mileage rate applies to Florida DoorDash drivers in 2026?', a:'$0.725 per mile for all business miles under the IRS standard mileage rate. Florida routes with high suburban sprawl typically generate 8,000–14,000 business miles per year.'},
      {q:'Do Florida DoorDash drivers file quarterly estimated taxes?', a:'Yes — federal only (IRS Form 1040-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027. Florida has no state estimated tax requirement.'},
    ],
    related: [
      {href:'/deductions/doordash-california-2026', strong:'DoorDash California 2026', text:'State tax comparison'},
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'Also no state tax'},
      {href:'/deductions/doordash-new-york-2026', strong:'DoorDash New York 2026', text:'NYC surcharge rules'},
      {href:'/deductions/uber-california-2026', strong:'Uber California 2026', text:'Prop 22 breakdown'},
    ],
  },
  {
    slug: 'instacart-california-2026',
    title: 'Instacart Tax Deductions in California 2026 — Free Checklist',
    desc: 'Instacart shopper tax deductions for California 2026. Mileage $0.725/mile, state tax 1%–13.3%, phone, insulated bags. Free checklist.',
    h1: 'Instacart Tax Deductions in <em>California</em> 2026',
    platform: 'Instacart', state: 'California', stateCode: 'CA',
    income: '$35,000', tax: '$7,750', quarterly: '$1,938', setAside: '22%',
    stateTax: '1%–13.3% (California FTB)', stateExtra: 'California Instacart shoppers pay both federal and state income tax plus self-employment tax. As a Full-Service Shopper you are an independent contractor — Spark (the in-store shopper role) is W-2.',
    mileNote: 'Full-Service Instacart shoppers drive to the store, shop, and deliver. All driving miles from batch acceptance to drop-off qualify at $0.725/mile.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'Miles from batch acceptance to store, store to customer, and back to your zone.'},
      {name:'Insulated Bags', amount:'100%', desc:'Cooler bags, insulated totes, and frozen-item containers used solely for Instacart.'},
      {name:'Phone & Data', amount:'Business %', desc:'Business proportion of your plan for the Instacart Shopper app and customer contact.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Oil changes, tyres, and repairs proportional to Instacart business miles.'},
      {name:'Parking & Tolls', amount:'100%', desc:'Store parking and tolls paid during Instacart batches are fully deductible.'},
      {name:'California SDI', amount:'Deductible', desc:'SDI contributions are deductible if you have opted into the California SDI program as self-employed.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of your 15.3% self-employment tax above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums are fully deductible above the line.'},
    ],
    faqs: [
      {q:'Are Instacart shoppers employees or contractors in California 2026?', a:'Full-Service Shoppers are independent contractors. In-store (Spark) shoppers are W-2 employees. As a Full-Service Shopper you file Schedule C and pay self-employment tax of 15.3% on net profit.'},
      {q:'What can California Instacart shoppers deduct in 2026?', a:'Mileage at $0.725/mile (batch acceptance to delivery), insulated bags, phone (business %), car maintenance (business %), parking, tolls, California SDI (if opted in), and 50% of self-employment tax.'},
      {q:'How much tax does an Instacart shopper pay in California in 2026?', a:'On $35,000 net income: approximately $4,946 SE tax + $2,804 federal + $2,200 CA state = roughly $9,950 total before deductions. After mileage and other expenses the effective bill is significantly lower.'},
      {q:'Does Instacart mileage include in-store shopping time?', a:'No. Mileage is for driving only — from batch acceptance to the store, store to the customer, and returns. Time inside the store does not generate mileage but may support other expense claims.'},
      {q:'Do California Instacart shoppers pay quarterly taxes?', a:'Yes — federal (IRS 1040-ES) and California FTB (Form 540-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027.'},
    ],
    related: [
      {href:'/deductions/uber-california-2026', strong:'Uber California 2026', text:'Rideshare comparison'},
      {href:'/deductions/doordash-california-2026', strong:'DoorDash California 2026', text:'Delivery comparison'},
      {href:'/deductions/instacart-texas-2026', strong:'Instacart Texas 2026', text:'No state tax'},
      {href:'/deductions/lyft-california-2026', strong:'Lyft California 2026', text:'Rideshare deductions'},
    ],
  },
  {
    slug: 'doordash-new-york-2026',
    title: 'DoorDash Tax Deductions in New York 2026 — Free Checklist',
    desc: 'DoorDash driver tax deductions for New York 2026. State tax 4%–10.9%, NYC surcharge, mileage $0.725/mile. Free checklist.',
    h1: 'DoorDash Tax Deductions in <em>New York</em> 2026',
    platform: 'DoorDash', state: 'New York', stateCode: 'NY',
    income: '$40,000', tax: '$8,852', quarterly: '$2,213', setAside: '28%',
    stateTax: '4%–10.9% NY state + NYC resident surcharge up to 3.876%', stateExtra: 'New York state income tax ranges from 4% to 10.9%. NYC residents pay an additional local income tax surcharge of up to 3.876% — making NYC one of the highest-tax locations for gig workers.',
    mileNote: 'NYC DoorDash drivers typically use bicycles or e-bikes — claim 20¢/mile at IRS rate or deduct actual e-bike costs. Car drivers in upstate NY use the standard $0.725/mile rate.',
    deductions: [
      {name:'Mileage (Car/Van)', amount:'$0.725/mile', desc:'Standard rate for car deliveries — upstate NY and outer boroughs where driving is practical.'},
      {name:'E-Bike & Bicycle Costs', amount:'Actual costs', desc:'NYC DoorDash cyclists deduct actual bicycle maintenance, e-bike battery costs, and repairs.'},
      {name:'Hot Bags & Equipment', amount:'100%', desc:'Insulated delivery bags and equipment used exclusively for DoorDash orders.'},
      {name:'Phone & Data', amount:'Business %', desc:'Business proportion of your monthly plan for DoorDash app and customer contact.'},
      {name:'MTA & Transit Fares', amount:'Deductible', desc:'Subway or bus fares paid to reach a delivery zone at the start of a shift may qualify.'},
      {name:'Parking (where applicable)', amount:'100%', desc:'Parking fees during delivery drop-offs for car-based outer-borough drivers.'},
      {name:'NY SDI / PFL', amount:'Employee share', desc:'New York SDI and Paid Family Leave contributions may be deductible as state taxes paid.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of your self-employment tax above the line on Schedule 1.'},
    ],
    faqs: [
      {q:'How much tax does a DoorDash driver in New York City pay in 2026?', a:'A NYC-resident driver earning $40,000 net pays approximately $5,652 SE tax + $3,200 federal + $3,500 NY state + $1,500 NYC surcharge = roughly $13,852 combined. Mileage and expense deductions reduce this significantly.'},
      {q:'Can NYC DoorDash cyclists claim mileage?', a:'Yes, but at the bicycle rate of 20 cents per mile. Alternatively, NYC cyclists can deduct actual bicycle and e-bike costs — maintenance, repairs, battery charging, and accessories used solely for deliveries.'},
      {q:'Are New York City subway fares deductible for DoorDash?', a:'Potentially. If you use the subway to travel from home to a delivery zone at the start of a shift, that may qualify as a business travel expense. Keep MetroCard records and document the business purpose.'},
      {q:'Do DoorDash drivers in New York pay quarterly taxes?', a:'Yes — federal (IRS 1040-ES) and New York state (Form IT-2105). NYC residents may also owe city estimated payments. Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027.'},
      {q:'What is the New York City income tax surcharge for DoorDash drivers?', a:'NYC resident gig workers pay a city income tax surcharge of 3.078%–3.876% on top of state and federal tax. This makes NYC one of the highest-tax cities for self-employed workers in the US.'},
    ],
    related: [
      {href:'/deductions/doordash-california-2026', strong:'DoorDash California 2026', text:'West Coast comparison'},
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'No state tax'},
      {href:'/deductions/uber-new-york-2026', strong:'Uber New York 2026', text:'Rideshare NY rules'},
      {href:'/deductions/doordash-florida-2026', strong:'DoorDash Florida 2026', text:'No state tax'},
    ],
  },
  {
    slug: 'uber-texas-2026',
    title: 'Uber Tax Deductions in Texas 2026 — Free Checklist',
    desc: 'Uber driver tax deductions for Texas 2026. No state income tax. Mileage $0.725/mile, SE tax 15.3%, car expenses. Free checklist.',
    h1: 'Uber Tax Deductions in <em>Texas</em> 2026',
    platform: 'Uber', state: 'Texas', stateCode: 'TX',
    income: '$35,000', tax: '$7,750', quarterly: '$1,938', setAside: '22%',
    stateTax: 'None — Texas has no state income tax', stateExtra: 'Texas Uber drivers pay only federal income tax and self-employment tax. No state filing required. Texas is one of the most tax-friendly states for gig workers.',
    mileNote: 'Uber miles include driving to the passenger, the trip, and deadhead miles between rides. Texas long-haul routes (Houston to Galveston, Dallas suburb runs) accumulate mileage quickly.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All Uber miles — to passenger, trip, and between-ride deadhead. No upper limit.'},
      {name:'Phone & Data', amount:'Business %', desc:'Proportion of your plan used for the Uber Driver app, navigation, and rider contact.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Oil, tyres, brakes — Texas summer heat increases wear. Deduct proportional to Uber miles.'},
      {name:'Car Washes', amount:'Business %', desc:'Regular car washes to maintain Uber passenger standards are deductible.'},
      {name:'Water & Snacks', amount:'100%', desc:'Bottled water and snacks provided to Uber passengers are 100% deductible.'},
      {name:'Tolls', amount:'100%', desc:'Texas toll road charges (TxTag, TollTag, EZ TAG) during Uber trips.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of your 15.3% SE tax above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums deductible above the line on Schedule 1.'},
    ],
    faqs: [
      {q:'Do Uber drivers in Texas pay state income tax?', a:'No. Texas has no state income tax. Uber drivers in Texas pay only federal income tax and self-employment tax (15.3% on net profit). This makes Texas significantly cheaper tax-wise than California or New York.'},
      {q:'How much tax does an Uber driver pay in Texas in 2026?', a:'On $35,000 net income: approximately $4,946 SE tax + $2,804 federal = $7,750 total before deductions. After mileage (10,000 miles = $7,250) the effective tax bill drops substantially.'},
      {q:'What is the mileage deduction for Texas Uber drivers in 2026?', a:'$0.725 per mile for all business miles — driving to the passenger, the trip itself, and deadhead miles. A driver covering 12,000 Texas miles deducts $8,700.'},
      {q:'Are Texas toll road charges deductible for Uber drivers?', a:'Yes. Toll charges on Texas roads (TxTag, TollTag, EZ TAG) paid during Uber trips are fully deductible as a business expense on Schedule C.'},
      {q:'Do Texas Uber drivers pay quarterly estimated taxes?', a:'Yes — federal only (IRS Form 1040-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027. No state estimated tax is required in Texas.'},
    ],
    related: [
      {href:'/deductions/uber-california-2026', strong:'Uber California 2026', text:'Prop 22 + state tax'},
      {href:'/deductions/lyft-texas-2026', strong:'Lyft Texas 2026', text:'Same no-state-tax rules'},
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'Delivery comparison'},
      {href:'/deductions/uber-new-york-2026', strong:'Uber New York 2026', text:'Highest tax state'},
    ],
  },
  {
    slug: 'instacart-texas-2026',
    title: 'Instacart Tax Deductions in Texas 2026 — Free Checklist',
    desc: 'Instacart shopper tax deductions for Texas 2026. No state income tax. Mileage $0.725/mile, SE tax 15.3%, insulated bags. Free checklist.',
    h1: 'Instacart Tax Deductions in <em>Texas</em> 2026',
    platform: 'Instacart', state: 'Texas', stateCode: 'TX',
    income: '$35,000', tax: '$7,750', quarterly: '$1,938', setAside: '22%',
    stateTax: 'None — Texas has no state income tax', stateExtra: 'Texas Instacart shoppers pay only federal taxes. No state income tax return required. Texas suburban markets (Houston, Dallas, Austin, San Antonio) generate high mileage totals.',
    mileNote: 'Instacart Full-Service Shopper miles include driving to the store, the store to the customer, and between batches. All qualify at $0.725/mile.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All driving miles from batch acceptance through delivery drop-off across Texas routes.'},
      {name:'Insulated Bags', amount:'100%', desc:'Cooler bags, frozen-item totes, and insulated containers used solely for Instacart.'},
      {name:'Phone & Data', amount:'Business %', desc:'Business proportion of your plan for the Instacart Shopper app and customer contact.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Texas heat accelerates wear. Deduct oil, tyres, and repairs proportional to business miles.'},
      {name:'Tolls', amount:'100%', desc:'Texas toll road charges during Instacart batches are fully deductible.'},
      {name:'Parking', amount:'100%', desc:'Store and delivery parking fees paid during Instacart batches.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of self-employment tax above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums deductible above the line.'},
    ],
    faqs: [
      {q:'Are Texas Instacart shoppers employees or contractors in 2026?', a:'Full-Service Shoppers are independent contractors and file Schedule C. In-store (Spark) shoppers are W-2 employees. As a Full-Service Shopper you pay self-employment tax of 15.3% on net profit.'},
      {q:'How much tax does an Instacart shopper pay in Texas in 2026?', a:'On $35,000 net income: approximately $4,946 SE tax + $2,804 federal = $7,750 total. No state income tax in Texas. After mileage deductions the effective bill drops significantly.'},
      {q:'What is the mileage deduction for Texas Instacart shoppers in 2026?', a:'$0.725 per mile for all business miles driven. A Texas shopper covering 11,000 annual miles deducts $7,975 — a significant reduction in taxable income.'},
      {q:'Do Texas Instacart shoppers pay quarterly estimated taxes?', a:'Yes — federal only (IRS Form 1040-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027. No Texas state quarterly filing required.'},
      {q:'Can Texas Instacart shoppers deduct insulated bags?', a:'Yes. Insulated cooler bags, frozen-food totes, and any delivery equipment purchased solely for Instacart work are 100% deductible on Schedule C in the year of purchase.'},
    ],
    related: [
      {href:'/deductions/instacart-california-2026', strong:'Instacart California 2026', text:'State tax comparison'},
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'Delivery comparison'},
      {href:'/deductions/lyft-texas-2026', strong:'Lyft Texas 2026', text:'Rideshare TX rules'},
      {href:'/deductions/uber-texas-2026', strong:'Uber Texas 2026', text:'Rideshare TX rules'},
    ],
  },
  {
    slug: 'lyft-florida-2026',
    title: 'Lyft Tax Deductions in Florida 2026 — Free Checklist',
    desc: 'Lyft driver tax deductions for Florida 2026. No state income tax. Mileage $0.725/mile, SE tax 15.3%, car expenses. Free checklist.',
    h1: 'Lyft Tax Deductions in <em>Florida</em> 2026',
    platform: 'Lyft', state: 'Florida', stateCode: 'FL',
    income: '$35,000', tax: '$7,750', quarterly: '$1,938', setAside: '22%',
    stateTax: 'None — Florida has no state income tax', stateExtra: 'Florida Lyft drivers pay no state income tax. Airport pickups at MIA, MCO, TPA, and FLL generate significant mileage. Florida Turnpike tolls during Lyft trips are deductible.',
    mileNote: 'Florida tourist corridors and airport routes mean Lyft drivers often accumulate 10,000–15,000 business miles per year.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All Lyft miles — driving to passenger, trip miles, and between-ride deadhead.'},
      {name:'Phone & Data', amount:'Business %', desc:'Business proportion of your plan for the Lyft Driver app, navigation, and rider contact.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Florida humidity and heat increase wear. Deduct proportional to Lyft business miles.'},
      {name:'Car Washes', amount:'Business %', desc:'Regular washes to maintain passenger-facing standards for Lyft pickups.'},
      {name:'Water & Snacks', amount:'100%', desc:'Bottled water and snacks provided to Lyft passengers are 100% deductible.'},
      {name:'Tolls (SunPass / Turnpike)', amount:'100%', desc:'Florida Turnpike and SunPass charges during Lyft trips are fully deductible.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of your 15.3% self-employment tax above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums deductible above the line on Schedule 1.'},
    ],
    faqs: [
      {q:'Do Lyft drivers in Florida pay state income tax?', a:'No. Florida has no state income tax. Lyft drivers in Florida pay only federal income tax (10%–22%) and self-employment tax (15.3%). No state filing required.'},
      {q:'How much tax does a Lyft driver pay in Florida in 2026?', a:'On $35,000 net income: approximately $4,946 SE tax + $2,804 federal = $7,750 total before deductions. No state tax. After mileage deductions the effective bill drops significantly.'},
      {q:'Are Florida Turnpike tolls deductible for Lyft drivers?', a:'Yes. Florida Turnpike, SunPass, and local toll charges paid during Lyft trips are fully deductible as business expenses on Schedule C.'},
      {q:'What mileage rate applies to Florida Lyft drivers in 2026?', a:'$0.725 per mile for all business miles — including driving to the passenger, the trip, and deadhead miles between rides.'},
      {q:'Do Florida Lyft drivers pay quarterly estimated taxes?', a:'Yes — federal only (IRS Form 1040-ES). Deadlines: Apr 15, Jun 16, Sep 15, Jan 15 2027. No state estimated tax required in Florida.'},
    ],
    related: [
      {href:'/deductions/lyft-texas-2026', strong:'Lyft Texas 2026', text:'Also no state tax'},
      {href:'/deductions/doordash-florida-2026', strong:'DoorDash Florida 2026', text:'Delivery comparison'},
      {href:'/deductions/uber-california-2026', strong:'Uber California 2026', text:'Highest state tax'},
      {href:'/deductions/lyft-california-2026', strong:'Lyft California 2026', text:'State tax comparison'},
    ],
  },
  {
    slug: 'walmart-spark-2026',
    title: 'Walmart Spark Driver Tax Deductions 2026 — Free Checklist',
    desc: 'Walmart Spark driver tax deductions for 2026. Mileage $0.725/mile, SE tax 15.3%, insulated bags, phone. Federal + state guide. Free checklist.',
    h1: 'Walmart Spark Driver Tax Deductions <em>2026</em>',
    platform: 'Walmart Spark', state: 'All States', stateCode: 'US',
    income: '$35,000', tax: '$7,750', quarterly: '$1,938', setAside: '22%',
    stateTax: 'Varies by state — see federal guide below', stateExtra: 'Walmart Spark drivers are independent contractors in all states. Texas, Florida, and Nevada have no state income tax. California drivers pay 1%–13.3% additional. Your state tax depends on where you live and deliver.',
    mileNote: 'Spark drivers make curbside pick-up runs and last-mile deliveries. Every mile from batch acceptance to final delivery drop-off qualifies at $0.725/mile.',
    deductions: [
      {name:'Mileage', amount:'$0.725/mile', desc:'All Spark delivery miles from the Walmart store to the customer and return to zone.'},
      {name:'Insulated Bags', amount:'100%', desc:'Cooler bags and insulated containers for frozen and refrigerated Spark orders.'},
      {name:'Phone & Data', amount:'Business %', desc:'Business proportion of your monthly plan for the Spark Driver app and navigation.'},
      {name:'Car Maintenance', amount:'Business %', desc:'Oil changes, tyres, and repairs proportional to Spark business miles.'},
      {name:'Parking & Tolls', amount:'100%', desc:'Parking and tolls paid during Spark deliveries are fully deductible.'},
      {name:'SE Tax Deduction', amount:'50% of SE tax', desc:'Deduct 50% of your 15.3% self-employment tax above the line on Schedule 1.'},
      {name:'Health Insurance', amount:'100%', desc:'Self-employed health insurance premiums deductible above the line.'},
      {name:'Vehicle Registration', amount:'Business %', desc:'State vehicle registration fees proportional to business use percentage.'},
    ],
    faqs: [
      {q:'Are Walmart Spark drivers employees or contractors in 2026?', a:'Spark drivers are independent contractors in all states. You receive a 1099-NEC (if over $2,000 under OBBBA 2026 threshold), file Schedule C, and pay self-employment tax of 15.3% on net profit.'},
      {q:'What can Walmart Spark drivers deduct in 2026?', a:'Mileage at $0.725/mile (Walmart store to customer), insulated bags, phone (business %), car maintenance (business %), parking, tolls, and 50% of self-employment tax.'},
      {q:'How much tax does a Walmart Spark driver pay in 2026?', a:'On $35,000 net income: approximately $4,946 SE tax + $2,804 federal income tax = $7,750 federal total before deductions. State tax varies — Texas and Florida drivers owe no state tax.'},
      {q:'Does Walmart Spark mileage include driving from home to the store?', a:'No. Commuting from home to the Walmart store is not deductible. Mileage begins when you accept a batch at the store and ends at the delivery drop-off. Return deadhead miles also qualify.'},
      {q:'Do Walmart Spark drivers pay quarterly estimated taxes?', a:'Yes. If you expect to owe $1,000 or more in federal tax, pay estimated taxes via IRS Form 1040-ES by Apr 15, Jun 16, Sep 15, and Jan 15 2027.'},
    ],
    related: [
      {href:'/deductions/doordash-texas-2026', strong:'DoorDash Texas 2026', text:'Delivery comparison'},
      {href:'/deductions/instacart-california-2026', strong:'Instacart California 2026', text:'Grocery delivery CA'},
      {href:'/deductions/instacart-texas-2026', strong:'Instacart Texas 2026', text:'Grocery delivery TX'},
      {href:'/deductions/doordash-california-2026', strong:'DoorDash California 2026', text:'CA delivery rules'},
    ],
  },
];

// ── PAGE BUILDER ──────────────────────────────────────────────────────────────
function buildPage(p) {
  const schemaFAQ = JSON.stringify({
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity": p.faqs.map(f=>({
      "@type":"Question","name":f.q,
      "acceptedAnswer":{"@type":"Answer","text":f.a}
    }))
  });
  const schemaBreadcrumb = JSON.stringify({
    "@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"1099Deductions","item":"https://www.1099deductions.com"},
      {"@type":"ListItem","position":2,"name":"By Job Type","item":"https://www.1099deductions.com/deductions/"},
      {"@type":"ListItem","position":3,"name":`${p.platform} Deductions`,"item":`https://www.1099deductions.com/deductions/${p.platform.toLowerCase().replace(' ','-')}`},
      {"@type":"ListItem","position":4,"name":`${p.platform} ${p.state} 2026`,"item":`https://www.1099deductions.com/deductions/${p.slug}`}
    ]
  });
  const schemaBlogPosting = JSON.stringify({
    "@context":"https://schema.org","@type":"BlogPosting",
    "headline":p.title,
    "description":p.desc,
    "url":`https://www.1099deductions.com/deductions/${p.slug}`,
    "datePublished":"2026-01-01","dateModified":"2026-06-04",
    "author":{"@type":"Person","name":"Ethan Blake","jobTitle":"Small Business Tax & Compliance Expert","sameAs":["https://medium.com/@dev.qrcraft","https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center"]},
    "reviewedBy":{"@type":"Person","name":"Ethan Blake","jobTitle":"Small Business Tax & Compliance Expert"},
    "publisher":{"@type":"Organization","name":"1099Deductions.com","url":"https://www.1099deductions.com"}
  });

  const deductionCards = p.deductions.map(d=>`
    <div class="deduction-card">
      <div class="ded-top">
        <span class="ded-name">${d.name}</span>
        <span class="ded-amount">${d.amount}</span>
      </div>
      <div class="ded-desc">${d.desc}</div>
    </div>`).join('');

  const faqItems = p.faqs.map(f=>`
    <div class="faq-item">
      <div class="faq-q">${f.q}</div>
      <div class="faq-a">${f.a}</div>
    </div>`).join('');

  const relatedLinks = p.related.map(r=>`
    <a class="rel-link" href="${r.href}">
      <strong>${r.strong}</strong>${r.text}
    </a>`).join('');

  const breadcrumbSlug = p.platform.toLowerCase().replace(' ','-');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="https://www.1099deductions.com/deductions/${p.slug}">
<link rel="canonical" href="https://www.1099deductions.com/deductions/${p.slug}">
<script type="application/ld+json">${schemaFAQ}</script>
<script type="application/ld+json">${schemaBreadcrumb}</script>
<script type="application/ld+json">${schemaBlogPosting}</script>
${css}
</head>
<body>
${nav}

<article itemscope itemtype="https://schema.org/BlogPosting">
<header>
<div class="hero">
  <div class="breadcrumb">
    <a href="https://www.1099deductions.com">Home</a><span>&rsaquo;</span>
    <a href="https://www.1099deductions.com/deductions/">By Job Type</a><span>&rsaquo;</span>
    <a href="https://www.1099deductions.com/deductions/${breadcrumbSlug}">${p.platform}</a><span>&rsaquo;</span>
    ${p.state} 2026
  </div>
  <h1>${p.h1}</h1>
  <div style="font-size:12px;color:rgba(200,216,236,0.5);margin:6px 0 0;letter-spacing:0.02em;">Last updated: June 2026 &nbsp;&middot;&nbsp; By Ethan Blake &nbsp;&middot;&nbsp; ~5 min read &middot; 1,400 words</div>
  <div style="background:rgba(184,146,74,0.06);border:1px solid rgba(184,146,74,0.2);border-radius:8px;padding:20px 24px;margin:24px 0 16px">
    <div style="font-size:12px;font-weight:700;color:#D4AA66;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">2026 Tax Summary &mdash; ${p.platform} ${p.state}</div>
    <p style="font-size:14px;color:rgba(200,216,236,0.85);line-height:1.8;margin:0">On <strong style="color:#E8F0FA">${p.income} net income</strong>: federal total ~<strong style="color:#E8F0FA">${p.tax}</strong>. Quarterly payment: <strong style="color:#D4AA66">${p.quarterly}</strong>. Set aside <strong style="color:#D4AA66">${p.setAside}</strong> of every payment. Track every mile at 72.5&cent;. ${p.stateTax !== 'Varies by state — see federal guide below' ? `State tax: <strong style="color:#D4AA66">${p.stateTax}</strong>.` : ''}</p>
  </div>
  <p class="hero-sub">${p.platform} drivers and shoppers are independent contractors. You receive a 1099-NEC or 1099-K and file Schedule C. ${p.mileNote}</p>
  <div class="badges">
    <span class="badge gold">IRS Mileage: $0.725/mile</span>
    <span class="badge">SE Tax: 15.3%</span>
    <span class="badge">State: ${p.stateCode}</span>
    <span class="badge">Updated June 2026</span>
    <span class="badge">OBBBA 2026</span>
  </div>
</div>
</header>

<div class="section">
  <div class="state-notice state-warn">
    <span class="sn-icon">&#9888;</span>
    <div>
      <strong>${p.state} Tax Rules 2026</strong>
      ${p.stateExtra}
    </div>
  </div>

  <h2>Tax Deductions for ${p.platform} ${p.state === 'All States' ? 'Drivers' : `Drivers in ${p.state}`} 2026</h2>
  <div class="deduction-grid">
    ${deductionCards}
  </div>
</div>

<div class="section">
  <h2>Key Takeaways</h2>
  <ul style="color:var(--text2);font-size:14px;line-height:1.9;padding-left:20px;margin-bottom:0">
    <li>Mileage is your <strong style="color:var(--white)">largest deduction</strong> &mdash; track every mile from batch/trip acceptance through drop-off</li>
    <li>Self-employment tax is <strong style="color:var(--white)">15.3%</strong> on net profit &mdash; but you deduct 50% of it above the line</li>
    <li>State tax: <strong style="color:var(--white)">${p.stateTax}</strong></li>
    <li>Set aside <strong style="color:var(--white)">${p.setAside}</strong> of every ${p.platform} payment for tax</li>
    <li>Pay <strong style="color:var(--white)">quarterly estimated taxes</strong> to avoid underpayment penalties &mdash; next deadline Sep 15, 2026</li>
    <li>Under OBBBA 2026: <strong style="color:var(--white)">No Tax on Tips</strong> up to $25,000 &mdash; report tips separately on your return</li>
  </ul>
</div>

<div class="section">
  <h2>Frequently Asked Questions</h2>
  ${faqItems}
</div>

<div class="section" itemscope itemtype="https://schema.org/Person">
  <h2>About the Author</h2>
  <div style="display:flex;gap:18px;align-items:flex-start;background:var(--navy2);border:1px solid var(--border2);border-radius:8px;padding:20px">
    <div style="width:48px;height:48px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:var(--ink);flex-shrink:0">EB</div>
    <div>
      <div style="font-weight:600;color:var(--white);margin-bottom:2px" itemprop="name">Ethan Blake</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:8px" itemprop="jobTitle">Small Business Tax &amp; Compliance Expert</div>
      <p style="font-size:13px;color:var(--text2);line-height:1.7;margin:0" itemprop="description">Tax compliance specialist since 2017. Helped 5,000+ freelancers and independent contractors navigate <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" rel="nofollow" target="_blank" style="color:var(--gold2)">IRS Schedule C deductions</a> and reduce their tax bills.</p>
    </div>
  </div>
</div>

<div class="section">
  <h2>Related Deduction Guides</h2>
  <div class="related-links">
    ${relatedLinks}
  </div>
</div>
</article>

${footer}
</body>
</html>`;
}

// ── WRITE ALL PAGES ───────────────────────────────────────────────────────────
let count = 0;
for (const p of pages) {
  const html = buildPage(p);
  writeFileSync(BASE + p.slug + '.html', html, 'utf8');
  console.log(`OK: ${p.slug}.html  ${html.length} chars`);
  count++;
}
console.log(`\nDone: ${count} pages written to ${BASE}`);
