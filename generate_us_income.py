import os
template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tax on ${amount} 1099 Income 2026 | Self-Employed Guide</title>
    <meta name="description" content="How much tax do you pay on ${amount} self-employed income in 2026? Breakdown of SE tax and federal income tax.">
    <link rel="canonical" href="https://www.1099deductions.com/{file}" />
    <style>body{{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#333;background:#f7fafc}}h1{{color:#2d3748}}</style>
</head>
<body>
    <h1>Tax on ${amount} Self-Employed Income</h1>
    <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #ddd">
        <p>If you earn **${amount}** as a 1099 contractor in 2026, you will owe approximately 15.3% in Self-Employment tax, plus federal income tax based on your bracket.</p>
        <a href="index.html" style="display:inline-block;background:#2d3748;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px">Calculate Your Exact Tax →</a>
    </div>
</body>
</html>"""
for i in range(10, 210, 2 ):
    amount = f"{i},000"
    f = f"tax-on-{i}k-1099-income-2026.html"
    with open(f, 'w', encoding='utf-8') as file:
        file.write(template.replace("{amount}", amount).replace("{file}", f))
