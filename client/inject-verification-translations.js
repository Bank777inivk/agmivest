const fs = require('fs');
const path = require('path');

const locales = ['fr', 'en', 'es', 'it', 'de', 'nl', 'pl', 'pt', 'ro', 'sv'];
const messagesDir = path.join(__dirname, 'messages');

const translations = {
    fr: {
        title: "Vérification de sécurité",
        subtitle: "Un code de vérification a été envoyé à {email}",
        instruction: "Saisissez le code à 6 chiffres pour continuer.",
        spamHint: "Consultez vos spams. S'il s'y trouve, marquez-le comme 'Non-spam' pour recevoir nos prochaines notifications.",
        verify: "Vérifier",
        resend: "Renvoyer le code",
        invalidCode: "Code invalide ou expiré.",
        success: "Email vérifié avec succès !"
    },
    en: {
        title: "Security Verification",
        subtitle: "A verification code has been sent to {email}",
        instruction: "Enter the 6-digit code to continue.",
        spamHint: "Check your spam folder. If found, mark it as 'Not spam' to receive our future notifications.",
        verify: "Verify",
        resend: "Resend code",
        invalidCode: "Invalid or expired code.",
        success: "Email verified successfully!"
    },
    es: {
        title: "Verificación de seguridad",
        subtitle: "Se ha enviado un código de verificación a {email}",
        instruction: "Ingresa el código de 6 dígitos para continuar.",
        spamHint: "Revisa tu carpeta de spam. Si lo encuentras, márcalo como 'No es spam' para recibir nuestras futuras notificaciones.",
        verify: "Verificar",
        resend: "Reenviar código",
        invalidCode: "Código inválido o caducado.",
        success: "¡Email verificado con éxito!"
    },
    it: {
        title: "Verifica di sicurezza",
        subtitle: "Un codice di verifica è stato inviato a {email}",
        instruction: "Inserisci il codice a 6 cifre per continuare.",
        spamHint: "Controlla la cartella spam. Se lo trovi, contrassegnalo come 'Non spam' per ricevere le nostre future notifiche.",
        verify: "Verifica",
        resend: "Invia di nuovo il codice",
        invalidCode: "Codice non valido o scaduto.",
        success: "Email verificata con successo!"
    },
    de: {
        title: "Sicherheitsüberprüfung",
        subtitle: "Ein Bestätigungscode wurde an {email} gesendet",
        instruction: "Geben Sie den 6-stelligen Code ein, um fortzufahren.",
        spamHint: "Überprüfen Sie Ihren Spam-Ordner. Falls gefunden, markieren Sie ihn als 'Kein Spam', um unsere zukünftigen Benachrichtigungen zu erhalten.",
        verify: "Verifizieren",
        resend: "Code erneut senden",
        invalidCode: "Ungültiger oder abgelaufener Code.",
        success: "E-Mail erfolgreich verifiziert!"
    },
    nl: {
        title: "Veiligheidsverificatie",
        subtitle: "Er is een verificatiecode verzonden naar {email}",
        instruction: "Voer de 6-cijferige code in om door te gaan.",
        spamHint: "Controleer uw spammap. Als u het vindt, markeer het dan als 'Geen spam' om onze toekomstige meldingen te ontvangen.",
        verify: "Verifiëren",
        resend: "Code opnieuw verzenden",
        invalidCode: "Ongeldige of verlopen code.",
        success: "E-mail succesvol geverifieerd!"
    },
    pl: {
        title: "Weryfikacja bezpieczeństwa",
        subtitle: "Kod weryfikacyjny został wysłany na adres {email}",
        instruction: "Wprowadź 6-cyfrowy kod, aby kontynuować.",
        spamHint: "Sprawdź folder spam. Jeśli tam jest, oznacz go jako 'To nie jest spam', aby otrzymywać nasze przyszłe powiadomienia.",
        verify: "Zweryfikuj",
        resend: "Wyślij kod ponownie",
        invalidCode: "Nieprawidłowy lub wygasły kod.",
        success: "Adres e-mail zweryfikowany pomyślnie!"
    },
    pt: {
        title: "Verificação de segurança",
        subtitle: "Um código de verificação foi enviado para {email}",
        instruction: "Insira o código de 6 dígitos para continuar.",
        spamHint: "Verifique sua pasta de spam. Se encontrado, marque-o como 'Não é spam' para receber nossas futuras notificações.",
        verify: "Verificar",
        resend: "Reenviar código",
        invalidCode: "Código inválido ou expirado.",
        success: "E-mail verificado com sucesso!"
    },
    ro: {
        title: "Verificare de securitate",
        subtitle: "Un cod de verificare a fost trimis la adresa {email}",
        instruction: "Introduceți codul din 6 cifre pentru a continua.",
        spamHint: "Verificați folderul spam. Dacă îl găsiți, marcați-l ca 'Nu este spam' pentru a primi notificările noastre viitoare.",
        verify: "Verifică",
        resend: "Retrimite codul",
        invalidCode: "Cod nevalid sau expirat.",
        success: "Email verificat cu succes!"
    },
    sv: {
        title: "Säkerhetsverifiering",
        subtitle: "En verifieringskod har skickats till {email}",
        instruction: "Ange den 6-siffriga koden för att fortsätta.",
        spamHint: "Kontrolla din skräppostmapp. Om du hittar den, markera den som 'Inte skräppost' för att få våra framtida aviseringar.",
        verify: "Verifiera",
        resend: "Skicka koden igen",
        invalidCode: "Ogiltig eller utgången kod.",
        success: "E-postadressen har verifierats!"
    }
};

locales.forEach(locale => {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        content.Verification = translations[locale];
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        console.log(`Updated ${locale}.json`);
    }
});
