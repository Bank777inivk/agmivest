import json
import os

def get_keys(data, prefix=''):
    keys = set()
    for k, v in data.items():
        new_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_keys(v, new_key))
        else:
            keys.add(new_key)
    return keys

def main():
    messages_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"
    fr_path = os.path.join(messages_dir, "fr.json")
    
    with open(fr_path, 'r', encoding='utf-8') as f:
        fr_data = json.load(f)
    
    fr_keys = get_keys(fr_data)
    print(f"French keys: {len(fr_keys)}")
    
    for filename in os.listdir(messages_dir):
        if filename.endswith(".json") and filename != "fr.json":
            path = os.path.join(messages_dir, filename)
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data_keys = get_keys(data)
            missing = fr_keys - data_keys
            if missing:
                print(f"{filename}: Missing {len(missing)} keys")
                # for m in sorted(list(missing)):
                #     print(f"  - {m}")
            else:
                print(f"{filename}: OK")

if __name__ == "__main__":
    main()
