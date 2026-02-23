import json
import os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# Corrections résiduelles: Form.lastName, Simulator.durationSuffix, Simulator.guaranteedRate
residual_fixes = {
    "it": {
        "Form": {"lastName": "Cognome"},
        "Simulator": {"durationSuffix": "anni", "guaranteedRate": "Tasso fisso e garantito."}
    },
    "de": {
        "Form": {"lastName": "Nachname"},
        "Simulator": {"durationSuffix": "Jahre", "guaranteedRate": "Fester und garantierter Zinssatz."}
    },
    "nl": {
        "Form": {"lastName": "Achternaam"},
        "Simulator": {"durationSuffix": "jaar", "guaranteedRate": "Vaste en gegarandeerde rente."}
    },
    "pl": {
        "Form": {"lastName": "Nazwisko"},
        "Simulator": {"durationSuffix": "lat", "guaranteedRate": "Stałe i gwarantowane oprocentowanie."}
    },
    "pt": {
        "Form": {"lastName": "Apelido"},
        "Simulator": {"durationSuffix": "anos", "guaranteedRate": "Taxa fixa e garantida."}
    },
    "ro": {
        "Form": {"lastName": "Nume"},
        "Simulator": {"durationSuffix": "ani", "guaranteedRate": "Rată fixă și garantată."}
    },
    "sv": {
        "Form": {"lastName": "Efternamn"},
        "Simulator": {"durationSuffix": "år", "guaranteedRate": "Fast och garanterad ränta."}
    },
    "en": {
        "Form": {"lastName": "Last Name"},
        "Simulator": {"durationSuffix": "years", "guaranteedRate": "Fixed and guaranteed rate."}
    },
    "es": {
        "Form": {"lastName": "Apellidos"},
        "Simulator": {"durationSuffix": "años", "guaranteedRate": "Tipo de interés fijo y garantizado."}
    }
}

def deep_merge(source, target):
    for key, value in source.items():
        if isinstance(value, dict):
            node = target.setdefault(key, {})
            deep_merge(value, node)
        else:
            target[key] = value

for lang, data in residual_fixes.items():
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
