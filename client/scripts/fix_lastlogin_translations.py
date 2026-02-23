import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

last_login_translations = {
    "fr": "Dernière connexion",
    "en": "Last login",
    "es": "Último inicio de sesión",
    "it": "Ultimo accesso",
    "de": "Letzter Login",
    "nl": "Laatste login",
    "pl": "Ostatnie logowanie",
    "pt": "Último login",
    "ro": "Ultima autentificare",
    "sv": "Senaste inloggning"
}

session_active_translations = {
    "fr": "Session actuelle",
    "en": "Current session",
    "es": "Sesión actual",
    "it": "Sessione attuale",
    "de": "Aktuelle Sitzung",
    "nl": "Huidige sessie",
    "pl": "Aktualna sesja",
    "pt": "Sessão atual",
    "ro": "Sesiune curentă",
    "sv": "Aktuell session"
}

for lang in languages:
    file_path = os.path.join(base_path, f"{lang}.json")
    if not os.path.exists(file_path):
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        settings = data.get("Dashboard", {}).get("Settings", {})
        if not settings:
            continue

        # Ensure lastLogin top level in Settings
        settings["lastLogin"] = last_login_translations[lang]
        
        # Ensure system namespace exists
        if "system" not in settings:
            settings["system"] = {}
        
        settings["system"]["lastLogin"] = last_login_translations[lang]
        settings["system"]["sessionActive"] = session_active_translations[lang]

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Verified lastLogin keys in {lang}.json")

    except Exception as e:
        print(f"Error in {lang}.json: {e}")
