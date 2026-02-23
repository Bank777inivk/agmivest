import json
import os

langs = ["en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"
fr_path = os.path.join(base_dir, "fr.json")

with open(fr_path, 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

def merge_keys(source, target):
    """Recursively merge keys from source to target, but keep existing target values."""
    if isinstance(source, dict):
        if not isinstance(target, dict):
            target = {}
        for key, value in source.items():
            if key not in target:
                target[key] = value
            else:
                target[key] = merge_keys(value, target[key])
        return target
    else:
        return target # Keep target value if it exists, otherwise it was added by "key not in target"

# Focus on CreditRequest and the new Form namespace
keys_to_sync = ["CreditRequest", "Form"]

for lang in langs:
    lang_path = os.path.join(base_dir, f"{lang}.json")
    if not os.path.exists(lang_path):
        print(f"Skipping {lang}, file not found.")
        continue
        
    with open(lang_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
        
    for key in keys_to_sync:
        if key in fr_data:
            if key not in lang_data:
                lang_data[key] = fr_data[key]
            else:
                lang_data[key] = merge_keys(fr_data[key], lang_data[key])
                
    with open(lang_path, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f"Synced {lang}.json")
