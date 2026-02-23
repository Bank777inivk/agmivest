import json
import os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# Traductions des clés Navigation.* et chaînes restantes pour toutes les langues
nav_translations = {
    "it": {
        "Navigation": {
            "project": "Progetto",
            "identity": "Identità",
            "situation": "Situazione",
            "finances": "Finanze",
            "summary": "Riepilogo",
            "submitting": "Invio in corso..."
        },
        "Simulator": {
            "amountHint": "Regola in base alle tue esigenze.",
            "durationHint": "Espresso in mesi",
            "guaranteedRate": "Tasso fisso e garantito."
        }
    },
    "de": {
        "Navigation": {
            "project": "Projekt",
            "identity": "Identität",
            "situation": "Situation",
            "finances": "Finanzen",
            "summary": "Zusammenfassung",
            "submitting": "Wird gesendet..."
        },
        "Simulator": {
            "amountHint": "Passen Sie es nach Bedarf an.",
            "durationHint": "Ausgedrückt in Monaten",
            "guaranteedRate": "Fester und garantierter Zinssatz."
        }
    },
    "nl": {
        "Navigation": {
            "project": "Project",
            "identity": "Identiteit",
            "situation": "Situatie",
            "finances": "Financiën",
            "summary": "Samenvatting",
            "submitting": "Verzenden..."
        },
        "Simulator": {
            "amountHint": "Pas aan op uw behoefte.",
            "durationHint": "Uitgedrukt in maandelijkse termijnen",
            "guaranteedRate": "Vaste en gegarandeerde rente."
        }
    },
    "pl": {
        "Navigation": {
            "project": "Projekt",
            "identity": "Tożsamość",
            "situation": "Sytuacja",
            "finances": "Finanse",
            "summary": "Podsumowanie",
            "submitting": "Wysyłanie..."
        },
        "Simulator": {
            "amountHint": "Dostosuj do swoich potrzeb.",
            "durationHint": "Wyrażone w ratach miesięcznych",
            "guaranteedRate": "Stałe i gwarantowane oprocentowanie."
        }
    },
    "pt": {
        "Navigation": {
            "project": "Projeto",
            "identity": "Identidade",
            "situation": "Situação",
            "finances": "Finanças",
            "summary": "Resumo",
            "submitting": "A enviar..."
        },
        "Simulator": {
            "amountHint": "Ajuste conforme a sua necessidade.",
            "durationHint": "Expresso em prestações mensais",
            "guaranteedRate": "Taxa fixa e garantida."
        }
    },
    "ro": {
        "Navigation": {
            "project": "Proiect",
            "identity": "Identitate",
            "situation": "Situație",
            "finances": "Finanțe",
            "summary": "Rezumat",
            "submitting": "Se trimite..."
        },
        "Simulator": {
            "amountHint": "Ajustați în funcție de nevoile dvs.",
            "durationHint": "Exprimat în plăți lunare",
            "guaranteedRate": "Rată fixă și garantată."
        }
    },
    "sv": {
        "Navigation": {
            "project": "Projekt",
            "identity": "Identitet",
            "situation": "Situation",
            "finances": "Ekonomi",
            "summary": "Sammanfattning",
            "submitting": "Skickar..."
        },
        "Simulator": {
            "amountHint": "Justera efter ditt behov.",
            "durationHint": "Uttryckt i månatliga avbetalningar",
            "guaranteedRate": "Fast och garanterad ränta."
        }
    },
    "en": {
        "Navigation": {
            "project": "Project",
            "identity": "Identity",
            "situation": "Situation",
            "finances": "Finances",
            "summary": "Summary",
            "submitting": "Sending..."
        },
        "Simulator": {
            "amountHint": "Adjust according to your real need.",
            "durationHint": "Expressed in monthly instalments",
            "guaranteedRate": "Fixed and guaranteed rate."
        }
    },
    "es": {
        "Navigation": {
            "project": "Proyecto",
            "identity": "Identidad",
            "situation": "Situación",
            "finances": "Finanzas",
            "summary": "Resumen",
            "submitting": "Enviando..."
        },
        "Simulator": {
            "amountHint": "Ajuste según su necesidad real.",
            "durationHint": "Expresado en cuotas mensuales",
            "guaranteedRate": "Tipo de interés fijo y garantizado."
        }
    },
    "fr": {
        "Simulator": {
            "amountHint": "Ajustez selon votre besoin réel.",
            "durationHint": "Exprimée en mensualités"
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

for lang, data in nav_translations.items():
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
