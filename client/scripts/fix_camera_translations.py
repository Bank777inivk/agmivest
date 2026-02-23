import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
base_path = r"c:\Users\tesla\Videos\Nouvelle aventure\pret\client\messages"

camera_translations = {
    "fr": {
        "desktopError": {
          "title": "Vérification Mobile Uniquement",
          "message": "Cette vérification doit être effectuée depuis un smartphone pour des raisons de sécurité.",
          "copyLink": "Copier le lien",
          "linkCopied": "Lien copié !",
          "back": "Retour"
        },
        "status": {
          "accessing": "Accès caméra en cours...",
          "validatePhoto": "Valider la photo",
          "validateVideo": "Valider la vidéo",
          "finished": "Vérification terminée",
          "selfieTitle": "Selfie Photo",
          "videoTitle": "Selfie Vidéo"
        },
        "instructions": {
          "tapToStart": "Appuyez pour lancer",
          "turnLeft": "Tournez la tête à GAUCHE",
          "turnRight": "Tournez la tête à DROITE",
          "raiseHead": "Soulevez la tête",
          "perfect": "Parfait !"
        },
        "actions": {
          "retake": "Reprendre",
          "validate": "Valider",
          "upload": "Télécharger",
          "finalize": "Finaliser la vérification"
        },
        "confirmReset": "Voulez-vous vraiment effacer toutes les captures et recommencer ?",
        "submitting": {
          "title": "Transmission en cours",
          "message": "Nous sécurisons vos données et finalisons la liaison de votre profil de paiement.",
          "doneTitle": "Vérification Terminée",
          "doneMessage": "Votre identité a été soumise avec succès. Vous allez être redirigé...",
          "encryption": "Chiffrement AES-256 en cours"
        },
        "errors": {
          "saveSelfie": "Erreur de sauvegarde du selfie.",
          "saveVideo": "Erreur de sauvegarde vidéo.",
          "generic": "Une erreur est survenue lors de la validation.",
          "missingMedia": "Médias manquants",
          "uploadFailed": "Erreur lors de l'envoi des fichiers."
        }
    },
    "en": {
        "desktopError": {
          "title": "Mobile Verification Only",
          "message": "This verification must be performed from a smartphone for security reasons.",
          "copyLink": "Copy link",
          "linkCopied": "Link copied!",
          "back": "Back"
        },
        "status": {
          "accessing": "Accessing camera...",
          "validatePhoto": "Validate photo",
          "validateVideo": "Validate video",
          "finished": "Verification finished",
          "selfieTitle": "Selfie Photo",
          "videoTitle": "Selfie Video"
        },
        "instructions": {
          "tapToStart": "Tap to start",
          "turnLeft": "Turn your head LEFT",
          "turnRight": "Turn your head RIGHT",
          "raiseHead": "Raise your head",
          "perfect": "Perfect!"
        },
        "actions": {
          "retake": "Retake",
          "validate": "Validate",
          "upload": "Upload",
          "finalize": "Finalize verification"
        },
        "confirmReset": "Are you sure you want to clear all captures and start over?",
        "submitting": {
          "title": "Transmission in progress",
          "message": "We are securing your data and finalizing your payment profile link.",
          "doneTitle": "Verification Finished",
          "doneMessage": "Your identity has been successfully submitted. You will be redirected...",
          "encryption": "AES-256 encryption in progress"
        },
        "errors": {
          "saveSelfie": "Error saving selfie.",
          "saveVideo": "Error saving video.",
          "generic": "An error occurred during validation.",
          "missingMedia": "Missing media",
          "uploadFailed": "Error sending files."
        }
    },
    "es": {
        "desktopError": {
          "title": "Solo verificación móvil",
          "message": "Esta verificación debe realizarse desde un teléfono inteligente por razones de seguridad.",
          "copyLink": "Copiar enlace",
          "linkCopied": "¡Enlace copiado!",
          "back": "Volver"
        },
        "status": {
          "accessing": "Accediendo a la cámara...",
          "validatePhoto": "Validar foto",
          "validateVideo": "Validar video",
          "finished": "Verificación finalizada",
          "selfieTitle": "Foto Selfie",
          "videoTitle": "Video Selfie"
        },
        "instructions": {
          "tapToStart": "Toca para comenzar",
          "turnLeft": "Gira la cabeza a la IZQUIERDA",
          "turnRight": "Gira la cabeza a la DERECHA",
          "raiseHead": "Levanta la cabeza",
          "perfect": "¡Perfecto!"
        },
        "actions": {
          "retake": "Repetir",
          "validate": "Validar",
          "upload": "Subir",
          "finalize": "Finalizar verificación"
        },
        "confirmReset": "¿Estás seguro de que quieres borrar todas las capturas y empezar de nuevo?",
        "submitting": {
          "title": "Transmisión en curso",
          "message": "Estamos asegurando sus datos y finalizando el enlace de su perfil de pago.",
          "doneTitle": "Verificación finalizada",
          "doneMessage": "Su identidad ha sido enviada con éxito. Será redirigido...",
          "encryption": "Cifrado AES-256 en curso"
        },
        "errors": {
          "saveSelfie": "Error al guardar el selfie.",
          "saveVideo": "Error al guardar el video.",
          "generic": "Ocurrió un error durante la validación.",
          "missingMedia": "Faltan archivos multimedia",
          "uploadFailed": "Error al enviar archivos."
        }
    },
    "it": {
        "desktopError": {
          "title": "Solo verifica mobile",
          "message": "Questa verifica deve essere eseguita da uno smartphone per motivi di sicurezza.",
          "copyLink": "Copia link",
          "linkCopied": "Link copiato!",
          "back": "Indietro"
        },
        "status": {
          "accessing": "Accesso alla fotocamera...",
          "validatePhoto": "Valida foto",
          "validateVideo": "Valida video",
          "finished": "Verifica completata",
          "selfieTitle": "Foto Selfie",
          "videoTitle": "Video Selfie"
        },
        "instructions": {
          "tapToStart": "Tocca per iniziare",
          "turnLeft": "Gira la testa a SINISTRA",
          "turnRight": "Gira la testa a DESTRA",
          "raiseHead": "Alza la testa",
          "perfect": "Perfetto!"
        },
        "actions": {
          "retake": "Rifai",
          "validate": "Valida",
          "upload": "Carica",
          "finalize": "Finalizza verifica"
        },
        "confirmReset": "Sei sicuro di voler cancellare tutte le catture e ricominciare?",
        "submitting": {
          "title": "Trasmissione in corso",
          "message": "Stiamo mettendo in sicurezza i tuoi dati e finalizzando il collegamento del tuo profilo di pagamento.",
          "doneTitle": "Verifica completata",
          "doneMessage": "La tua identità è stata inviata con successo. Verrai reindirizzato...",
          "encryption": "Criptazione AES-256 in corso"
        },
        "errors": {
          "saveSelfie": "Errore nel salvataggio del selfie.",
          "saveVideo": "Errore nel salvataggio del video.",
          "generic": "Si è verificato un errore durante la validazione.",
          "missingMedia": "Media mancanti",
          "uploadFailed": "Errore nell'invio dei file."
        }
    },
    "de": {
        "desktopError": {
          "title": "Nur mobile Verifizierung",
          "message": "Diese Verifizierung muss aus Sicherheitsgründen von einem Smartphone aus durchgeführt werden.",
          "copyLink": "Link kopieren",
          "linkCopied": "Link kopiert!",
          "back": "Zurück"
        },
        "status": {
          "accessing": "Kamerazugriff...",
          "validatePhoto": "Foto bestätigen",
          "validateVideo": "Video bestätigen",
          "finished": "Verifizierung abgeschlossen",
          "selfieTitle": "Selfie-Foto",
          "videoTitle": "Selfie-Video"
        },
        "instructions": {
          "tapToStart": "Zum Starten tippen",
          "turnLeft": "Kopf nach LINKS drehen",
          "turnRight": "Kopf nach RECHTS drehen",
          "raiseHead": "Kopf anheben",
          "perfect": "Perfekt!"
        },
        "actions": {
          "retake": "Wiederholen",
          "validate": "Bestätigen",
          "upload": "Hochladen",
          "finalize": "Verifizierung abschließen"
        },
        "confirmReset": "Sind Sie sicher, dass Sie alle Aufnahmen löschen und neu beginnen möchten?",
        "submitting": {
          "title": "Übertragung läuft",
          "message": "Wir sichern Ihre Daten und schließen die Verknüpfung Ihres Zahlungsprofils ab.",
          "doneTitle": "Verifizierung abgeschlossen",
          "doneMessage": "Ihre Identität wurde erfolgreich übermittelt. Sie werden weitergeleitet...",
          "encryption": "AES-256-Verschlüsselung läuft"
        },
        "errors": {
          "saveSelfie": "Fehler beim Speichern des Selfies.",
          "saveVideo": "Fehler beim Speichern des Videos.",
          "generic": "Bei der Validierung ist un Fehler aufgetreten.",
          "missingMedia": "Fehlende Medien",
          "uploadFailed": "Fehler beim Senden der Dateien."
        }
    },
    "nl": {
        "desktopError": {
          "title": "Alleen mobiele verificatie",
          "message": "Deze verificatie moet om veiligheidsredenen vanaf een smartphone worden uitgevoerd.",
          "copyLink": "Link kopiëren",
          "linkCopied": "Link gekopieerd!",
          "back": "Terug"
        },
        "status": {
          "accessing": "Toegang tot camera...",
          "validatePhoto": "Foto valideren",
          "validateVideo": "Video valideren",
          "finished": "Verificatie voltooid",
          "selfieTitle": "Selfie Foto",
          "videoTitle": "Selfie Video"
        },
        "instructions": {
          "tapToStart": "Tik om te starten",
          "turnLeft": "Draai hoofd naar LINKS",
          "turnRight": "Draai hoofd naar RECHTS",
          "raiseHead": "Hef je hoofd op",
          "perfect": "Perfect!"
        },
        "actions": {
          "retake": "Opnieuw proberen",
          "validate": "Valideren",
          "upload": "Uploaden",
          "finalize": "Verificatie voltooien"
        },
        "confirmReset": "Weet u zeker dat u alle opnames wilt wissen en opnieuw wilt beginnen?",
        "submitting": {
          "title": "Verzending bezig",
          "message": "We beveiligen uw gegevens en voltooien de koppeling van uw betalingsprofiel.",
          "doneTitle": "Verificatie voltooid",
          "doneMessage": "Uw identiteit is succesvol verzonden. U wordt doorgeleid...",
          "encryption": "AES-256 versleuteling bezig"
        },
        "errors": {
          "saveSelfie": "Fout bij opslaan selfie.",
          "saveVideo": "Fout bij opslaan video.",
          "generic": "Er is een fout opgetreden tijdens de validatie.",
          "missingMedia": "Ontbrekende media",
          "uploadFailed": "Fout bij verzenden bestanden."
        }
    },
    "pl": {
        "desktopError": {
          "title": "Tylko weryfikacja mobilna",
          "message": "Ze względów bezpieczeństwa weryfikacja ta musi zostać przeprowadzona ze smartfona.",
          "copyLink": "Kopiuj link",
          "linkCopied": "Link skopiowany!",
          "back": "Wróć"
        },
        "status": {
          "accessing": "Dostęp do kamery...",
          "validatePhoto": "Zatwierdź zdjęcie",
          "validateVideo": "Zatwierdź wideo",
          "finished": "Weryfikacja zakończona",
          "selfieTitle": "Zdjęcie Selfie",
          "videoTitle": "Wideo Selfie"
        },
        "instructions": {
          "tapToStart": "Dotknij, aby rozpocząć",
          "turnLeft": "Obróć głowę w LEWO",
          "turnRight": "Obróć głowę w PRAWO",
          "raiseHead": "Unieś głowę",
          "perfect": "Idealnie!"
        },
        "actions": {
          "retake": "Ponów",
          "validate": "Zatwierdź",
          "upload": "Prześlij",
          "finalize": "Zakończ weryfikację"
        },
        "confirmReset": "Czy na pewno chcesz wyczyścić wszystkie nagrania i zacząć od nowa?",
        "submitting": {
          "title": "Trwa przesyłanie",
          "message": "Zabezpieczamy Twoje dane i finalizujemy powiązanie Twojego profilu płatności.",
          "doneTitle": "Weryfikacja zakończona",
          "doneMessage": "Twoja tożsamość została pomyślnie przesłana. Zostaniesz przekierowany...",
          "encryption": "Szyfrowanie AES-256 w toku"
        },
        "errors": {
          "saveSelfie": "Błąd podczas zapisywania selfie.",
          "saveVideo": "Błąd podczas zapisywania wideo.",
          "generic": "Wystąpił błąd podczas walidacji.",
          "missingMedia": "Brak multimediów",
          "uploadFailed": "Błąd podczas wysyłania plików."
        }
    },
    "pt": {
        "desktopError": {
          "title": "Apenas Verificação Móvel",
          "message": "Esta verificação deve ser realizada a partir de um smartphone por razões de segurança.",
          "copyLink": "Copiar link",
          "linkCopied": "Link copiado!",
          "back": "Voltar"
        },
        "status": {
          "accessing": "Aceder à câmara...",
          "validatePhoto": "Validar foto",
          "validateVideo": "Validar vídeo",
          "finished": "Verificação concluída",
          "selfieTitle": "Foto Selfie",
          "videoTitle": "Vídeo Selfie"
        },
        "instructions": {
          "tapToStart": "Toque para iniciar",
          "turnLeft": "Vire a cabeça para a ESQUERDA",
          "turnRight": "Vire a cabeça para a DIREITA",
          "raiseHead": "Levante a cabeça",
          "perfect": "Perfeito!"
        },
        "actions": {
          "retake": "Repetir",
          "validate": "Validar",
          "upload": "Carregar",
          "finalize": "Finalizar verificação"
        },
        "confirmReset": "Tem certeza de que deseja apagar todas as capturas e recomeçar?",
        "submitting": {
          "title": "Transmissão em curso",
          "message": "Estamos a assegurar os seus dados e a finalizar a ligação do seu perfil de pagamento.",
          "doneTitle": "Verificação concluída",
          "doneMessage": "A sua identidade foi submetida com sucesso. Será redirecionado...",
          "encryption": "Encriptação AES-256 em curso"
        },
        "errors": {
          "saveSelfie": "Erro ao guardar o selfie.",
          "saveVideo": "Erro ao guardar o vídeo.",
          "generic": "Ocorreu um erro durante a validação.",
          "missingMedia": "Meios de comunicação em falta",
          "uploadFailed": "Erro ao enviar ficheiros."
        }
    },
    "ro": {
        "desktopError": {
          "title": "Vificare doar pe mobil",
          "message": "Această verificare trebuie efectuată de pe un smartphone din motive de securitate.",
          "copyLink": "Copiază link",
          "linkCopied": "Link copiat!",
          "back": "Înapoi"
        },
        "status": {
          "accessing": "Accesare cameră...",
          "validatePhoto": "Validează foto",
          "validateVideo": "Validează video",
          "finished": "Verificare finalizată",
          "selfieTitle": "Foto Selfie",
          "videoTitle": "Video Selfie"
        },
        "instructions": {
          "tapToStart": "Apasă pentru a începe",
          "turnLeft": "Întoarce capul la STÂNGA",
          "turnRight": "Întoarce capul la DREAPTA",
          "raiseHead": "Ridică capul",
          "perfect": "Perfect!"
        },
        "actions": {
          "retake": "Reia",
          "validate": "Validează",
          "upload": "Încarcă",
          "finalize": "Finalizează verificarea"
        },
        "confirmReset": "Ești sigur că vrei să ștergi toate capturile și să o iei de la capăt?",
        "submitting": {
          "title": "Transmitere în curs",
          "message": "Vă securizăm datele și finalizăm legătura profilului dumneavoastră de plată.",
          "doneTitle": "Verificare finalizată",
          "doneMessage": "Identitatea dumneavoastră a fost trimisă cu succes. Veți fi redirecționat...",
          "encryption": "Criptare AES-256 în curs"
        },
        "errors": {
          "saveSelfie": "Eroare la salvarea selfie-ului.",
          "saveVideo": "Eroare la salvarea videoclipului.",
          "generic": "A apărut o eroare în timpul validării.",
          "missingMedia": "Media lipsă",
          "uploadFailed": "Eroare la trimiterea fișierelor."
        }
    },
    "sv": {
        "desktopError": {
          "title": "Endast mobilverifiering",
          "message": "Denna verifiering måste utföras från en smartphone av säkerhetsskäl.",
          "copyLink": "Kopiera länk",
          "linkCopied": "Länk kopierad!",
          "back": "Tillbaka"
        },
        "status": {
          "accessing": "Åtkomst till kameran...",
          "validatePhoto": "Validera foto",
          "validateVideo": "Validera video",
          "finished": "Verifiering klar",
          "selfieTitle": "Selfie-foto",
          "videoTitle": "Selfie-video"
        },
        "instructions": {
          "tapToStart": "Tryck för att starta",
          "turnLeft": "Vrid huvudet åt VÄNSTER",
          "turnRight": "Vrid huvudet åt HÖGER",
          "raiseHead": "Lyft på huvudet",
          "perfect": "Perfekt!"
        },
        "actions": {
          "retake": "Gör om",
          "validate": "Validera",
          "upload": "Ladda upp",
          "finalize": "Slutför verifiering"
        },
        "confirmReset": "Är du säker på att du vill rensa alla bilder och börja om?",
        "submitting": {
          "title": "Överföring pågår",
          "message": "Vi säkrar dina data och slutför kopplingen av din betalningsprofil.",
          "doneTitle": "Verifiering klar",
          "doneMessage": "Din identitet har skickats in framgångsrikt. Du kommer att vidarestyras...",
          "encryption": "AES-256-kryptering pågår"
        },
        "errors": {
          "saveSelfie": "Fel vid sparande av selfie.",
          "saveVideo": "Fel vid sparande av video.",
          "generic": "Ett fel uppstod vid valideringen.",
          "missingMedia": "Media saknas",
          "uploadFailed": "Fel vid sändning av filer."
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

        if "Dashboard" in data and "Verification" in data["Dashboard"]:
            data["Dashboard"]["Verification"]["Camera"] = camera_translations[lang]

            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Added Camera namespace to {lang}.json")
    except Exception as e:
        print(f"Error in {lang}.json: {e}")
