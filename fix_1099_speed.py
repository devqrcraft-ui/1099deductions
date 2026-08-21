import os
import re

def fix_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Виправляємо контрастність (Accessibility)
    # Замінюємо занадто прозорий текст на більш чіткий
    content = content.replace('rgba(255,255,255,0.3)', 'rgba(255,255,255,0.7)')
    content = content.replace('rgba(255,255,255,0.45)', 'rgba(255,255,255,0.8)')
    content = content.replace('color:rgba(255,255,255,0.3)', 'color:rgba(255,255,255,0.7)')
    content = content.replace('color:rgba(255,255,255,0.45)', 'color:rgba(255,255,255,0.8)')

    # 2. Видаляємо битий скрипт Vercel Insights (Console Error 404)
    content = re.sub(r'<script defer src="/_vercel/insights/script.js"></script>', '', content)

    # 3. Додаємо preconnect для Google Fonts (Performance)
    if 'fonts.googleapis.com' in content and 'rel="preconnect"' not in content:
        content = content.replace('<head>', '<head>\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {filepath}")

# Обробляємо всі HTML файли
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            fix_html_file(os.path.join(root, file))

