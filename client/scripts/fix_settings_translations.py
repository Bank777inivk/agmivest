import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

settings_updates = {
    "fr": {
        "footer": {
            "aes": "Chiffrement AES-256",
            "lastUpdate": "Dernière mise à jour",
            "february": "Février"
        }
    },
    "en": {
        "footer": {
            "aes": "AES-256 Encryption",
            "lastUpdate": "Last update",
            "february": "February"
        }
    },
    "es": {
        "footer": {
            "aes": "Cifrado AES-256",
            "lastUpdate": "Última actualización",
            "february": "Febrero"
        }
    },
    "it": {
        "footer": {
            "aes": "Crittografia AES-256",
            "lastUpdate": "Ultimo aggiornamento",
            "february": "Febbraio"
        }
    },
    "de": {
        "footer": {
            "aes": "AES-256 Verschlüsselung",
            "lastUpdate": "Letzte Aktualisierung",
            "february": "Februar"
        }
    },
    "nl": {
        "footer": {
            "aes": "AES-256 Versleuteling",
            "lastUpdate": "Laatste update",
            "february": "Februari"
        }
    },
    "pl": {
        "footer": {
            "aes": "Szyfrowanie AES-256",
            "lastUpdate": "Ostatnia aktualizacja",
            "february": "Luty"
        }
    },
    "pt": {
        "footer": {
            "aes": "Criptografia AES-256",
            "lastUpdate": "Última atualização",
            "february": "Fevereiro"
        }
    },
    "ro": {
        "footer": {
            "aes": "Criptare AES-256",
            "lastUpdate": "Ultima actualizare",
            "february": "Februarie"
        }
    },
    "sv": {
        "footer": {
            "aes": "AES-256 Kryptering",
            "lastUpdate": "Senaste uppdatering",
            "february": "Februari"
        }
    }
}

for lang in languages:
    file_path = os.path.join(base_path, f"{lang}.json")
    if not os.path.exists(file_path):
        print(f"Skipping {lang}.json: File not found")
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if "Dashboard" not in data:
            data["Dashboard"] = {}
        if "Settings" not in data["Dashboard"]:
            data["Dashboard"]["Settings"] = {}
        
        # Merge footer updates
        if "footer" not in data["Dashboard"]["Settings"]:
            data["Dashboard"]["Settings"]["footer"] = {}
        
        data["Dashboard"]["Settings"]["footer"].update(settings_updates[lang]["footer"])

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully updated Dashboard.Settings.footer in {lang}.json")

    except Exception as e:
        print(f"Error processing {lang}.json: {e}")
