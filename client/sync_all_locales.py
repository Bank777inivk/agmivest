import json
import os

ROOT_DIR = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client"
MESSAGES_DIR = os.path.join(ROOT_DIR, "messages")

def sync_keys(master, target):
    new_target = {}
    for key, value in master.items():
        if isinstance(value, dict):
            new_target[key] = sync_keys(value, target.get(key, {}))
        elif isinstance(value, list):
            existing = target.get(key)
            if existing and isinstance(existing, list) and len(existing) == len(value):
                new_target[key] = existing
            else:
                new_target[key] = [f"[FIXME] {v}" if isinstance(v, str) else v for v in value]
        else:
            existing = target.get(key)
            if existing and isinstance(existing, str) and "[FIXME]" not in existing and not existing.startswith("MISSING_MESSAGE"):
                new_target[key] = existing
            else:
                new_target[key] = f"[FIXME] {value}"
    return new_target

def main():
    # Load Master (FR)
    with open(os.path.join(MESSAGES_DIR, "fr.json"), "r", encoding="utf-8") as f:
        master = json.load(f)
    
    locales = [f.replace(".json", "") for f in os.listdir(MESSAGES_DIR) if f.endswith(".json") and f not in ["fr.json", "en.json"]]
    for lang in locales:
        loc_path = os.path.join(MESSAGES_DIR, f"{lang}.json")
        try:
            with open(loc_path, "r", encoding="utf-8") as f:
                current = json.load(f)
        except:
            current = {}
        
        synced = sync_keys(master, current)
        
        with open(loc_path, "w", encoding="utf-8") as f:
            json.dump(synced, f, ensure_ascii=False, indent=2)
        print(f"Structure synced for {lang}.json")

if __name__ == "__main__":
    main()
