import os, re
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            p = os.path.join(root, file)
            with open(p, 'r', encoding='utf-8') as f: c = f.read()
            # 1. Fix internal links (add .html)
            c = re.sub(r'href="/([^".]+)"', r'href="/\1.html"', c)
            # 2. Add 3D Style & Footer
            if '3D UI' not in c:
                style = '<style>/* 3D UI */ .btn-3d{position:relative;display:inline-block;padding:15px 30px;background:#2563eb;color:#fff!important;font-weight:800;border-radius:10px;box-shadow:0 5px 0 #1e3a8a,0 10px 20px rgba(0,0,0,0.3);text-decoration:none;transition:0.1s}.btn-3d:active{transform:translateY(3px);box-shadow:0 2px 0 #1e3a8a}</style>'
                footer = '<footer style="background:#1a202c;color:#fff;padding:40px;text-align:center;border-top:4px solid #2563eb">★ 1099Deductions Network ★  
<a href="https://www.gigwisetax.com" style="color:#60a5fa">GigWiseTax ➔</a></footer>'
                c = c.replace('</head>', style + '</head>' ).replace('</body>', footer + '</body>')
            with open(p, 'w', encoding='utf-8') as f: f.write(c)
