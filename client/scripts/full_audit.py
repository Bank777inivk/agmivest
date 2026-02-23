import json
import os

ROOT_DIR = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client"
MESSAGES_DIR = os.path.join(ROOT_DIR, "messages")

def count_missing(master, target, path=""):
    missing_keys = []
    fixme_keys = []
    
    for key, value in master.items():
        current_path = f"{path}.{key}" if path else key
        if key not in target:
            missing_keys.append(current_path)
        else:
            if isinstance(value, dict):
                m, f = count_missing(value, target[key], current_path)
                missing_keys.extend(m)
                fixme_keys.extend(f)
            else:
                if isinstance(target[key], str) and "[FIXME]" in target[key]:
                    fixme_keys.append(current_path)
    return missing_keys, fixme_keys

def main():
    with open(os.path.join(MESSAGES_DIR, "fr.json"), "r", encoding="utf-8") as f:
        master = json.load(f)
    
    locales = ["en.json", "es.json", "it.json", "de.json", "nl.json", "pl.json", "pt.json", "ro.json", "sv.json"]
    
    for loc_file in locales:
        with open(os.path.join(MESSAGES_DIR, loc_file), "r", encoding="utf-8") as f:
            target = json.load(f)
        
        m, f = count_missing(master, target)
        if m or f:
            print(f"--- {loc_file} ---")
            if m:
                print(f"Missing ({len(m)}):")
                for k in m: print(f"  - {k}")
            if f:
                print(f"FIXME ({len(f)}):")
                for k in f: print(f"  - {k}")

if __name__ == "__main__":
    main()
