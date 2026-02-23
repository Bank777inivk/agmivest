import json, os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

langs = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]

for lang in langs:
    path = os.path.join(base_dir, f"{lang}.json")
    if not os.path.exists(path):
        continue
    
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # Le simple fait de load et dump va dédupliquer les clés (la dernière gagne)
        # et reformater proprement le fichier.
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"CLEANED {lang}")
    except Exception as e:
        print(f"ERROR {lang}: {str(e)}")

print("Sanitization complete!")
