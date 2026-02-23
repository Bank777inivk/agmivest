import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

security_translations = {
    "fr": {"title": "Sécurité mise à jour 🔒", "message": "Votre mot de passe a été modifié avec succès."},
    "en": {"title": "Security updated 🔒", "message": "Your password has been changed successfully."},
    "es": {"title": "Seguridad actualizada 🔒", "message": "Su contraseña ha sido modificada con éxito."},
    "it": {"title": "Sicurezza aggiornata 🔒", "message": "La sua password è stata modificata con successo."},
    "de": {"title": "Sicherheit aktualisiert 🔒", "message": "Ihr Passwort wurde erfolgreich geändert."},
    "nl": {"title": "Beveiliging bijgewerkt 🔒", "message": "Uw wachtwoord is succesvol gewijzigd."},
    "pl": {"title": "Ochrona zaktualizowana 🔒", "message": "Twoje hasło zostało pomyślnie zmienione."},
    "pt": {"title": "Segurança atualizada 🔒", "message": "A sua palavra-passe foi alterada com sucesso."},
    "ro": {"title": "Securitate actualizată 🔒", "message": "Parola dumneavoastră a fost modificată cu succes."},
    "sv": {"title": "Säkerhet uppdaterad 🔒", "message": "Ditt lösenord har ändrats framgångsrikt."}
}

for lang in languages:
    file_path = os.path.join(base_path, f"{lang}.json")
    if not os.path.exists(file_path):
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if "Dashboard" in data and "Notifications" in data["Dashboard"]:
            data["Dashboard"]["Notifications"]["securityUpdate"] = security_translations[lang]

            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Added securityUpdate to {lang}.json")
    except Exception as e:
        print(f"Error in {lang}.json: {e}")
