import os, urllib.request, json
items = ["Laptop", "Monitor", "Keyboard", "Internet", "Home-Office", "Desk-Chair", "Software", "ChatGPT-Plus", "Midjourney", "Adobe-Creative-Cloud", "Camera", "Microphone", "Lighting", "Travel", "Meals", "Health-Insurance", "Cell-Phone", "Marketing", "Business-Cards", "Website-Hosting", "Domain-Names", "Coaching", "Books", "Education", "Conferences", "Legal-Fees", "Accounting-Software", "Tax-Prep-Fees", "Office-Supplies", "Shipping", "Postage", "Uniforms", "Safety-Gear", "Tool-Storage", "Mileage", "Car-Repairs", "Gas", "Car-Insurance", "Parking", "Tolls"]
template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Can I Deduct {name} 2026 | 1099 Tax Guide</title>
    <meta name="description" content="Find out if you can deduct {name} from your 1099 taxes in 2026.">
    <link rel="canonical" href="https://www.1099deductions.com/{file}" />
    <style>body{{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#333;background:#f7fafc}}h1{{color:#2d3748}}</style>
</head>
<body>
    <h1>Can I Deduct {name}?</h1>
    <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ddd">
        <p>For the 2026 tax year, {name} is generally deductible if it is "ordinary and necessary" for your business. Track your receipts!</p>
        <a href="index.html">Full 1099 Deduction List →</a>
    </div>
</body>
</html>"""
urls = []
for i in items:
    f = f"can-i-deduct-{i.lower( )}-2026.html"
    with open(f, 'w', encoding='utf-8') as file:
        file.write(template.replace("{name}", i.replace("-", " ")).replace("{file}", f))
    urls.append(f"https://www.1099deductions.com/{f}" )

print(f"Generated {len(urls)} pages. Pinging IndexNow...")
data = json.dumps({"host": "www.1099deductions.com", "key": "d726090268d242c1b2c4c3b9b4c4c3b9", "keyLocation": "https://www.1099deductions.com/d726090268d242c1b2c4c3b9b4c4c3b9.txt", "urlList": urls} ).encode('utf-8')
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=data, headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"} )
try: print(f"IndexNow Status: {urllib.request.urlopen(req).getcode()}")
except Exception as e: print(f"Ping failed: {e}")
