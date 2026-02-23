import json

def find_keys(d, target, path=""):
    results = []
    if isinstance(d, dict):
        for k, v in d.items():
            new_path = f"{path}.{k}" if path else k
            if k == target:
                results.append(new_path)
            results.extend(find_keys(v, target, new_path))
    return results

with open('messages/es.json', 'r', encoding='utf-8') as f:
    # Use a custom decoder to detect duplicate keys if possible
    # But for now let's just grep the file content for keys
    content = f.read()

print(f"Occurrences of 'KYC' in file: {content.count('\"KYC\"')}")

# Try to parse and find paths
data = json.loads(content)
paths = find_keys(data, "KYC")
print(f"Paths to KYC: {paths}")
