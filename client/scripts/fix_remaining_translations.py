import json
import os

langs = ["it", "de", "nl", "pl", "pt", "ro", "sv"]
base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# Dictionnaire de traduction pour les nouveaux labels et placeholders (Phase 7)
translations = {
    "it": {
        "Profile": {
            "individual": "Privato",
            "professional": "Professionista"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Es: 200"
            }
        }
    },
    "de": {
        "Profile": {
            "individual": "Privatperson",
            "professional": "Gewerblich"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Z.B.: 200"
            }
        }
    },
    "nl": {
        "Profile": {
            "individual": "Particulier",
            "professional": "Zakelijk"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Bijv: 200"
            }
        }
    },
    "pl": {
        "Profile": {
            "individual": "Osoba prywatna",
            "professional": "Profesjonalista"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Np.: 200"
            }
        }
    },
    "pt": {
        "Profile": {
            "individual": "Particular",
            "professional": "Profissional"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Ex: 200"
            }
        }
    },
    "ro": {
        "Profile": {
            "individual": "Persoană fizică",
            "professional": "Profesionist"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Ex: 200"
            }
        }
    },
    "sv": {
        "Profile": {
            "individual": "Privatperson",
            "professional": "Professionell"
        },
        "Finances": {
            "Placeholders": {
                "otherCredits": "Tex: 200"
            }
        }
    }
}

def deep_merge(source, target):
    for key, value in source.items():
        if isinstance(value, dict):
            # get node or create one
            node = target.setdefault(key, {})
            deep_merge(value, node)
        else:
            target[key] = value

for lang, data in translations.items():
    path = os.path.join(base_dir, f"{lang}.json")
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
        
        # Merge translations into CreditRequest namespace
        if "CreditRequest" not in lang_data:
            lang_data["CreditRequest"] = {}
        
        deep_merge(data, lang_data["CreditRequest"])
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        print(f"Processed {lang}")
