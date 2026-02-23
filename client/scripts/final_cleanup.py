import json
import os

langs = ["it", "de", "nl", "pl", "pt", "ro", "sv"]
base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# Dictionnaire ultra-complet pour la Phase 8 (Éradication totale du français)
all_translations = {
    "it": {
        "Common": {
            "step": "Passaggio",
            "previous": "Precedente",
            "next": "Successivo",
            "restart": "Ricomincia",
            "confirm": "Conferma",
            "submitting": "Trattamento...",
            "modify": "Modifica",
            "trackRecord": "Seguire la mia pratica"
        },
        "Simulator": {
            "personalProject": "Prestito Personale",
            "autoProject": "Prestito Auto/Moto",
            "proProject": "Prestito Professionale",
            "otherProject": "Altro progetto",
            "otherPrompt": "Specifica il tuo progetto (es: Lavori, Matrimonio...)",
            "amountLabel": "Importo desiderato",
            "durationLabel": "Durata del prestito",
            "monthlyLabel": "La tua rata",
            "months": "mesi",
            "perMonth": "mese",
            "personalLabel": "Prestito Personale",
            "autoLabel": "Prestito Auto/Moto",
            "proLabel": "Prestito Professionale",
            "otherLabel": "Altro progetto"
        },
        "Navigation": {
            "back": "Indietro",
            "submit": "Invia la mia richiesta",
            "previous": "Precedente",
            "confirm": "Conferma la mia richiesta",
            "modify": "Modifica la mia richiesta"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Celibe/Nubile",
                "married": "Sposato/a",
                "pacs": "Unione civile",
                "divorced": "Divorziato/a",
                "widow": "Vedovo/a"
            },
            "housingOptions": {
                "tenant": "Inquilino",
                "owner": "Proprietario",
                "owner_mortgage": "Proprietario (con mutuo)",
                "free": "Alloggio gratuito",
                "hosted": "Ospitato"
            }
        },
        "Finances": {
            "title": "Le tue finanze",
            "subtitle": "Queste informazioni ci aiutano a calcolare la tua capacità di prestito.",
            "Labels": {
                "artisan": "Insegna / Nome dell'azienda",
                "civil_servant": "Ministero / Amministrazione",
                "temporary": "Agenzia interinale / Datore di lavoro",
                "business_owner": "Ragione sociale / Insegna",
                "company_student": "Istituto / Università",
                "company_apprentice": "Azienda ospitante / CFA"
            }
        },
        "Summary": {
            "duration": "Durata",
            "capital": "Capitale",
            "totalCost": "Costo totale",
            "insurance": "Assicurazione (3%)",
            "totalDue": "Totale dovuto",
            "taeg": "TAEG"
        }
    },
    "de": {
        "Common": {
            "step": "Schritt",
            "previous": "Zurück",
            "next": "Weiter",
            "restart": "Neustart",
            "confirm": "Bestätigen",
            "submitting": "Wird bearbeitet...",
            "modify": "Ändern",
            "trackRecord": "Meinen Antrag verfolgen"
        },
        "Simulator": {
            "personalProject": "Privatkredit",
            "autoProject": "Auto/Motorradkredit",
            "proProject": "Gewerbekredit",
            "otherProject": "Anderes Projekt",
            "otherPrompt": "Geben Sie Ihr Projekt an (z. B. Renovierung, Hochzeit...)",
            "amountLabel": "Gewünschter Betrag",
            "durationLabel": "Kreditlaufzeit",
            "monthlyLabel": "Ihre monatliche Rate",
            "months": "Monate",
            "perMonth": "Monat",
            "personalLabel": "Privatkredit",
            "autoLabel": "Auto/Motorradkredit",
            "proLabel": "Gewerbekredit",
            "otherLabel": "Anderes Projekt"
        },
        "Navigation": {
            "back": "Zurück",
            "submit": "Antrag absenden",
            "previous": "Zurück",
            "confirm": "Antrag bestätigen",
            "modify": "Antrag ändern"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Ledig",
                "married": "Verheiratet",
                "pacs": "Eingetragene Lebenspartnerschaft",
                "divorced": "Geschieden",
                "widow": "Verwitwet"
            },
            "housingOptions": {
                "tenant": "Mieter",
                "owner": "Eigentümer",
                "owner_mortgage": "Eigentümer (mit Kredit)",
                "free": "Kostenloses Wohnen",
                "hosted": "Beherbergt"
            }
        },
        "Finances": {
            "title": "Ihre Finanzen",
            "subtitle": "Diese Informationen helfen uns dabei, Ihre Kreditfähigkeit zu berechnen.",
            "Labels": {
                "artisan": "Firmenname / Geschäftsbezeichnung",
                "civil_servant": "Ministerium / Verwaltung",
                "temporary": "Zeitarbeitsfirma / Arbeitgeber",
                "business_owner": "Firmenname / Bezeichnung",
                "company_student": "Einrichtung / Universität",
                "company_apprentice": "Ausbildungsbetrieb / CFA"
            }
        },
        "Summary": {
            "duration": "Laufzeit",
            "capital": "Kapital",
            "totalCost": "Gesamtkosten",
            "insurance": "Versicherung (3%)",
            "totalDue": "Gesamtbetrag",
            "taeg": "TAEG"
        }
    },
    "nl": {
        "Common": {
            "step": "Stap",
            "previous": "Vorige",
            "next": "Volgende",
            "restart": "Herstarten",
            "confirm": "Bevestigen",
            "submitting": "Verwerken...",
            "modify": "Aanpassen",
            "trackRecord": "Mijn dossier volgen"
        },
        "Simulator": {
            "personalProject": "Persoonlijke lening",
            "autoProject": "Auto/Motor lening",
            "proProject": "Zakelijke lening",
            "otherProject": "Ander project",
            "otherPrompt": "Specificeer uw project (bijv: Verbouwing, Bruiloft...)",
            "amountLabel": "Gewenst bedrag",
            "durationLabel": "Looptijd van de lening",
            "monthlyLabel": "Uw maandelijkse betaling",
            "months": "maanden",
            "perMonth": "maand",
            "personalLabel": "Persoonlijke lening",
            "autoLabel": "Auto/Motor lening",
            "proLabel": "Zakelijke lening",
            "otherLabel": "Ander project"
        },
        "Navigation": {
            "back": "Terug",
            "submit": "Mijn aanvraag indienen",
            "previous": "Vorige",
            "confirm": "Aanvraag bevestigen",
            "modify": "Aanvraag wijzigen"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Alleenstaand",
                "married": "Getrouwd",
                "pacs": "Geregistreerd partnerschap",
                "divorced": "Gescheiden",
                "widow": "Weduwnaar/Weduwe"
            },
            "housingOptions": {
                "tenant": "Huurder",
                "owner": "Eigenaar",
                "owner_mortgage": "Eigenaar (met lening)",
                "free": "Gratis huisvesting",
                "hosted": "Gehuisvest"
            }
        },
        "Finances": {
            "title": "Uw financiën",
            "subtitle": "Deze informatie helpt ons bij het berekenen van uw leencapaciteit.",
            "Labels": {
                "artisan": "Handelsnaam / Bedrijfsnaam",
                "civil_servant": "Ministerie / Administratie",
                "temporary": "Uitzendbureau / Werkgever",
                "business_owner": "Bedrijfsnaam / Handelsnaam",
                "company_student": "Instelling / Universiteit",
                "company_apprentice": "Gastbedrijf / CFA"
            }
        },
        "Summary": {
            "duration": "Looptijd",
            "capital": "Kapitaal",
            "totalCost": "Totale kosten",
            "insurance": "Verzekering (3%)",
            "totalDue": "Totaalbedrag",
            "taeg": "TAEG"
        }
    },
    "pl": {
        "Common": {
            "step": "Krok",
            "previous": "Poprzedni",
            "next": "Dalej",
            "restart": "Uruchom ponownie",
            "confirm": "Potwierdź",
            "submitting": "Przetwarzanie...",
            "modify": "Modyfikuj",
            "trackRecord": "Śledź mój wniosek"
        },
        "Simulator": {
            "personalProject": "Pożyczka osobista",
            "autoProject": "Pożyczka na samochód/motocykl",
            "proProject": "Pożyczka profesjonalna",
            "otherProject": "Inny projekt",
            "otherPrompt": "Określ swój projekt (np. Remont, Ślub...)",
            "amountLabel": "Żądana kwota",
            "durationLabel": "Okres pożyczki",
            "monthlyLabel": "Twoja miesięczna rata",
            "months": "miesięcy",
            "perMonth": "miesiąc",
            "personalLabel": "Pożyczka osobista",
            "autoLabel": "Pożyczka na samochód/motocykl",
            "proLabel": "Pożyczka profesjonalna",
            "otherLabel": "Inny projekt"
        },
        "Navigation": {
            "back": "Wstecz",
            "submit": "Wyślij mój wniosek",
            "previous": "Poprzedni",
            "confirm": "Potwierdź mój wniosek",
            "modify": "Zmień mój wniosek"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Kawalera/Panna",
                "married": "Żonaty/Mężatka",
                "pacs": "Związek partnerski",
                "divorced": "Rozwiedziony/a",
                "widow": "Wdowiec/Wdowa"
            },
            "housingOptions": {
                "tenant": "Najemca",
                "owner": "Właściciel",
                "owner_mortgage": "Właściciel (z kredytem)",
                "free": "Mieszkanie bezpłatne",
                "hosted": "Zakwaterowany"
            }
        },
        "Finances": {
            "title": "Twoje finanse",
            "subtitle": "Te informacje pomagają nam obliczyć Twoją zdolność kredytową.",
            "Labels": {
                "artisan": "Szyld / Nazwa firmy",
                "civil_servant": "Ministerstwo / Administracja",
                "temporary": "Agencja pracy tymczasowej / Pracodawca",
                "business_owner": "Nazwa firmy / Szyld",
                "company_student": "Placówka / Uniwersytet",
                "company_apprentice": "Firma przyjmująca / CFA"
            }
        },
        "Summary": {
            "duration": "Czas trwania",
            "capital": "Kapitał",
            "totalCost": "Całkowity koszt",
            "insurance": "Ubezpieczenie (3%)",
            "totalDue": "Całkowita kwota",
            "taeg": "RRSO"
        }
    },
    "pt": {
        "Common": {
            "step": "Passo",
            "previous": "Anterior",
            "next": "Seguinte",
            "restart": "Reiniciar",
            "confirm": "Confirmar",
            "submitting": "Processamento...",
            "modify": "Modificar",
            "trackRecord": "Acompanhar o meu pedido"
        },
        "Simulator": {
            "personalProject": "Empréstimo Pessoal",
            "autoProject": "Empréstimo Auto/Moto",
            "proProject": "Empréstimo Profissional",
            "otherProject": "Outro projeto",
            "otherPrompt": "Especifique o seu projeto (ex: Obras, Casamento...)",
            "amountLabel": "Montante pretendido",
            "durationLabel": "Duração do empréstimo",
            "monthlyLabel": "A sua prestação mensal",
            "months": "meses",
            "perMonth": "mês",
            "personalLabel": "Empréstimo Pessoal",
            "autoLabel": "Empréstimo Auto/Moto",
            "proLabel": "Empréstimo Profissional",
            "otherLabel": "Outro projeto"
        },
        "Navigation": {
            "back": "Voltar",
            "submit": "Enviar o meu pedido",
            "previous": "Anterior",
            "confirm": "Confirmar o meu pedido",
            "modify": "Modificar o meu pedido"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Solteiro/a",
                "married": "Casado/a",
                "pacs": "União de facto",
                "divorced": "Divorciado/a",
                "widow": "Viúvo/a"
            },
            "housingOptions": {
                "tenant": "Inquilino",
                "owner": "Proprietário",
                "owner_mortgage": "Proprietário (com crédito)",
                "free": "Alojado gratuitamente",
                "hosted": "Alojado"
            }
        },
        "Finances": {
            "title": "Suas finanças",
            "subtitle": "Estas informações ajudam-nos a calcular a sua capacidade de endividamento.",
            "Labels": {
                "artisan": "Insígnia / Nome da Empresa",
                "civil_servant": "Ministério / Administração",
                "temporary": "Empresa de trabalho temporário / Empregador",
                "business_owner": "Nome da empresa / Insígnia",
                "company_student": "Estabelecimento / Universidade",
                "company_apprentice": "Empresa de acolhimento / CFA"
            }
        },
        "Summary": {
            "duration": "Duração",
            "capital": "Capital",
            "totalCost": "Custo total",
            "insurance": "Seguro (3%)",
            "totalDue": "Montante total devido",
            "taeg": "TAEG"
        }
    },
    "ro": {
        "Common": {
            "step": "Pas",
            "previous": "Anterior",
            "next": "Următorul",
            "restart": "Repornește",
            "confirm": "Confirmă",
            "submitting": "Procesare...",
            "modify": "Modifică",
            "trackRecord": "Urmărește cererea"
        },
        "Simulator": {
            "personalProject": "Împrumut personal",
            "autoProject": "Împrumut Auto/Moto",
            "proProject": "Împrumut profesional",
            "otherProject": "Alt proiect",
            "otherPrompt": "Specificați proiectul (ex: Lucrări, Nuntă...)",
            "amountLabel": "Suma dorită",
            "durationLabel": "Durata împrumutului",
            "monthlyLabel": "Rata lunară",
            "months": "luni",
            "perMonth": "lună",
            "personalLabel": "Împrumut personal",
            "autoLabel": "Împrumut Auto/Moto",
            "proLabel": "Împrumut profesional",
            "otherLabel": "Alt proiect"
        },
        "Navigation": {
            "back": "Înapoi",
            "submit": "Trimite cererea",
            "previous": "Anterior",
            "confirm": "Confirmă cererea",
            "modify": "Modifică cererea"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Celibatar/ă",
                "married": "Căsătorit/ă",
                "pacs": "Parteneriat civil",
                "divorced": "Divorțat/ă",
                "widow": "Văduv/ă"
            },
            "housingOptions": {
                "tenant": "Chiriaș",
                "owner": "Proprietar",
                "owner_mortgage": "Proprietar (cu credit)",
                "free": "Locuiește gratuit",
                "hosted": "Găzduit"
            }
        },
        "Finances": {
            "title": "Finanțele tale",
            "subtitle": "Aceste informații ne ajută să calculăm capacitatea ta de împrumut.",
            "Labels": {
                "artisan": "Firmă / Numele companiei",
                "civil_servant": "Minister / Administrație",
                "temporary": "Agenție de interimat / Angajator",
                "business_owner": "Numele societății / Firmă",
                "company_student": "Instituție / Universitate",
                "company_apprentice": "Companie gazdă / CFA"
            }
        },
        "Summary": {
            "duration": "Durată",
            "capital": "Capital",
            "totalCost": "Cost total",
            "insurance": "Asigurare (3%)",
            "totalDue": "Suma totală datorată",
            "taeg": "DAE"
        }
    },
    "sv": {
        "Common": {
            "step": "Steg",
            "previous": "Föregående",
            "next": "Nästa",
            "restart": "Starta om",
            "confirm": "Bekräfta",
            "submitting": "Behandlar...",
            "modify": "Ändra",
            "trackRecord": "Följ mitt ärende"
        },
        "Simulator": {
            "personalProject": "Privatlån",
            "autoProject": "Bil/MC-lån",
            "proProject": "Företagslån",
            "otherProject": "Annat projekt",
            "otherPrompt": "Specificera ditt projekt (t.ex. renovering, bröllop...)",
            "amountLabel": "Önskat belopp",
            "durationLabel": "Löptid",
            "monthlyLabel": "Din månadskostnad",
            "months": "månader",
            "perMonth": "månad",
            "personalLabel": "Privatlån",
            "autoLabel": "Bil/MC-lån",
            "proLabel": "Företagslån",
            "otherLabel": "Annat projekt"
        },
        "Navigation": {
            "back": "Tillbaka",
            "submit": "Skicka min ansökan",
            "previous": "Föregående",
            "confirm": "Bekräfta min ansökan",
            "modify": "Ändra min ansökan"
        },
        "Situation": {
            "maritalOptions": {
                "single": "Ogift",
                "married": "Gift",
                "pacs": "Partnerskap",
                "divorced": "Skild",
                "widow": "Änka/Änkling"
            },
            "housingOptions": {
                "tenant": "Hyresgäst",
                "owner": "Ägare",
                "owner_mortgage": "Ägare (med lån)",
                "free": "Gratis boende",
                "hosted": "Inneboende"
            }
        },
        "Finances": {
            "title": "Din ekonomi",
            "subtitle": "Denna information hjälper oss att beräkna din lånekapacitet.",
            "Labels": {
                "artisan": "Företagsnamn",
                "civil_servant": "Ministerium / Myndighet",
                "temporary": "Bemanningsföretag / Arbetsgivare",
                "business_owner": "Företagsnamn",
                "company_student": "Skola / Universitet",
                "company_apprentice": "Företag / Studiecenter"
            }
        },
        "Summary": {
            "duration": "Löptid",
            "capital": "Kapital",
            "totalCost": "Total kostnad",
            "insurance": "Försäkring (3%)",
            "totalDue": "Totalt belopp att återbetala",
            "taeg": "Effektiv ränta"
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

for lang, data in all_translations.items():
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
