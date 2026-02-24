import json
import os

languages = ["fr", "en", "de", "es", "it", "nl", "pl", "pt", "ro", "sv"]
base_dir = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

# New labels to add to CreditRequest.Finances.Labels
new_labels = {
    "cdi": {
        "fr": "Nom de l'entreprise",
        "en": "Company name",
        "de": "Firmenname",
        "es": "Nombre de la empresa",
        "it": "Nome dell'azienda",
        "nl": "Bedrijfsnaam",
        "pl": "Nazwa firmy",
        "pt": "Nome da empresa",
        "ro": "Numele companiei",
        "sv": "Företagsnamn"
    },
    "cdd": {
        "fr": "Nom de l'entreprise",
        "en": "Company name",
        "de": "Firmenname",
        "es": "Nombre de la empresa",
        "it": "Nome dell'azienda",
        "nl": "Bedrijfsnaam",
        "pl": "Nazwa firmy",
        "pt": "Nome da empresa",
        "ro": "Numele companiei",
        "sv": "Företagsnamn"
    },
    "temporary": {
        "fr": "Société d'intérim / Employeur",
        "en": "Temp agency / Employer",
        "de": "Zeitarbeitsfirma / Arbeitgeber",
        "es": "Agencia de trabajo temporal / Empleador",
        "it": "Agenzia interinale / Datore di lavoro",
        "nl": "Uitzendbureau / Werkgever",
        "pl": "Agencja pracy tymczasowej / Pracodawca",
        "pt": "Agência de trabalho temporário / Empregador",
        "ro": "Agenție de recrutare / Angajator",
        "sv": "Bemanningsföretag / Arbetsgivare"
    },
    "profession_cdi": {
        "fr": "Profession actuelle",
        "en": "Current profession",
        "de": "Aktueller Beruf",
        "es": "Profesión actual",
        "it": "Professione attuale",
        "nl": "Huidig beroep",
        "pl": "Aktualny zawód",
        "pt": "Profissão atual",
        "ro": "Profesia actuală",
        "sv": "Nuvarande yrke"
    },
    "profession_cdd": {
        "fr": "Profession actuelle",
        "en": "Current profession",
        "de": "Aktueller Beruf",
        "es": "Profesión actual",
        "it": "Professione actuelle",
        "nl": "Huidig beroep",
        "pl": "Aktualny zawód",
        "pt": "Profissão atual",
        "ro": "Profesia actuală",
        "sv": "Nuvarande yrke"
    },
    "profession_temporary": {
        "fr": "Profession actuelle",
        "en": "Current profession",
        "de": "Aktueller Beruf",
        "es": "Profesión actual",
        "it": "Professione attuale",
        "nl": "Huidig beroep",
        "pl": "Aktualny zawód",
        "pt": "Profissão atual",
        "ro": "Profesia actuală",
        "sv": "Nuvarande yrke"
    }
}

