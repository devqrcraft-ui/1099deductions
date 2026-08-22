import os, re
footer = """<footer style="background:#f7fafc;border-top:4px solid #2d3748;padding:40px 20px;margin-top:60px;font-family:sans-serif;">
    <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px;">
        <div><div style="font-weight:900;font-size:18px;color:#2d3748;margin-bottom:10px;">1099<span style="color:#4a5568">DEDUCTIONS</span></div></div>
        <div>
            <div style="font-size:11px;font-weight:700;color:#2d3748;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Sister Sites ➔</div>
            <a href="https://www.gigwisetax.com" style="display:block;font-size:14px;color:#2d3748;margin-bottom:8px;text-decoration:none;font-weight:700;">GigWiseTax ➔</a>
            <a href="https://www.privatepaycheck.com" style="display:block;font-size:14px;color:#2d3748;margin-bottom:8px;text-decoration:none;font-weight:700;">PrivatePaycheck ➔</a>
        </div>
    </div>
    <div style="text-align:center;padding-top:20px;margin-top:20px;border-top:1px solid #ddd;font-size:12px;color:#718096;">
        © 2026 1099Deductions.com ★ ✓ 100% Private ★ ✓ IRS 2026 Ready
    </div>
</footer>"""
for root, dirs, files in os.walk('.' ):
    for file in files:
        if file.endswith('.html'):
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f: c = f.read()
            c = re.sub(r'<title>(.*?)</title>', r'<title>\1 ★ 1099 Deductions 2026</title>', c)
            if '</footer>' not in c: c = c.replace('</body>', footer + '</body>')
            with open(os.path.join(root, file), 'w', encoding='utf-8') as f: f.write(c)
