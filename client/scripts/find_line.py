import json

with open('messages/es.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '"Dashboard"' in line:
        print(f"Found 'Dashboard' at line {i+1}: {line.strip()}")

# Total lines
print(f"Total lines: {len(lines)}")
