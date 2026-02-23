import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

translations = {
    "fr": {"profession": "Profession", "company": "Entreprise / Employeur"},
    "en": {"profession": "Profession", "company": "Company / Employer"},
    "es": {"profession": "Profesión", "company": "Empresa / Empleador"},
    "it": {"profession": "Professione", "company": "Azienda / Datore di lavoro"},
    "de": {"profession": "Beruf", "company": "Unternehmen / Arbeitgeber"},
    "nl": {"profession": "Beroep", "company": "Bedrijf / Werkgever"},
    "pl": {"profession": "Zawód", "company": "Firma / Pracodawca"},
    "pt": {"profession": "Profissão", "company": "Empresa / Empregador"},
    "ro": {"profession": "Profesie", "company": "Companie / Angajator"},
    "sv": {"profession": "Yrke", "company": "Företag / Arbetsgivare"}
}

for lang in languages:
    file_path = os.path.join(base_path, f"{lang}.json")
    if not os.path.exists(file_path):
        print(f"Skipping {lang}.json: File not found")
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if "CreditRequest" not in data:
            data["CreditRequest"] = {}
        
        if "Finances" not in data["CreditRequest"]:
            data["CreditRequest"]["Finances"] = {}

        # Add or update profession and company
        data["CreditRequest"]["Finances"]["profession"] = translations[lang]["profession"]
        data["CreditRequest"]["Finances"]["company"] = translations[lang]["company"]

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully updated {lang}.json")

    except Exception as e:
        print(f"Error processing {lang}.json: {e}")
