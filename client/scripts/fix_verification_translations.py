
import json
import os

languages = ["fr", "en", "es", "it", "de", "nl", "pl", "pt", "ro", "sv"]
messages_dir = "c:/Users/tesla/Videos/Nouvelle aventure/pret/client/messages"

verification_data = {
    "fr": {
        "title": "Vérification de sécurité",
        "subtitle": "Un code de vérification a été envoyé à <important>{email}</important>",
        "instruction": "Saisissez le code à 6 chiffres pour continuer.",
        "spamHint": "Consultez vos spams. S'il s'y trouve, marquez-le comme 'Non-spam' pour recevoir nos prochaines notifications.",
        "verify": "Vérifier",
        "resend": "Renvoyer le code",
        "invalidCode": "Code invalide ou expiré.",
        "success": "Email vérifié avec succès !"
    },
    "en": {
        "title": "Security Verification",
        "subtitle": "A verification code has been sent to <important>{email}</important>",
        "instruction": "Enter the 6-digit code to continue.",
        "spamHint": "Check your spam folder. If found, mark it as 'Not spam' to receive future notifications.",
        "verify": "Verify",
        "resend": "Resend code",
        "invalidCode": "Invalid or expired code.",
        "success": "Email successfully verified!"
    },
    "es": {
        "title": "Verificación de seguridad",
        "subtitle": "Se ha enviado un código de verificación a <important>{email}</important>",
        "instruction": "Introduce el código de 6 dígitos para continuar.",
        "spamHint": "Revisa tu carpeta de spam. Si lo encuentras, márcalo como 'No es spam' para recibir futuras notificaciones.",
        "verify": "Verificar",
        "resend": "Reenviar código",
        "invalidCode": "Código inválido o caducado.",
        "success": "¡Correo electrónico verificado con éxito!"
    },
    "it": {
        "title": "Verifica di sicurezza",
        "subtitle": "Un codice di verifica è stato inviato a <important>{email}</important>",
        "instruction": "Inserisci il codice a 6 cifre per continuare.",
        "spamHint": "Controlla la cartella spam. Se lo trovi, contrassegnalo come 'Non spam' per ricevere notifiche future.",
        "verify": "Verifica",
        "resend": "Reinvia codice",
        "invalidCode": "Codice non valido o scaduto.",
        "success": "Email verificata con successo!"
    },
    "de": {
        "title": "Sicherheitsüberprüfung",
        "subtitle": "Ein Bestätigungscode wurde an <important>{email}</important> gesendet",
        "instruction": "Geben Sie den 6-stelligen Code ein, um fortzufahren.",
        "spamHint": "Überprüfen Sie Ihren Spam-Ordner. Wenn Sie ihn dort finden, markieren Sie ihn als 'Kein Spam', um zukünftige Benachrichtigungen zu erhalten.",
        "verify": "Verifizieren",
        "resend": "Code erneut senden",
        "invalidCode": "Ungültiger oder abgelaufener Code.",
        "success": "Email erfolgreich verifiziert!"
    },
    "nl": {
        "title": "Veiligheidsverificatie",
        "subtitle": "Er is een verificatiecode verzonden naar <important>{email}</important>",
        "instruction": "Voer de 6-cijferige code in om door te gaan.",
        "spamHint": "Controleer uw spambox. Als u de code daar vindt, markeer deze dan als 'Geen spam' om toekomstige meldingen te ontvangen.",
        "verify": "Verifiëren",
        "resend": "Code opnieuw verzenden",
        "invalidCode": "Ongeldige of verlopen code.",
        "success": "E-mail succesvol geverifieerd!"
    },
    "pl": {
        "title": "Weryfikacja bezpieczeństwa",
        "subtitle": "Kod weryfikacyjny został wysłany na adres <important>{email}</important>",
        "instruction": "Wprowadź 6-cyfrowy kod, aby kontynuować.",
        "spamHint": "Sprawdź folder spam. Jeśli tam jest, oznacz go jako 'To nie jest spam', aby otrzymywać przyszłe powiadomienia.",
        "verify": "Weryfikuj",
        "resend": "Wyślij kod ponownie",
        "invalidCode": "Nieprawidłowy lub wygasły kod.",
        "success": "E-mail zweryfikowany pomyślnie!"
    },
    "pt": {
        "title": "Verificação de segurança",
        "subtitle": "Um código de verificação foi enviado para <important>{email}</important>",
        "instruction": "Introduza o código de 6 dígitos para continuar.",
        "spamHint": "Verifique a sua pasta de spam. Se o encontrar, marque-o como 'Não é spam' para receber futuras notificações.",
        "verify": "Verificar",
        "resend": "Reenviar código",
        "invalidCode": "Código inválido ou expirado.",
        "success": "E-mail verificado com sucesso!"
    },
    "ro": {
        "title": "Verificare de securitate",
        "subtitle": "Un cod de verificare a fost trimis la <important>{email}</important>",
        "instruction": "Introduceți codul de 6 cifre pentru a continua.",
        "spamHint": "Verificați dosarul spam. Dacă îl găsiți acolo, marcați-l ca 'Nu este spam' pentru a primi notificări viitoare.",
        "verify": "Verifică",
        "resend": "Retrimite codul",
        "invalidCode": "Cod invalid sau expirat.",
        "success": "Email verificat cu succes!"
    },
    "sv": {
        "title": "Säkerhetsverifiering",
        "subtitle": "En verifieringskod har skickats till <important>{email}</important>",
        "instruction": "Ange den 6-siffriga koden för att fortsätta.",
        "spamHint": "Kontrollera din skräppostmapp. Om du hittar det där, markera det som 'Inte skräppost' för att få framtida meddelanden.",
        "verify": "Verifiera",
        "resend": "Skicka kod igen",
        "invalidCode": "Ogiltig eller utgången kod.",
        "success": "E-post verifierad med framgång!"
    }
}

for lang in languages:
    file_path = os.path.join(messages_dir, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data["Verification"] = verification_data[lang]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}.json")
    else:
        print(f"File {file_path} not found")
