import json
import os

def get_keys(data, prefix=""):
    keys = set()
    if isinstance(data, dict):
        for k, v in data.items():
            full_key = f"{prefix}.{k}" if prefix else k
            keys.add(full_key)
            if isinstance(v, dict):
                keys.update(get_keys(v, full_key))
    return keys

def audit_files(ref_file, target_files):
    with open(ref_file, 'r', encoding='utf-8') as f:
        ref_data = json.load(f)
    ref_keys = get_keys(ref_data)
    
    results = {}
    for target in target_files:
        if not os.path.exists(target):
            results[target] = "Not found"
            continue
        with open(target, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
        target_keys = get_keys(target_data)
        missing = sorted(list(ref_keys - target_keys))
        results[target] = missing
    return results

if __name__ == "__main__":
    ref = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\fr.json"
    targets = [
        r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\it.json",
        r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\es.json",
        r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\nl.json"
    ]
    report = audit_files(ref, targets)
    for t, m in report.items():
        print(f"File: {os.path.basename(t)}")
        print(f"Missing keys: {len(m)}")
        if m:
            for key in m:
                print(f"  - {key}")
        print("-" * 20)
