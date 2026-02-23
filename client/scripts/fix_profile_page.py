import json, os

base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

translations = {
    "fr": {
        "title": "Mon Profil",
        "subtitle": "Gérez vos informations personnelles et votre sécurité.",
        "editButton": "Modifier Profil",
        "cancelButton": "Annuler",
        "saveButton": "Enregistrer",
        "sections": {
            "identity": "État Civil",
            "contact": "Coordonnées",
            "personal": "Situation Personnelle",
            "professional": "Situation Professionnelle",
            "financial": "Situation Financière"
        },
        "fields": {
            "address": "Adresse de résidence",
            "zipCode": "Code Postal",
            "city": "Ville",
            "country": "Pays",
            "phone": "Téléphone mobile"
        },
        "companyLabels": {
            "student": "Établissement / Université",
            "apprentice": "Entreprise d'accueil / CFA",
            "independent": "Nom de votre activité",
            "artisan": "Enseigne / Nom de l'Entreprise",
            "civil_servant": "Ministère / Administration",
            "temporary": "Société d'intérim / Employeur",
            "liberal": "Cabinet / Raison sociale",
            "business_owner": "Nom de la société / Enseigne"
        },
        "incomeLabels": {
            "retired": "Pension mensuelle",
            "unemployed": "Allocations / Revenus",
            "student": "Bourses / Revenus mensuels",
            "apprentice": "Rémunération mensuelle",
            "civil_servant": "Traitement mensuel net",
            "selfEmployed": "Revenu mensuel moyen"
        }
    },
    "en": {
        "title": "My Profile",
        "subtitle": "Manage your personal information and security.",
        "editButton": "Edit Profile",
        "cancelButton": "Cancel",
        "saveButton": "Save",
        "sections": {
            "identity": "Personal Details",
            "contact": "Contact Information",
            "personal": "Personal Situation",
            "professional": "Professional Situation",
            "financial": "Financial Situation"
        },
        "fields": {
            "address": "Residential address",
            "zipCode": "Zip Code",
            "city": "City",
            "country": "Country",
            "phone": "Mobile phone"
        },
        "companyLabels": {
            "student": "School / University",
            "apprentice": "Host company / Training center",
            "independent": "Name of your activity",
            "artisan": "Trade / Company name",
            "civil_servant": "Ministry / Administration",
            "temporary": "Staffing agency / Employer",
            "liberal": "Practice / Business name",
            "business_owner": "Company name / Brand"
        },
        "incomeLabels": {
            "retired": "Monthly pension",
            "unemployed": "Benefits / Income",
            "student": "Grants / Monthly income",
            "apprentice": "Monthly pay",
            "civil_servant": "Net monthly salary",
            "selfEmployed": "Average monthly income"
        }
    },
    "es": {
        "title": "Mi Perfil",
        "subtitle": "Gestione su información personal y seguridad.",
        "editButton": "Editar Perfil",
        "cancelButton": "Cancelar",
        "saveButton": "Guardar",
        "sections": {
            "identity": "Estado Civil",
            "contact": "Datos de Contacto",
            "personal": "Situación Personal",
            "professional": "Situación Profesional",
            "financial": "Situación Financiera"
        },
        "fields": {
            "address": "Dirección de residencia",
            "zipCode": "Código Postal",
            "city": "Ciudad",
            "country": "País",
            "phone": "Teléfono móvil"
        },
        "companyLabels": {
            "student": "Centro / Universidad",
            "apprentice": "Empresa de acogida / CFA",
            "independent": "Nombre de su actividad",
            "artisan": "Empresa / Razón social",
            "civil_servant": "Ministerio / Administración",
            "temporary": "Empresa de trabajo temporal / Empleador",
            "liberal": "Despacho / Razón social",
            "business_owner": "Nombre de la empresa / Marca"
        },
        "incomeLabels": {
            "retired": "Pensión mensual",
            "unemployed": "Subsidios / Ingresos",
            "student": "Becas / Ingresos mensuales",
            "apprentice": "Remuneración mensual",
            "civil_servant": "Salario mensual neto",
            "selfEmployed": "Ingreso mensual promedio"
        }
    },
    "it": {
        "title": "Il Mio Profilo",
        "subtitle": "Gestisca le sue informazioni personali e la sicurezza.",
        "editButton": "Modifica Profilo",
        "cancelButton": "Annulla",
        "saveButton": "Salva",
        "sections": {
            "identity": "Stato Civile",
            "contact": "Dati di Contatto",
            "personal": "Situazione Personale",
            "professional": "Situazione Professionale",
            "financial": "Situazione Finanziaria"
        },
        "fields": {
            "address": "Indirizzo di residenza",
            "zipCode": "Codice Postale",
            "city": "Città",
            "country": "Paese",
            "phone": "Telefono cellulare"
        },
        "companyLabels": {
            "student": "Istituto / Università",
            "apprentice": "Azienda ospitante / CFA",
            "independent": "Nome della sua attività",
            "artisan": "Insegna / Ragione sociale",
            "civil_servant": "Ministero / Amministrazione",
            "temporary": "Agenzia interinale / Datore di lavoro",
            "liberal": "Studio / Ragione sociale",
            "business_owner": "Nome della società / Marchio"
        },
        "incomeLabels": {
            "retired": "Pensione mensile",
            "unemployed": "Sussidi / Redditi",
            "student": "Borse di studio / Redditi mensili",
            "apprentice": "Retribuzione mensile",
            "civil_servant": "Stipendio mensile netto",
            "selfEmployed": "Reddito mensile medio"
        }
    },
    "de": {
        "title": "Mein Profil",
        "subtitle": "Verwalten Sie Ihre persönlichen Daten und Sicherheit.",
        "editButton": "Profil bearbeiten",
        "cancelButton": "Abbrechen",
        "saveButton": "Speichern",
        "sections": {
            "identity": "Persönliche Daten",
            "contact": "Kontaktdaten",
            "personal": "Persönliche Situation",
            "professional": "Berufliche Situation",
            "financial": "Finanzielle Situation"
        },
        "fields": {
            "address": "Wohnadresse",
            "zipCode": "Postleitzahl",
            "city": "Stadt",
            "country": "Land",
            "phone": "Mobiltelefon"
        },
        "companyLabels": {
            "student": "Bildungseinrichtung / Universität",
            "apprentice": "Ausbildungsbetrieb / Berufsschule",
            "independent": "Name Ihrer Tätigkeit",
            "artisan": "Handwerksbetrieb / Firmenname",
            "civil_servant": "Ministerium / Behörde",
            "temporary": "Zeitarbeitsfirma / Arbeitgeber",
            "liberal": "Kanzlei / Firmenname",
            "business_owner": "Firmenname / Marke"
        },
        "incomeLabels": {
            "retired": "Monatliche Rente",
            "unemployed": "Leistungen / Einkommen",
            "student": "Stipendien / Monatliches Einkommen",
            "apprentice": "Monatliche Vergütung",
            "civil_servant": "Monatliches Nettogehalt",
            "selfEmployed": "Durchschnittliches monatliches Einkommen"
        }
    },
    "nl": {
        "title": "Mijn Profiel",
        "subtitle": "Beheer uw persoonlijke gegevens en beveiliging.",
        "editButton": "Profiel bewerken",
        "cancelButton": "Annuleren",
        "saveButton": "Opslaan",
        "sections": {
            "identity": "Persoonlijke Gegevens",
            "contact": "Contactgegevens",
            "personal": "Persoonlijke Situatie",
            "professional": "Professionele Situatie",
            "financial": "Financiële Situatie"
        },
        "fields": {
            "address": "Woonadres",
            "zipCode": "Postcode",
            "city": "Stad",
            "country": "Land",
            "phone": "Mobiele telefoon"
        },
        "companyLabels": {
            "student": "School / Universiteit",
            "apprentice": "Gastbedrijf / Opleidingscentrum",
            "independent": "Naam van uw activiteit",
            "artisan": "Bedrijfsnaam / Handelsnaam",
            "civil_servant": "Ministerie / Administratie",
            "temporary": "Uitzendbedrijf / Werkgever",
            "liberal": "Kantoor / Handelsnaam",
            "business_owner": "Bedrijfsnaam / Merk"
        },
        "incomeLabels": {
            "retired": "Maandelijks pensioen",
            "unemployed": "Uitkeringen / Inkomsten",
            "student": "Studiebeurzen / Maandelijks inkomen",
            "apprentice": "Maandelijkse vergoeding",
            "civil_servant": "Netto maandsalaris",
            "selfEmployed": "Gemiddeld maandelijks inkomen"
        }
    },
    "pl": {
        "title": "Mój Profil",
        "subtitle": "Zarządzaj swoimi danymi osobowymi i bezpieczeństwem.",
        "editButton": "Edytuj Profil",
        "cancelButton": "Anuluj",
        "saveButton": "Zapisz",
        "sections": {
            "identity": "Dane Osobowe",
            "contact": "Dane Kontaktowe",
            "personal": "Sytuacja Osobista",
            "professional": "Sytuacja Zawodowa",
            "financial": "Sytuacja Finansowa"
        },
        "fields": {
            "address": "Adres zamieszkania",
            "zipCode": "Kod Pocztowy",
            "city": "Miasto",
            "country": "Kraj",
            "phone": "Telefon komórkowy"
        },
        "companyLabels": {
            "student": "Szkoła / Uczelnia",
            "apprentice": "Firma przyjmująca / Centrum szkoleniowe",
            "independent": "Nazwa działalności",
            "artisan": "Firma / Nazwa handlowa",
            "civil_servant": "Ministerstwo / Urząd",
            "temporary": "Agencja pracy tymczasowej / Pracodawca",
            "liberal": "Kancelaria / Firma",
            "business_owner": "Nazwa firmy / Marka"
        },
        "incomeLabels": {
            "retired": "Miesięczna emerytura",
            "unemployed": "Zasiłki / Dochody",
            "student": "Stypendia / Miesięczne dochody",
            "apprentice": "Miesięczne wynagrodzenie",
            "civil_servant": "Miesięczne wynagrodzenie netto",
            "selfEmployed": "Średni miesięczny dochód"
        }
    },
    "pt": {
        "title": "O Meu Perfil",
        "subtitle": "Gira as suas informações pessoais e segurança.",
        "editButton": "Editar Perfil",
        "cancelButton": "Cancelar",
        "saveButton": "Guardar",
        "sections": {
            "identity": "Dados Pessoais",
            "contact": "Dados de Contacto",
            "personal": "Situação Pessoal",
            "professional": "Situação Profissional",
            "financial": "Situação Financeira"
        },
        "fields": {
            "address": "Morada de residência",
            "zipCode": "Código Postal",
            "city": "Cidade",
            "country": "País",
            "phone": "Telemóvel"
        },
        "companyLabels": {
            "student": "Estabelecimento / Universidade",
            "apprentice": "Empresa de acolhimento / Centro de formação",
            "independent": "Nome da sua atividade",
            "artisan": "Insígnia / Nome da empresa",
            "civil_servant": "Ministério / Administração",
            "temporary": "Empresa de trabalho temporário / Empregador",
            "liberal": "Escritório / Razão social",
            "business_owner": "Nome da empresa / Marca"
        },
        "incomeLabels": {
            "retired": "Pensão mensal",
            "unemployed": "Subsídios / Rendimentos",
            "student": "Bolsas / Rendimentos mensais",
            "apprentice": "Remuneração mensal",
            "civil_servant": "Vencimento mensal líquido",
            "selfEmployed": "Rendimento mensal médio"
        }
    },
    "ro": {
        "title": "Profilul Meu",
        "subtitle": "Gestionați informațiile personale și securitatea dvs.",
        "editButton": "Editare Profil",
        "cancelButton": "Anulare",
        "saveButton": "Salvare",
        "sections": {
            "identity": "Date Personale",
            "contact": "Date de Contact",
            "personal": "Situație Personală",
            "professional": "Situație Profesională",
            "financial": "Situație Financiară"
        },
        "fields": {
            "address": "Adresă de reședință",
            "zipCode": "Cod Poștal",
            "city": "Oraș",
            "country": "Țară",
            "phone": "Telefon mobil"
        },
        "companyLabels": {
            "student": "Instituție / Universitate",
            "apprentice": "Companie gazdă / Centru de formare",
            "independent": "Numele activității dvs.",
            "artisan": "Firmă / Denumire comercială",
            "civil_servant": "Minister / Administrație",
            "temporary": "Agenție de muncă temporară / Angajator",
            "liberal": "Cabinet / Denumire socială",
            "business_owner": "Numele companiei / Marcă"
        },
        "incomeLabels": {
            "retired": "Pensie lunară",
            "unemployed": "Alocații / Venituri",
            "student": "Burse / Venituri lunare",
            "apprentice": "Remunerație lunară",
            "civil_servant": "Salariu lunar net",
            "selfEmployed": "Venit lunar mediu"
        }
    },
    "sv": {
        "title": "Min Profil",
        "subtitle": "Hantera din personliga information och säkerhet.",
        "editButton": "Redigera Profil",
        "cancelButton": "Avbryt",
        "saveButton": "Spara",
        "sections": {
            "identity": "Personliga Uppgifter",
            "contact": "Kontaktuppgifter",
            "personal": "Personlig Situation",
            "professional": "Yrkesmässig Situation",
            "financial": "Ekonomisk Situation"
        },
        "fields": {
            "address": "Bostadsadress",
            "zipCode": "Postnummer",
            "city": "Stad",
            "country": "Land",
            "phone": "Mobiltelefon"
        },
        "companyLabels": {
            "student": "Skola / Universitet",
            "apprentice": "Värdföretag / Utbildningscenter",
            "independent": "Namn på din verksamhet",
            "artisan": "Företag / Handelsbeteckning",
            "civil_servant": "Ministerium / Förvaltning",
            "temporary": "Bemanningsföretag / Arbetsgivare",
            "liberal": "Byrå / Företagsnamn",
            "business_owner": "Företagsnamn / Varumärke"
        },
        "incomeLabels": {
            "retired": "Månadslig pension",
            "unemployed": "Bidrag / Inkomster",
            "student": "Stipendier / Månadsliga inkomster",
            "apprentice": "Månadslön",
            "civil_servant": "Netto månadslön",
            "selfEmployed": "Genomsnittlig månadslig inkomst"
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
    if not os.path.exists(path):
        print(f"SKIP {lang}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        lang_data = json.load(f)

    profile = lang_data.setdefault("Dashboard", {}).setdefault("Profile", {})
    deep_merge(data, profile)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f"OK {lang}")

print("All done!")
