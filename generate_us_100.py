import os, urllib.request, json
profs = ["Freelance-Writer", "Graphic-Designer", "Software-Developer", "Real-Estate-Agent", "Photographer", "Consultant", "Social-Media-Manager", "Virtual-Assistant", "Tutor", "Pet-Sitter", "Handyman", "Landscaper", "House-Cleaner", "Nanny", "Massage-Therapist", "Personal-Trainer", "Yoga-Instructor", "Esthetician", "Makeup-Artist", "Barber", "Event-Planner", "Caterer", "DJ", "Videographer", "Editor", "Translator", "Copywriter", "SEO-Specialist", "Web-Designer", "App-Developer", "Data-Analyst", "Project-Manager", "Bookkeeper", "Accountant", "Life-Coach", "Career-Coach", "Business-Coach", "Marketing-Consultant", "Sales-Rep", "Insurance-Agent", "Travel-Agent", "Notary-Public", "Driver", "Courier", "Delivery-Person", "Tasker", "Electrician", "Plumber", "Carpenter", "Architect"]
states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New-Hampshire", "New-Jersey", "New-Mexico", "New-York", "North-Carolina", "North-Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode-Island", "South-Carolina", "South-Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West-Virginia", "Wisconsin", "Wyoming"]
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
for p in profs: save(f"{p.lower()}-tax-deductions-2026.html", f"{p} Tax Deductions 2026", f"Write-offs for {p}", p.replace('-', ' '), f"Tax tips for {p}s in 2026.")
for s in states: save(f"1099-tax-deductions-{s.lower()}-2026.html", f"1099 Tax in {s} 2026", f"Rules for {s}", f"{s} 1099 Tax", f"State tax guide for {s}.")
data = json.dumps({"host": "www.1099deductions.com", "key": "d726090268d242c1b2c4c3b9b4c4c3b9", "keyLocation": "https://www.1099deductions.com/d726090268d242c1b2c4c3b9b4c4c3b9.txt", "urlList": urls} ).encode('utf-8')
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=data, headers={"Content-Type": "application/json"} )
try: print(f"IndexNow Status: {urllib.request.urlopen(req).getcode()}")
except Exception as e: print(f"Ping failed: {e}")
