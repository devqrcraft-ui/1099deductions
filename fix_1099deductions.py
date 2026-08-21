import os
import re

BASE_URL = "https://www.1099deductions.com"
TEAM_NAME = "the 1099Deductions Team"
OLD_EMAIL = "kalkulator018@gmail.com"
NEW_EMAIL = "hello@1099deductions.com"

def fix_html(filepath, filename, is_subfolder=False ):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Заміна автора та Email
    content = content.replace("Ethan Blake", TEAM_NAME)
    content = content.replace(OLD_EMAIL, NEW_EMAIL)

    # 2. Виправлення Canonical
    path = f"deductions/{filename}" if is_subfolder else filename
    path = path.replace("index.html", "")
    canonical_url = f"{BASE_URL}/{path}"
    content = re.sub(r'<link rel="canonical" href="[^"]*" />', f'<link rel="canonical" href="{canonical_url}" />', content)

    # 3. Оптимізація Title (до 60 символів)
    title_match = re.search(r'<title>(.*?)</title>', content)
    if title_match:
        old_title = title_match.group(1)
        new_title = old_title.replace("1099 Tax Deductions List 2026 — Free Self-Employed Expense Tool", "1099 Tax Deductions List 2026 — Free Expense Tool")
        if len(new_title) > 60:
            new_title = new_title[:57] + "..."
        content = content.replace(f"<title>{old_title}</title>", f"<title>{new_title}</title>")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {filepath}")

# Обробка файлів у корені
for file in os.listdir('.'):
    if file.endswith('.html'):
        fix_html(file, file)

# Обробка файлів у папці deductions
if os.path.exists('deductions'):
    for file in os.listdir('deductions'):
        if file.endswith('.html'):
            fix_html(os.path.join('deductions', file), file, True)

# Очищення _redirects для усунення 404
with open('_redirects', 'w', encoding='utf-8') as f:
    f.write("/deductions/* /deductions/:splat 200\n")
    f.write("/privacy /privacy-policy.html 200\n")
    f.write("/terms /terms-of-service.html 200\n")

print("\n--- 1099Deductions files and Redirects updated ---")
