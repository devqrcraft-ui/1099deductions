import os, urllib.request, json
# 50 нових професій
profs = ["IT-Architect", "Cloud-Engineer", "Cybersecurity-Analyst", "Data-Scientist", "UX-Designer", "Product-Manager", "Agile-Coach", "Scrum-Master", "Content-Strategist", "Email-Marketer", "PPC-Specialist", "Affiliate-Marketer", "Dropshipper", "Amazon-Seller", "Etsy-Seller", "eBay-Reseller", "Real-Estate-Investor", "Airbnb-Host", "Turo-Host", "Notary-Signing-Agent", "Loan-Officer", "Mortgage-Broker", "Financial-Planner", "Investment-Advisor", "Tax-Preparer", "Legal-Assistant", "Paralegal", "Court-Reporter", "Voice-Actor", "Podcaster", "Streamer", "Influencer", "Model", "Actor", "Musician", "Artist", "Interior-Designer", "Landscape-Architect", "Civil-Engineer", "Mechanical-Engineer", "Electrical-Engineer", "Project-Coordinator", "Supply-Chain-Manager", "Logistics-Specialist", "Truck-Driver", "Hotshot-Driver", "Medical-Courier", "Phlebotomist", "Traveling-Nurse", "Dental-Hygienist"]
# 50 нових тем по хаках
hacks = ["Solo-401k-Contribution-Limits", "SEP-IRA-Tax-Savings", "HSA-Deduction-Guide", "QBI-Deduction-Optimization", "Self-Employed-Health-Insurance-Write-off", "Home-Office-Safe-Harbor-Method", "Mileage-vs-Actual-Expenses", "Depreciation-Section-179", "Bonus-Depreciation-Rules", "Augusta-Rule-Strategy", "Hiring-Your-Children-Tax-Hack", "Board-Meeting-Deduction", "Travel-Mixing-Business-and-Pleasure", "Meal-Deduction-Limits-2026", "Estimated-Tax-Safe-Harbor", "Avoiding-Underpayment-Penalties", "State-Tax-Nexus-Rules", "Sales-Tax-for-Remote-Sellers", "Form-1099-NEC-Reporting-Thresholds", "Form-1099-K-Changes-2026"]

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title} 2026 | 1099 Tax Guide</title>
    <meta name="description" content="{desc}">
    <link rel="canonical" href="https://www.1099deductions.com/{file}" />
    <style>body{{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#333;background:#f7fafc}}h1{{color:#2d3748}}a{{color:#4a5568;font-weight:700}}</style>
</head>
<body>
    <h1>{h1}</h1>
    <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ddd">
        <p>{content}</p>
        <a href="index.html">Full 1099 Deduction List →</a>
    </div>
</body>
</html>"""

urls = []
def save(f, t, d, h, c ):
    with open(f, 'w', encoding='utf-8') as file: file.write(template.format(title=t, desc=d, file=f, h1=h, content=c))
    urls.append(f"https://www.1099deductions.com/{f}" )

for p in profs: save(f"{p.lower()}-tax-deductions-2026.html", f"{p} Tax Deductions 2026", f"Write-offs for {p}", p.replace('-', ' '), f"Complete tax guide for {p}s in 2026.")
for h in hacks: save(f"{h.lower()}-tax-hack-2026.html", f"{h.replace('-', ' ')} Guide 2026", f"How to use {h}", h.replace('-', ' '), f"Expert tax strategy for {h} in 2026.")

print(f"Generated {len(urls)} pages. Pinging IndexNow...")
data = json.dumps({"host": "www.1099deductions.com", "key": "d726090268d242c1b2c4c3b9b4c4c3b9", "keyLocation": "https://www.1099deductions.com/d726090268d242c1b2c4c3b9b4c4c3b9.txt", "urlList": urls} ).encode('utf-8')
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=data, headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"} )
try: print(f"IndexNow Status: {urllib.request.urlopen(req).getcode()}")
except Exception as e: print(f"Ping failed: {e}")
