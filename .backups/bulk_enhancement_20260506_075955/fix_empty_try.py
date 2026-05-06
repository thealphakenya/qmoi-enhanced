import re
from pathlib import Path
root = Path('.')
excludes = {'.venv', 'node_modules', 'mobile/node_modules', 'backups', '.git'}
changed = []
for path in root.rglob('*.py'):
    if any(part in excludes for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    lines = text.splitlines()
    new_lines = []
    modified = False
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if stripped == 'try:' and i + 1 < len(lines):
            j = i + 1
            while j < len(lines) and lines[j].strip() == '':
                j += 1
            if j < len(lines) and re.match(r'^[ \t]*except\b', lines[j].strip()):
                indent = re.match(r'^([ \t]*)', line).group(1)
                new_lines.append(line)
                new_lines.append(indent + '    pass')
                modified = True
                i += 1
                continue
        new_lines.append(line)
        i += 1
    if modified:
        path.write_text('\n'.join(new_lines) + ('\n' if text.endswith('\n') else ''), encoding='utf-8')
        changed.append(str(path))
print('Python files patched for empty try blocks:', len(changed))
for p in changed[:200]:
    print(p)
