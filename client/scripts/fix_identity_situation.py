import json
import os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

translations = {
    "it": {
        "Identity": {
            "title": "La tua identità",
            "subtitle": "Queste informazioni ci permettono di verificare la tua idoneità.",
            "civilityOptions": {"mr": "Signore", "mrs": "Signora"},
            "nationalityPlaceholder": "Es: Italiana",
            "Placeholders": {"birthDate": "GG / MM / AAAA"}
        },
        "Situation": {
            "title": "La tua situazione personale",
            "subtitle": "Conoscerla meglio per accompagnarla meglio.",
            "addressPlaceholder": "Inserisci il tuo indirizzo...",
            "zipCodePlaceholder": "Es: 00100",
            "Placeholders": {
                "yearsPlaceholder": "Anni",
                "monthsPlaceholder": "Mesi"
            },
            "options": {
                "pacs": "Unione civile",
                "widow": "Vedovo/a",
                "owner_mortgage": "Proprietario (con mutuo)",
                "free": "Alloggio gratuito"
            }
        }
    },
    "de": {
        "Identity": {
            "title": "Ihre Identität",
            "subtitle": "Diese Angaben dienen zur Überprüfung Ihrer Förderfähigkeit.",
            "civilityOptions": {"mr": "Herr", "mrs": "Frau"},
            "nationalityPlaceholder": "Z.B.: Deutsch",
            "Placeholders": {"birthDate": "TT / MM / JJJJ"}
        },
        "Situation": {
            "title": "Ihre persönliche Situation",
            "subtitle": "Damit wir Sie besser kennenlernen und begleiten können.",
            "addressPlaceholder": "Adresse eingeben...",
            "zipCodePlaceholder": "z.B.: 10115",
            "Placeholders": {
                "yearsPlaceholder": "Jahre",
                "monthsPlaceholder": "Monate"
            },
            "options": {
                "pacs": "Eingetragene Partnerschaft",
                "widow": "Verwitwet",
                "owner_mortgage": "Eigentümer (mit Kredit)",
                "free": "Kostenlos untergebracht"
            }
        }
    },
    "nl": {
        "Identity": {
            "title": "Uw identiteit",
            "subtitle": "Deze informatie stelt ons in staat uw geschiktheid te verifiëren.",
            "civilityOptions": {"mr": "Meneer", "mrs": "Mevrouw"},
            "nationalityPlaceholder": "Bijv.: Nederlands",
            "Placeholders": {"birthDate": "DD / MM / JJJJ"}
        },
        "Situation": {
            "title": "Uw persoonlijke situatie",
            "subtitle": "U beter leren kennen om u beter te begeleiden.",
            "addressPlaceholder": "Voer uw adres in...",
            "zipCodePlaceholder": "Bijv.: 1012",
            "Placeholders": {
                "yearsPlaceholder": "Jaren",
                "monthsPlaceholder": "Maanden"
            },
            "options": {
                "pacs": "Geregistreerd partnerschap",
                "widow": "Weduwnaar/Weduwe",
                "owner_mortgage": "Eigenaar (met lening)",
                "free": "Gratis gehuisvest"
            }
        }
    },
    "pl": {
        "Identity": {
            "title": "Twoja tożsamość",
            "subtitle": "Te informacje pozwalają nam zweryfikować Twoją kwalifikowalność.",
            "civilityOptions": {"mr": "Pan", "mrs": "Pani"},
            "nationalityPlaceholder": "Np.: Polskie",
            "Placeholders": {"birthDate": "DD / MM / RRRR"}
        },
        "Situation": {
            "title": "Twoja sytuacja osobista",
            "subtitle": "Poznać Cię lepiej, aby lepiej Ci towarzyszyć.",
            "addressPlaceholder": "Wprowadź swój adres...",
            "zipCodePlaceholder": "Np.: 00-001",
            "Placeholders": {
                "yearsPlaceholder": "Lata",
                "monthsPlaceholder": "Miesiące"
            },
            "options": {
                "pacs": "Związek partnerski",
                "widow": "Wdowiec/Wdowa",
                "owner_mortgage": "Właściciel (z kredytem)",
                "free": "Mieszkanie bezpłatne"
            }
        }
    },
    "pt": {
        "Identity": {
            "title": "A sua identidade",
            "subtitle": "Estas informações permitem-nos verificar a sua elegibilidade.",
            "civilityOptions": {"mr": "Senhor", "mrs": "Senhora"},
            "nationalityPlaceholder": "Ex.: Portuguesa",
            "Placeholders": {"birthDate": "DD / MM / AAAA"}
        },
        "Situation": {
            "title": "A sua situação pessoal",
            "subtitle": "Conhecê-lo melhor para melhor o acompanhar.",
            "addressPlaceholder": "Introduza a sua morada...",
            "zipCodePlaceholder": "Ex.: 1000-001",
            "Placeholders": {
                "yearsPlaceholder": "Anos",
                "monthsPlaceholder": "Meses"
            },
            "options": {
                "pacs": "União de facto",
                "widow": "Viúvo/a",
                "owner_mortgage": "Proprietário (com crédito)",
                "free": "Alojamento gratuito"
            }
        }
    },
    "ro": {
        "Identity": {
            "title": "Identitatea ta",
            "subtitle": "Aceste informații ne permit să verificăm eligibilitatea ta.",
            "civilityOptions": {"mr": "Domnul", "mrs": "Doamna"},
            "nationalityPlaceholder": "Ex.: Română",
            "Placeholders": {"birthDate": "ZZ / LL / AAAA"}
        },
        "Situation": {
            "title": "Situația ta personală",
            "subtitle": "Să te cunoaștem mai bine pentru a te însoți mai bine.",
            "addressPlaceholder": "Introduceți adresa dvs....",
            "zipCodePlaceholder": "Ex.: 010011",
            "Placeholders": {
                "yearsPlaceholder": "Ani",
                "monthsPlaceholder": "Luni"
            },
            "options": {
                "pacs": "Parteneriat civil",
                "widow": "Văduv/ă",
                "owner_mortgage": "Proprietar (cu credit)",
                "free": "Locuință gratuită"
            }
        }
    },
    "sv": {
        "Identity": {
            "title": "Din identitet",
            "subtitle": "Denna information gör det möjligt för oss att verifiera din behörighet.",
            "civilityOptions": {"mr": "Herr", "mrs": "Fru"},
            "nationalityPlaceholder": "T.ex.: Svensk",
            "Placeholders": {"birthDate": "DD / MM / ÅÅÅÅ"}
        },
        "Situation": {
            "title": "Din personliga situation",
            "subtitle": "Lär känna dig bättre för att bättre kunna stödja dig.",
            "addressPlaceholder": "Ange din adress...",
            "zipCodePlaceholder": "T.ex.: 11220",
            "Placeholders": {
                "yearsPlaceholder": "År",
                "monthsPlaceholder": "Månader"
            },
            "options": {
                "pacs": "Registrerat partnerskap",
                "widow": "Änka/Änkling",
                "owner_mortgage": "Ägare (med lån)",
                "free": "Gratis boende"
            }
        }
    },
    "en": {
        "Identity": {
            "title": "Your identity",
            "subtitle": "This information allows us to verify your eligibility.",
            "civilityOptions": {"mr": "Mr.", "mrs": "Mrs."},
            "nationalityPlaceholder": "Ex: French",
            "Placeholders": {"birthDate": "DD / MM / YYYY"}
        },
        "Situation": {
            "title": "Your personal situation",
            "subtitle": "Getting to know you better to better support you.",
            "addressPlaceholder": "Enter your address...",
            "zipCodePlaceholder": "Ex: SW1A 1AA",
            "Placeholders": {
                "yearsPlaceholder": "Years",
                "monthsPlaceholder": "Months"
            },
            "options": {
                "pacs": "Civil partnership",
                "widow": "Widowed",
                "owner_mortgage": "Owner (with mortgage)",
                "free": "Living rent-free"
            }
        }
    },
    "es": {
        "Identity": {
            "title": "Su identidad",
            "subtitle": "Esta información nos permite verificar su elegibilidad.",
            "civilityOptions": {"mr": "Sr.", "mrs": "Sra."},
            "nationalityPlaceholder": "Ej.: Española",
            "Placeholders": {"birthDate": "DD / MM / AAAA"}
        },
        "Situation": {
            "title": "Su situación personal",
            "subtitle": "Conocerle mejor para acompañarle mejor.",
            "addressPlaceholder": "Introduzca su dirección...",
            "zipCodePlaceholder": "Ej.: 28001",
            "Placeholders": {
                "yearsPlaceholder": "Años",
                "monthsPlaceholder": "Meses"
            },
            "options": {
                "pacs": "Pareja de hecho",
                "widow": "Viudo/a",
                "owner_mortgage": "Propietario (con crédito)",
                "free": "Alojado/a gratuitamente"
            }
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

for lang, data in translations.items():
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

print("All done!")
