import json
import os

files = [f for f in os.listdir('messages') if f.endswith('.json')]

for filename in files:
    path = os.path.join('messages', filename)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"OK: {filename}")
    except Exception as e:
        print(f"FAILED: {filename} - {str(e)}")
