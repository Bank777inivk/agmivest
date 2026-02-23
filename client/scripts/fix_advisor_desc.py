import json, os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

new_keys = {
    "fr": {
        "advisor": {"quote": "\"Votre dossier est entre de bonnes mains. Je m'en occupe personnellement.\""},
        "declaration": {"seniorityDesc": "Ancienneté confirmée", "incomeDesc": "Net avant impôts", "expensesDesc": "Loyer et crédits"}
    },
    "en": {
        "advisor": {"quote": "\"Your file is in good hands. I am personally looking after it.\""},
        "declaration": {"seniorityDesc": "Confirmed seniority", "incomeDesc": "Net before taxes", "expensesDesc": "Rent and loans"}
    },
    "es": {
        "advisor": {"quote": "\"Su expediente está en buenas manos. Me ocupo personalmente de él.\""},
        "declaration": {"seniorityDesc": "Antigüedad confirmada", "incomeDesc": "Neto antes de impuestos", "expensesDesc": "Alquiler y créditos"}
    },
    "it": {
        "advisor": {"quote": "\"La sua pratica è in buone mani. Me ne occupo personalmente.\""},
        "declaration": {"seniorityDesc": "Anzianità confermata", "incomeDesc": "Netto prima delle imposte", "expensesDesc": "Affitto e prestiti"}
    },
    "de": {
        "advisor": {"quote": "\"Ihre Akte ist in guten Händen. Ich kümmere mich persönlich darum.\""},
        "declaration": {"seniorityDesc": "Betriebszugehörigkeit bestätigt", "incomeDesc": "Netto vor Steuern", "expensesDesc": "Miete und Kredite"}
    },
    "nl": {
        "advisor": {"quote": "\"Uw dossier is in goede handen. Ik neem er persoonlijk voor zorg.\""},
        "declaration": {"seniorityDesc": "Bevestigde anciënniteit", "incomeDesc": "Netto vóór belasting", "expensesDesc": "Huur en leningen"}
    },
    "pl": {
        "advisor": {"quote": "\"Twój wniosek jest w dobrych rękach. Osobiście się nim zajmuję.\""},
        "declaration": {"seniorityDesc": "Potwierdzony staż pracy", "incomeDesc": "Netto przed opodatkowaniem", "expensesDesc": "Czynsz i kredyty"}
    },
    "pt": {
        "advisor": {"quote": "\"O seu processo está em boas mãos. Trato dele pessoalmente.\""},
        "declaration": {"seniorityDesc": "Antiguidade confirmada", "incomeDesc": "Líquido antes de impostos", "expensesDesc": "Renda e créditos"}
    },
    "ro": {
        "advisor": {"quote": "\"Dosarul dvs. este pe mâini bune. Mă ocup personal de el.\""},
        "declaration": {"seniorityDesc": "Vechime confirmată", "incomeDesc": "Net înainte de impozite", "expensesDesc": "Chirie și credite"}
    },
    "sv": {
        "advisor": {"quote": "\"Ditt ärende är i goda händer. Jag tar hand om det personligen.\""},
        "declaration": {"seniorityDesc": "Bekräftad tjänstgöringstid", "incomeDesc": "Netto före skatt", "expensesDesc": "Hyra och lån"}
    }
}

def deep_merge(source, target):
    for key, value in source.items():
        if isinstance(value, dict):
            node = target.setdefault(key, {})
            deep_merge(value, node)
        else:
            target[key] = value

for lang, data in new_keys.items():
    path = os.path.join(base_dir, f"{lang}.json")
    with open(path, "r", encoding="utf-8") as f:
        lang_data = json.load(f)

    cr = lang_data.setdefault("Dashboard", {}).setdefault("Requests", {}).setdefault("Details", {})
    deep_merge(data, cr)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f"OK {lang}")

print("All done!")
