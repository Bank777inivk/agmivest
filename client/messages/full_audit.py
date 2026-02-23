import json
import os

def get_keys_dict(data, prefix=''):
    keys = {}
    if not isinstance(data, dict):
        return keys
    for k, v in data.items():
        new_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_keys_dict(v, new_key))
        else:
            keys[new_key] = v
    return keys

def main():
    messages_dir = os.getcwd()
    fr_path = os.path.join(messages_dir, "fr.json")
    
    if not os.path.exists(fr_path):
        print(f"Error: {fr_path} not found")
        return

    with open(fr_path, 'r', encoding='utf-8') as f:
        fr_data = json.load(f)
    
    fr_keys = get_keys_dict(fr_data)
    print(f"French keys: {len(fr_keys)}")
    
    report = {}
    
    for filename in os.listdir(messages_dir):
        if filename.endswith(".json") and not filename.startswith("audit") and filename != "fr.json":
            lang = filename.split('.')[0]
            path = os.path.join(messages_dir, filename)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                data_keys = get_keys_dict(data)
                
                missing = sorted([k for k in fr_keys if k not in data_keys])
                extra = sorted([k for k in data_keys if k not in fr_keys])
                
                report[lang] = {
                    "missing_count": len(missing),
                    "extra_count": len(extra),
                    "missing_sample": missing[:10],
                    "all_missing": missing
                }
                print(f"{filename}: Missing {len(missing)} keys")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    with open(os.path.join(messages_dir, "audit_report_final.json"), 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print("Report written to audit_report_final.json")

if __name__ == "__main__":
    main()
