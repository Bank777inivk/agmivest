import { emailLayout, btn, APP_URL } from '../layout';

interface IdentityData {
    firstName: string;
}

export function identityReceivedTemplate(data: IdentityData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Confirmation de votre verification d'identite",
            title: "Verification en cours",
            body: "Bonjour " + data.firstName + ",\n\nVotre verification biometrique (selfie/video) a bien ete transmise avec succes.\n\nNos services procedent a la validation de votre identite. Vous recevrez une notification des que cette etape sera finalisee.",
            cta: "Retour au tableau de bord"
        },
        en: {
            subject: "Identity verification confirmation",
            title: "Verification in progress",
            body: "Hello " + data.firstName + ",\n\nYour biometric verification (selfie/video) has been successfully transmitted.\n\nOur services are proceeding with the validation of your identity. You will receive a notification as soon as this step is finalized.",
            cta: "Back to dashboard"
        },
        es: {
            subject: "Confirmacion de su verificacion de identidad",
            title: "Verificacion en curso",
            body: "Hola " + data.firstName + ",\n\nSu verificacion biometrica (selfie/video) ha sido enviada con exito.\n\nNuestros servicios estan procediendo a la validacion de su identidad. Recibira una notificacion tan pronto como finalice este paso.",
            cta: "Volver al tablero"
        },
        it: {
            subject: "Conferma della tua verifica dell'identità",
            title: "Verifica in corso",
            body: "Buongiorno " + data.firstName + ",\n\nLa tua verifica biometrica (selfie/video) è stata trasmessa con successo.\n\nI nostri servizi stanno procedendo alla convalida della tua identità. Riceverai una notifica non appena questa fase sarà completata.",
            cta: "Torna alla dashboard"
        },
        de: {
            subject: "Bestatigung Ihrer Identitatsprufung",
            title: "Prufung lauft",
            body: "Hallo " + data.firstName + ",\n\nIhre biometrische Uberprufung (Selfie/Video) wurde erfolgreich ubermittelt.\n\nUnsere Dienste validieren derzeit Ihre Identitat. Sie erhalten eine Benachrichtigung, sobald dieser Schritt abgeschlossen ist.",
            cta: "Zuruck zum Dashboard"
        },
        nl: {
            subject: "Bevestiging van uw identiteitsverificatie",
            title: "Verificatie in behandeling",
            body: "Hallo " + data.firstName + ",\n\nUw biometrische verificatie (selfie/video) is succesvol verzonden.\n\nOnze diensten zijn bezig met de validatie van uw identiteit. U ontvangt een melding zodra deze stap is voltooid.",
            cta: "Terug naar dashboard"
        },
        pl: {
            subject: "Potwierdzenie weryfikacji tozsamosci",
            title: "Weryfikacja w toku",
            body: "Witaj " + data.firstName + ",\n\nTwoja weryfikacja biometryczna (selfie/wideo) zostala pomyslnie przeslana.\n\nNasze sluzby przystępują do walidacji Twojej tozsamosci. Otrzymasz powiadomienie, gdy tylko ten etap zostanie zakonczony.",
            cta: "Wroc do panelu"
        },
        pt: {
            subject: "Confirmacao da sua verificacao de identidade",
            title: "Verificacao em curso",
            body: "Ola " + data.firstName + ",\n\nA sua verificacao biometrica (selfie/video) foi transmitida com sucesso.\n\nOs nossos servicos estao a proceder a validacao da sua identidade. Recebra uma notificacao assim que esta etapa estiver concluida.",
            cta: "Voltar ao painel"
        },
        ro: {
            subject: "Confirmarea verificarii identitatii dumneavoastra",
            title: "Verificare in curs",
            body: "Buna ziua " + data.firstName + ",\n\nVerificarea dumneavoastra biometrica (selfie/video) a fost transmisa cu succes.\n\nServiciile noastre procedeaza la validarea identitatii dumneavoastra. Veti primi o notificare imediat ce aceasta etapa va fi finalizata.",
            cta: "Inapoi la panoul de bord"
        },
        sv: {
            subject: "Bekraftelse av din identitetsverifiering",
            title: "Verifiering pagar",
            body: "Hej " + data.firstName + ",\n\nDin biometriska verifiering (selfie/video) har skickats in framgangsrikt.\n\nVara tjanster validerar just nu din identitet. Du kommer att fa ett meddelande sa snart detta steg ar klart.",
            cta: "Tillbaka till instrumentpanelen"
        }
    };

    const t = translations[lang] || translations['fr'];
    const content = `
        <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
        <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
        ${btn(t.cta, `${APP_URL}/dashboard`)}
    `;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
