import json
import os
import re

def find_duplicate_keys(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find top-level keys
    keys = re.findall(r'^  "([^"]+)": {', content, re.MULTILINE)
    duplicates = [k for k in set(keys) if keys.count(k) > 1]
    return duplicates

directory = r'c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages'
files = [f for f in os.listdir(directory) if f.endswith('.json')]

for filename in files:
    path = os.path.join(directory, filename)
    dupes = find_duplicate_keys(path)
    if dupes:
        print(f"{filename}: Duplicated keys: {dupes}")
    else:
        print(f"{filename}: No duplicated top-level keys.")
