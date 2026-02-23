import json

def get_keys(data, prefix=""):
    keys = set()
    if isinstance(data, dict):
        for k, v in data.items():
            full_key = f"{prefix}.{k}" if prefix else k
            keys.add(full_key)
            keys.update(get_keys(v, full_key))
    return keys

def compare_json(ref_file, target_file):
    with open(ref_file, 'r', encoding='utf-8') as f:
        ref_data = json.load(f)
    with open(target_file, 'r', encoding='utf-8') as f:
        target_data = json.load(f)

    ref_keys = get_keys(ref_data)
    target_keys = get_keys(target_data)

    missing_in_target = ref_keys - target_keys
    extra_in_target = target_keys - ref_keys

    print(f"Total keys in {ref_file}: {len(ref_keys)}")
    print(f"Total keys in {target_file}: {len(target_keys)}")
    print(f"\nMissing in {target_file} ({len(missing_in_target)}):")
    for k in sorted(missing_in_target):
        print(f"- {k}")

    print(f"\nExtra in {target_file} ({len(extra_in_target)}):")
    for k in sorted(extra_in_target):
        print(f"- {k}")

if __name__ == "__main__":
    compare_json(r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\fr.json", r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages\it.json")
