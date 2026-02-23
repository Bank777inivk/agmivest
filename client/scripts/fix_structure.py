import json
import os

langs = ["it", "de", "nl", "pl", "pt", "ro", "sv"]
base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"
fr_path = os.path.join(base_dir, "fr.json")

with open(fr_path, 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

def sync_placeholders(source, target):
    """
    Ensure target has the same keys as source for Identity and Situation Placeholders,
    but try to keep existing values if they are equivalent.
    """
    for section in ["Identity", "Situation"]:
        if section in source and "Placeholders" in source[section]:
            if section not in target:
                target[section] = {}
            if "Placeholders" not in target[section]:
                target[section]["Placeholders"] = {}
            
            src_placeholders = source[section]["Placeholders"]
            tar_placeholders = target[section]["Placeholders"]
            
            for key, val in src_placeholders.items():
                if key not in tar_placeholders:
                    tar_placeholders[key] = val
                # Optional: Handle specific cleanups
            
            # Remove old keys
            for old_key in ["yearsPlaceholder", "monthsPlaceholder"]:
                if old_key in tar_placeholders:
                    del tar_placeholders[old_key]

for lang in langs:
    path = os.path.join(base_dir, f"{lang}.json")
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        sync_placeholders(fr_data, data)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Structure synchronized for {lang}")
