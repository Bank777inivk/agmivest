import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

notification_translations = {
    "fr": {
        "requestSubmitted": {
            "title": "Demande de prêt soumise 📄",
            "message": "Votre demande de prêt de {amount} a été enregistrée avec succès."
        },
        "transferInitiated": {
            "title": "Virement initié 🚀",
            "message": "Votre virement de {amount} est en cours de traitement."
        },
        "newMessage": {
            "title": "Nouveau message 💬",
            "message": "Vous avez reçu un nouveau message de votre conseiller."
        },
        "statusUpdate": {
            "title": "Mise à jour du dossier 🔔",
            "message": "Le statut de votre dossier a été mis à jour."
        },
        "verified": {
            "title": "Identité vérifiée ✅",
            "message": "Félicitations ! Votre identité a été validée avec succès."
        },
        "rejected": {
            "title": "Identité refusée ❌",
            "message": "Votre vérification d'identité a été refusée. Veuillez vérifier vos documents."
        },
        "partialRejection": {
            "title": "Documents incomplets ⚠️",
            "message": "Certains documents de votre dossier doivent être complétés."
        },
        "verificationSubmitted": {
            "title": "Vérification soumise 🛡️",
            "message": "Vos documents d'identité sont en cours d'examen."
        }
    },
    "en": {
        "requestSubmitted": {
            "title": "Loan request submitted 📄",
            "message": "Your loan request for {amount} has been successfully registered."
        },
        "transferInitiated": {
            "title": "Transfer initiated 🚀",
            "message": "Your transfer of {amount} is being processed."
        },
        "newMessage": {
            "title": "New message 💬",
            "message": "You have received a new message from your advisor."
        },
        "statusUpdate": {
            "title": "File status updated 🔔",
            "message": "Your file status has been updated."
        },
        "verified": {
            "title": "Identity verified ✅",
            "message": "Congratulations! Your identity has been successfully validated."
        },
        "rejected": {
            "title": "Identity rejected ❌",
            "message": "Your identity verification has been rejected. Please check your documents."
        },
        "partialRejection": {
            "title": "Incomplete documents ⚠️",
            "message": "Some documents in your file need to be completed."
        },
        "verificationSubmitted": {
            "title": "Verification submitted 🛡️",
            "message": "Your identity documents are being reviewed."
        }
    },
    "es": {
        "requestSubmitted": {
            "title": "Solicitud de préstamo enviada 📄",
            "message": "Su solicitud de préstamo de {amount} ha sido registrada con éxito."
        },
        "transferInitiated": {
            "title": "Transferencia iniciada 🚀",
            "message": "Su transferencia de {amount} está siendo procesada."
        },
        "newMessage": {
            "title": "Nuevo mensaje 💬",
            "message": "Ha recibido un nuevo mensaje de su asesor."
        },
        "statusUpdate": {
            "title": "Estado del expediente actualizado 🔔",
            "message": "El estado de su expediente ha sido actualizado."
        },
        "verified": {
            "title": "Identidad verificada ✅",
            "message": "¡Felicidades! Su identidad ha sido validada con éxito."
        },
        "rejected": {
            "title": "Identidad rechazada ❌",
            "message": "Su verificación de identidad ha sido rechazada. Por favor, revise sus documentos."
        },
        "partialRejection": {
            "title": "Documentos incompletos ⚠️",
            "message": "Algunos documentos de su expediente deben ser completados."
        },
        "verificationSubmitted": {
            "title": "Verificación enviada 🛡️",
            "message": "Sus documentos de identidad están siendo revisados."
        }
    },
    "it": {
        "requestSubmitted": {
            "title": "Richiesta di prestito inviata 📄",
            "message": "La sua richiesta di prestito di {amount} è stata registrata con successo."
        },
        "transferInitiated": {
            "title": "Bonifico avviato 🚀",
            "message": "Il suo bonifico di {amount} è in fase di elaborazione."
        },
        "newMessage": {
            "title": "Nuovo messaggio 💬",
            "message": "Ha ricevuto un nuovo messaggio dal suo consulente."
        },
        "statusUpdate": {
            "title": "Stato pratica aggiornato 🔔",
            "message": "Lo stato della sua pratica è stato aggiornato."
        },
        "verified": {
            "title": "Identità verificata ✅",
            "message": "Congratulazioni! La sua identità è stata convalidata con successo."
        },
        "rejected": {
            "title": "Identità rifiutata ❌",
            "message": "La sua verifica dell'identità è stata rifiutata. Si prega di controllare i documenti."
        },
        "partialRejection": {
            "title": "Documenti incompleti ⚠️",
            "message": "Alcuni documenti nella sua pratica devono essere completati."
        },
        "verificationSubmitted": {
            "title": "Verifica inviata 🛡️",
            "message": "I suoi documenti d'identità sono in fase di revisione."
        }
    },
    "de": {
        "requestSubmitted": {
            "title": "Kreditantrag eingereicht 📄",
            "message": "Ihr Kreditantrag über {amount} wurde erfolgreich registriert."
        },
        "transferInitiated": {
            "title": "Überweisung eingeleitet 🚀",
            "message": "Ihre Überweisung von {amount} wird bearbeitet."
        },
        "newMessage": {
            "title": "Neue Nachricht 💬",
            "message": "Sie haben eine neue Nachricht von Ihrem Berater erhalten."
        },
        "statusUpdate": {
            "title": "Dateistatus aktualisiert 🔔",
            "message": "Ihr Dateistatus wurde aktualisiert."
        },
        "verified": {
            "title": "Identität verifiziert ✅",
            "message": "Herzlichen Glückwunsch! Ihre Identität wurde erfolgreich validiert."
        },
        "rejected": {
            "title": "Identität abgelehnt ❌",
            "message": "Ihre Identitätsprüfung wurde abgelehnt. Bitte überprüfen Sie Ihre Dokumente."
        },
        "partialRejection": {
            "title": "Unvollständige Dokumente ⚠️",
            "message": "Einige Dokumente in Ihrer Akte müssen vervollständigt werden."
        },
        "verificationSubmitted": {
            "title": "Prüfung eingereicht 🛡️",
            "message": "Ihre Ausweisdokumente werden geprüft."
        }
    },
    "nl": {
        "requestSubmitted": {
            "title": "Leningaanvraag ingediend 📄",
            "message": "Uw leningaanvraag voor {amount} is succesvol geregistreerd."
        },
        "transferInitiated": {
            "title": "Overboeking geïnitieerd 🚀",
            "message": "Uw overboeking van {amount} wordt verwerkt."
        },
        "newMessage": {
            "title": "Nieuw bericht 💬",
            "message": "U heeft een nieuw bericht ontvangen van uw adviseur."
        },
        "statusUpdate": {
            "title": "Bestandsstatus bijgewerkt 🔔",
            "message": "Uw bestandsstatus is bijgewerkt."
        },
        "verified": {
            "title": "Identiteit geverifieerd ✅",
            "message": "Gefeliciteerd! Uw identiteit is succesvol gevalideerd."
        },
        "rejected": {
            "title": "Identiteit afgewezen ❌",
            "message": "Uw identiteitsverificatie is afgewezen. Controleer uw documenten."
        },
        "partialRejection": {
            "title": "Onvolledige documenten ⚠️",
            "message": "Sommige documenten in uw dossier moeten worden aangevuld."
        },
        "verificationSubmitted": {
            "title": "Verificatie ingediend 🛡️",
            "message": "Uw identiteitsdocumenten worden beoordeeld."
        }
    },
    "pl": {
        "requestSubmitted": {
            "title": "Wniosek o pożyczkę złożony 📄",
            "message": "Twój wniosek o pożyczkę na kwotę {amount} został pomyślnie zarejestrowany."
        },
        "transferInitiated": {
            "title": "Przelew zainicjowany 🚀",
            "message": "Twój przelew na kwotę {amount} jest w trakcie przetwarzania."
        },
        "newMessage": {
            "title": "Nowa wiadomość 💬",
            "message": "Otrzymałeś nową wiadomość od swojego doradcy."
        },
        "statusUpdate": {
            "title": "Status pliku zaktualizowany 🔔",
            "message": "Status Twojego pliku został zaktualizowany."
        },
        "verified": {
            "title": "Tożsamość zweryfikowana ✅",
            "message": "Gratulacje! Twoja tożsamość została pomyślnie zweryfikowana."
        },
        "rejected": {
            "title": "Tożsamość odrzucona ❌",
            "message": "Twoja weryfikacja tożsamości została odrzucona. Proszę sprawdzić swoje dokumenty."
        },
        "partialRejection": {
            "title": "Niekompletne dokumenty ⚠️",
            "message": "Niektóre dokumenty w Twojej kartotece wymagają uzupełnienia."
        },
        "verificationSubmitted": {
            "title": "Weryfikacja przesłana 🛡️",
            "message": "Twoje dokumenty tożsamości są w trakcie sprawdzania."
        }
    },
    "pt": {
        "requestSubmitted": {
            "title": "Pedido de empréstimo submetido 📄",
            "message": "O seu pedido de empréstimo de {amount} foi registado com sucesso."
        },
        "transferInitiated": {
            "title": "Transferência iniciada 🚀",
            "message": "A sua transferência de {amount} está a ser processada."
        },
        "newMessage": {
            "title": "Nova mensagem 💬",
            "message": "Recebeu uma nova mensagem do seu consultor."
        },
        "statusUpdate": {
            "title": "Estado do processo atualizado 🔔",
            "message": "O estado do seu processo foi atualizado."
        },
        "verified": {
            "title": "Identidade verificada ✅",
            "message": "Parabéns! A sua identidade foi validada com sucesso."
        },
        "rejected": {
            "title": "Identidade rejeitada ❌",
            "message": "A sua verificação de identidade foi rejeitada. Por favor, verifique os seus documentos."
        },
        "partialRejection": {
            "title": "Documentos incompletos ⚠️",
            "message": "Alguns documentos no seu processo precisam de ser completados."
        },
        "verificationSubmitted": {
            "title": "Verificação submetida 🛡️",
            "message": "Os seus documentos de identidade estão a ser analisados."
        }
    },
    "ro": {
        "requestSubmitted": {
            "title": "Cerere de împrumut trimisă 📄",
            "message": "Cererea dumneavoastră de împrumut pentru {amount} a fost înregistrată cu succes."
        },
        "transferInitiated": {
            "title": "Transfer inițiat 🚀",
            "message": "Transferul dumneavoastră de {amount} este în curs de procesare."
        },
        "newMessage": {
            "title": "Mesaj nou 💬",
            "message": "Ați primit un mesaj nou de la consilierul dumneavoastră."
        },
        "statusUpdate": {
            "title": "Starea dosarului actualizată 🔔",
            "message": "Starea dosarului dumneavoastră a fost actualizată."
        },
        "verified": {
            "title": "Identitate verificată ✅",
            "message": "Felicitări! Identitatea dumneavoastră a fost validată cu succes."
        },
        "rejected": {
            "title": "Identitate respinsă ❌",
            "message": "Verificarea identității dumneavoastră a fost respinsă. Vă rugăm să verificați documentele."
        },
        "partialRejection": {
            "title": "Documente incomplete ⚠️",
            "message": "Unele documente din dosarul dumneavoastră trebuie completate."
        },
        "verificationSubmitted": {
            "title": "Verificare trimisă 🛡️",
            "message": "Documentele dumneavoastră de identitate sunt în curs de examinare."
        }
    },
    "sv": {
        "requestSubmitted": {
            "title": "Låneansökan skickad 📄",
            "message": "Din låneansökan på {amount} har registrerats framgångsrikt."
        },
        "transferInitiated": {
            "title": "Överföring initierad 🚀",
            "message": "Din överföring på {amount} behandlas."
        },
        "newMessage": {
            "title": "Nytt meddelande 💬",
            "message": "Du har fått ett nytt meddelande från din rådgivare."
        },
        "statusUpdate": {
            "title": "Filstatus uppdaterad 🔔",
            "message": "Din filstatus har uppdaterats."
        },
        "verified": {
            "title": "Identitet verifierad ✅",
            "message": "Grattis! Din identitet har validerats framgångsrikt."
        },
        "rejected": {
            "title": "Identitet avvisad ❌",
            "message": "Din identitetsverifiering har avvisats. Kontrollera dina dokument."
        },
        "partialRejection": {
            "title": "Ofullständiga dokument ⚠️",
            "message": "Vissa dokument i din fil behöver kompletteras."
        },
        "verificationSubmitted": {
            "title": "Verifiering skickad 🛡️",
            "message": "Dina identitetshandlingar granskas."
        }
    }
}

for lang in languages:
    file_path = os.path.join(base_path, f"{lang}.json")
    if not os.path.exists(file_path):
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if "Dashboard" not in data:
            data["Dashboard"] = {}
        
        data["Dashboard"]["Notifications"] = notification_translations[lang]

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Added Dashboard.Notifications to {lang}.json")

    except Exception as e:
        print(f"Error in {lang}.json: {e}")
