import os, json, urllib.request
css = """<style>.btn-3d-dark{position:relative;display:inline-flex;align-items:center;padding:14px 28px;background:linear-gradient(180deg,#2d3748 0%,#1a202c 100%);color:#fff!important;font-weight:800;border-radius:10px;border:1px solid #4a5568;box-shadow:0 4px 0 #000000,0 8px 15px rgba(0,0,0,0.4);transition:all .1s;cursor:pointer;text-decoration:none;text-transform:uppercase}.btn-3d-dark:hover{transform:translateY(-3px);box-shadow:0 8px 0 #000000,0 15px 25px rgba(45,55,72,0.4)}</style>"""
states = ["Virginia", "Maryland", "Colorado", "Arizona", "Tennessee", "Missouri", "Wisconsin", "Minnesota", "Alabama", "South-Carolina", "Kentucky", "Oregon", "Oklahoma", "Connecticut", "Utah", "Iowa", "Nevada", "Arkansas", "Mississippi", "Kansas"]
template = '''<!DOCTYPE html><html><head>[CSS]<title>1099 Deductions in [D] 2026 ★ ✓</title></head><body style="background:#f7fafc;color:#2d3748;padding:60px;font-family:sans-serif"><div style="max-width:800px;margin:0 auto;"><h1>★ [D] Tax Deductions 2026</h1><div style="background:rgba(45,55,72,0.1);padding:40px;border-radius:14px;border:1px solid #2d3748;box-shadow:0 10px 30px rgba(0,0,0,0.1)"><p>State-specific tax write-offs for <strong>[D]</strong>.</p><a href="/" class="btn-3d-dark">See [D] Deductions ➔</a></div></div></body></html>'''
urls = []
for d in states:
    f = f"1099-deductions-{d.lower()}-2026.html"
    with open(f, "w", encoding="utf-8") as file: file.write(template.replace("[CSS]", css).replace("[D]", d.replace("-"," ")))
    urls.append(f"https://www.1099deductions.com/{f}" )
data = json.dumps({"host": "www.1099deductions.com", "key": "d726090268d242c1b2c4c3b9b4c4c3b9", "urlList": urls}).encode('utf-8')
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=data, headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"} )
try: print(f"IndexNow Status: {urllib.request.urlopen(req).getcode()}")
except Exception as e: print(f"Ping failed: {e}")
