import { emailLayout, btn, APP_URL } from '../layout';

interface WelcomeData {
    firstName: string;
    email: string;
}

const translations: Record<string, { subject: string; greeting: string; body: string; cta: string; info: string }> = {
    fr: {
        subject: "Confirmation d'ouverture de compte — AGM INVEST",
        greeting: "Bonjour",
        body: "Nous vous confirmons l'ouverture de votre compte. Vous pouvez desormais acceder a votre espace personnel pour completer votre dossier.",
        cta: "Acceder a mon espace",
        info: "Identifiant de connexion : "
    },
    en: {
        subject: "Account opening confirmation — AGM INVEST",
        greeting: "Hello",
        body: "We confirm the opening of your account. You can now access your personal space to complete your file.",
        cta: "Access my space",
        info: "Login identifier: "
    },
    es: {
        subject: "Confirmación de apertura de cuenta — AGM INVEST",
        greeting: "Hola",
        body: "Le confirmamos la apertura de su cuenta. Ahora puede acceder a su espacio personal para completar su expediente.",
        cta: "Acceder a mi espacio",
        info: "Identificador de acceso: "
    },
    it: {
        subject: "Conferma apertura conto — AGM INVEST",
        greeting: "Buongiorno",
        body: "Ti confermiamo l'apertura del tuo account. Ora puoi accedere al tuo spazio personale per completare la tua pratica.",
        cta: "Accedi al mio spazio",
        info: "Identificativo di accesso: "
    },
    de: {
        subject: "Bestätigung der Kontoeröffnung — AGM INVEST",
        greeting: "Hallo",
        body: "Wir bestätigen die Eröffnung Ihres Kontos. Sie können nun auf Ihren persönlichen Bereich zugreifen, um Ihre Akte zu vervollständigen.",
        cta: "Meinen Bereich ansehen",
        info: "Anmeldekennung: "
    },
    nl: {
        subject: "Bevestiging van opening account — AGM INVEST",
        greeting: "Hallo",
        body: "Wij bevestigen de opening van uw account. U kunt nu toegang krijgen tot uw persoonlijke ruimte om uw dossier te voltooien.",
        cta: "Toegang tot mijn ruimte",
        info: "Inlog-identificatie: "
    },
    pl: {
        subject: "Potwierdzenie otwarcia konta — AGM INVEST",
        greeting: "Witaj",
        body: "Potwierdzamy otwarcie Twojego konta. Możesz teraz uzyskać dostęp do swojego obszaru osobistego, aby uzupełnić dokumentację.",
        cta: "Zobacz mój obszar",
        info: "Identyfikator logowania: "
    },
    pt: {
        subject: "Confirmação de abertura de conta — AGM INVEST",
        greeting: "Olá",
        body: "Confirmamos a abertura da sua conta. Pode agora aceder ao seu espaço pessoal para completar o seu processo.",
        cta: "Aceder ao meu espaço",
        info: "Identificador de acesso: "
    },
    ro: {
        subject: "Confirmare deschidere cont — AGM INVEST",
        greeting: "Bună ziua",
        body: "Vă confirmăm deschiderea contului dumneavoastră. Acum puteți accesa spațiul personal pentru a completa dosarul.",
        cta: "Accesare spațiul meu",
        info: "Identificator de conectare: "
    },
    sv: {
        subject: "Bekräftelse på kontoöppning — AGM INVEST",
        greeting: "Hej",
        body: "Vi bekräftar öppnandet av ditt konto. Du kan nu komma åt ditt personliga utrymme för att slutföra din fil.",
        cta: "Se mitt utrymme",
        info: "Inloggningsidentifierare: "
    },
};

export function welcomeTemplate(data: WelcomeData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.greeting}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:13px;color:#94A3B8;margin:0;">${t.info}</p>
      <p style="font-size:15px;font-weight:700;color:#1E3A5F;margin:4px 0 0;">${data.email}</p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
