import os
base_dir = '.'
template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title} 2026 | 1099 Tax Guide</title>
    <meta name="description" content="{description}">
    <link rel="canonical" href="https://www.1099deductions.com/{filename}" />
    <style>body{{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#333;background:#f7fafc}}h1{{color:#2d3748}}</style>
</head>
<body>
    <h1>{h1}</h1>
    <p>{content}</p>
    <a href="index.html">Full Deduction List →</a>
</body>
</html>"""

profs = ["Graphic Designer", "Software Developer", "Nanny", "Pet Sitter", "Handyman", "Consultant"]
for prof in profs:
    filename = f"{prof.lower( ).replace(' ', '-')}-tax-deductions-2026.html"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(template.format(title=f"{prof} Deductions 2026", description=f"Write-offs for {prof}", filename=filename, h1=prof, content=f"Tax tips for {prof}s..."))
