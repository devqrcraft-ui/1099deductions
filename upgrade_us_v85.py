import os, json, urllib.request
css = "<style>.btn-3d-dark{position:relative;display:inline-flex;align-items:center;padding:12px 24px;background:linear-gradient(180deg,#2d3748 0%,#1a202c 100%);color:#fff!important;font-weight:800;border-radius:8px;border:1px solid #4a5568;box-shadow:0 4px 0 #000000,0 8px 15px rgba(0,0,0,0.4);transition:all .1s;cursor:pointer;text-transform:uppercase;text-decoration:none}.btn-3d-dark:hover{transform:translateY(-3px);box-shadow:0 7px 0 #000000,0 12px 20px rgba(45,55,72,0.4)}.btn-3d-dark:active{transform:translateY(2px);box-shadow:0 2px 0 #000000}</style>"
profs = ["AI-Trainer","Drone-Pilot","Metaverse-Architect","VR-Developer","Crypto-Specialist","NFT-Artist","Prompt-Engineer","Automation-Expert","Remote-Coach","Digital-Nomad-Advisor"]
template = '''<!DOCTYPE html><html><head>[CSS]<title>[D] Tax Deductions 2026 ★ ✓</title></head><body style="background:#f7fafc;color:#2d3748;padding:60px;font-family:sans-serif"><div style="max-width:800px;margin:0 auto;"><h1>★ [D] Tax Deductions 2026</h1><div style="background:rgba(45,55,72,0.1);padding:30px;border-radius:12px;border:1px solid #2d3748"><p>Max tax deductions for <strong>[D]</strong> in 2026.</p><a href="/" class="btn-3d-dark">See All Deductions ➔</a></div></div></body></html>'''
urls = []
for d in profs:
    f = f"{d.lower().replace(' ','-')}-tax-deductions-2026.html"
    with open(f, "w", encoding="utf-8") as file: file.write(template.replace("[CSS]", css).replace("[D]", d.replace("-"," ")))
    urls.append(f"https://www.1099deductions.com/{f}" )

print(f"Generated {len(urls)} pages. Pinging IndexNow...")
data = json.dumps({"host": "www.1099deductions.com", "key": "d726090268d242c1b2c4c3b9b4c4c3b9", "keyLocation": "https://www.1099deductions.com/d726090268d242c1b2c4c3b9b4c4c3b9.txt", "urlList": urls} ).encode('utf-8')
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=data, headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"} )
try: print(f"IndexNow Status: {urllib.request.urlopen(req).getcode()}")
except Exception as e: print(f"Ping failed: {e}")
