import json
import os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# Corrections ciblées des résidus FinalRecap et autres
targeted_fixes = {
    "it": {
        "FinalRecap": {
            "submitting": "Invio in corso..."
        }
    },
    "sv": {
        "FinalRecap": {
            "submitting": "Skickar..."
        }
    },
    "de": {
        "FinalRecap": {
            "submitting": "Wird gesendet..."
        }
    },
    "nl": {
        "FinalRecap": {
            "submitting": "Verzenden..."
        }
    },
    "pl": {
        "FinalRecap": {
            "submitting": "Wysyłanie..."
        }
    },
    "pt": {
        "FinalRecap": {
            "submitting": "A enviar..."
        }
    },
    "ro": {
        "FinalRecap": {
            "submitting": "Se trimite..."
        }
    },
    "en": {
        "FinalRecap": {
            "submitting": "Sending..."
        }
    },
    "es": {
        "FinalRecap": {
            "submitting": "Enviando..."
        }
    }
}

def deep_merge(source, target):
    for key, value in source.items():
        if isinstance(value, dict):
            node = target.setdefault(key, {})
            deep_merge(value, node)
        else:
            target[key] = value

for lang, data in targeted_fixes.items():
    path = os.path.join(base_dir, f"{lang}.json")
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)

        if "CreditRequest" not in lang_data:
            lang_data["CreditRequest"] = {}

        deep_merge(data, lang_data["CreditRequest"])

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        print(f"✓ Fixed {lang}")

print("Done!")