credit_success_translations = {
    "fr": {
        "title": "Soumission réussie !",
        "message": "Félicitations ! Votre demande de prêt a été transmise avec succès à nos experts. Votre dossier est désormais en cours d'analyse.",
        "cta": "Accéder à mon espace client",
        "home": "Retour à l'accueil",
        "footer": "Une question ? Notre support est disponible 24/7.",
        "Step1": {"title": "Vérification", "desc": "Votre identité a été validée par OTP."},
        "Step2": {"title": "Analyse", "desc": "Réponse définitive sous 24h ouvrées."}
    },
    "en": {
        "title": "Submission successful!",
        "message": "Congratulations! Your loan request has been successfully transmitted to our experts. Your application is now being analyzed.",
        "cta": "Access my client area",
        "home": "Back to home",
        "footer": "Any questions? Our support is available 24/7.",
        "Step1": {"title": "Verification", "desc": "Your identity has been validated by OTP."},
        "Step2": {"title": "Analysis", "desc": "Final response within 24 business hours."}
    },
    "de": {
        "title": "Einreichung erfolgreich!",
        "message": "Herzlichen Glückwunsch! Ihr Kreditantrag wurde erfolgreich an unsere Experten übermittelt. Ihr Dossier wird nun analysiert.",
        "cta": "Meinen Kundenbereich aufrufen",
        "home": "Zurück zur Startseite",
        "footer": "Haben Sie Fragen? Unser Support ist rund um die Uhr für Sie da.",
        "Step1": {"title": "Verifizierung", "desc": "Ihre Identität wurde per OTP validiert."},
        "Step2": {"title": "Analyse", "desc": "Endgültige Antwort innerhalb von 24 Arbeitsstunden."}
    },
    "es": {
        "title": "¡Envío exitoso!",
        "message": "¡Felicidades! Su solicitud de préstamo ha sido enviada con éxito a nuestros expertos. Su expediente está ahora siendo analizado.",
        "cta": "Acceder a mi espacio cliente",
        "home": "Volver al inicio",
        "footer": "¿Tiene alguna pregunta? Nuestro soporte está disponible 24/7.",
        "Step1": {"title": "Verificación", "desc": "Su identidad ha sido validada por OTP."},
        "Step2": {"title": "Análisis", "desc": "Respuesta definitiva en 24 horas hábiles."}
    },
    "it": {
        "title": "Invio riuscito!",
        "message": "Congratulazioni! La tua richiesta di prestito è stata trasmessa con successo ai nostri esperti. La tua pratica è ora in fase di analisi.",
        "cta": "Accedi alla mia area cliente",
        "home": "Torna alla home",
        "footer": "Hai domande? Il nostro supporto è disponibile 24 ore su 24, 7 giorni su 7.",
        "Step1": {"title": "Verifica", "desc": "La tua identità è stata convalidata tramite OTP."},
        "Step2": {"title": "Analisi", "desc": "Risposta definitiva entro 24 ore lavorative."}
    },
    "nl": {
        "title": "Indiening geslaagd!",
        "message": "Gefeliciteerd! Uw leningaanvraag is succesvol doorgegeven aan onze experts. Uw dossier wordt nu geanalyseerd.",
        "cta": "Naar mijn klanthoek",
        "home": "Terug naar startpagina",
        "footer": "Vragen? Onze ondersteuning is 24/7 beschikbaar.",
        "Step1": {"title": "Verificatie", "desc": "Uw identiteit is gevalideerd via OTP."},
        "Step2": {"title": "Analyse", "desc": "Definitief antwoord binnen 24 werkuren."}
    },
    "pl": {
        "title": "Przesłanie zakończone sukcesem!",
        "message": "Gratulacje! Twój wniosek kredytowy został pomyślnie przekazany naszym ekspertom. Twoja sprawa jest obecnie analizowana.",
        "cta": "Przejdź do panelu klienta",
        "home": "Powrót do strony głównej",
        "footer": "Masz pytania? Nasze wsparcie jest dostępne 24/7.",
        "Step1": {"title": "Weryfikacja", "desc": "Twoja tożsamość została zweryfikowana za pomocą kodu OTP."},
        "Step2": {"title": "Analiza", "desc": "Ostateczna odpowiedź w ciągu 24 godzin roboczych."}
    },
    "pt": {
        "title": "Submissão bem-sucedida!",
        "message": "Parabéns! O seu pedido de empréstimo foi transmitido com sucesso aos nossos especialistas. O seu processo está agora a ser analisado.",
        "cta": "Aceder à minha área de cliente",
        "home": "Voltar ao início",
        "footer": "Dúvidas? O nosso suporte está disponível 24/7.",
        "Step1": {"title": "Verificação", "desc": "A sua identidade foi validada por OTP."},
        "Step2": {"title": "Análise", "desc": "Resposta definitiva em 24 horas úteis."}
    },
    "ro": {
        "title": "Trimitere reușită!",
        "message": "Felicitări! Cererea dumneavoastră de împrumut a fost transmisă cu succes experților noștri. Dosarul dumneavoastră este acum în curs de analiză.",
        "cta": "Accesează spațiul meu client",
        "home": "Înapoi la pagina principală",
        "footer": "Aveți întrebări? Suportul nostru este disponibil 24/7.",
        "Step1": {"title": "Verificare", "desc": "Identitatea dumneavoastră a fost validată prin OTP."},
        "Step2": {"title": "Analiză", "desc": "Răspuns definitiv în 24 de ore lucrătoare."}
    },
    "sv": {
        "title": "Inskickat!",
        "message": "Grattis! Din låneansökan har skickats till våra experter. Ditt ärende analyseras nu.",
        "cta": "Till min kundavdelning",
        "home": "Tillbaka till startsidan",
        "footer": "Frågor? Vår support är tillgänglig 24/7.",
        "Step1": {"title": "Verifiering", "desc": "Din identitet har validerats via OTP."},
        "Step2": {"title": "Analys", "desc": "Slutgiltigt svar inom 24 arbetstimmar."}
    }
}

for lang in languages:
    path = os.path.join(base_dir, f"{lang}.json")
    if not os.path.exists(path):
        print(f"Skipping {lang} as it doesn't exist.")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Update CreditRequest.Finances.Labels
    if "CreditRequest" in data and "Finances" in data["CreditRequest"] and "Labels" in data["CreditRequest"]["Finances"]:
        labels = data["CreditRequest"]["Finances"]["Labels"]
        for key, trans in new_labels.items():
            if key not in labels:
                labels[key] = trans.get(lang, trans.get("en"))
    
    # Add or Overwrite CreditSuccess
    data["CreditSuccess"] = credit_success_translations.get(lang, credit_success_translations.get("en"))
        
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {lang}.json")
