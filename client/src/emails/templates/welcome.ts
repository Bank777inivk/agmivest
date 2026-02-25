import { emailLayout, btn, APP_URL } from '../layout';

interface WelcomeData {
    firstName: string;
    email: string;
}

export function welcomeTemplate(data: WelcomeData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
        fr: {
            subject: "Confirmation d'ouverture de compte",
            title: "Ouverture de compte confirmee",
            body: "Bonjour " + data.firstName + ",\n\nNous vous confirmons l'ouverture de votre compte. Vous pouvez desormais acceder a votre espace personnel pour completer votre dossier.",
            cta: "Acceder a mon espace",
            info: "Identifiant de connexion : "
        },
        en: {
            subject: "Account opening confirmation",
            title: "Account opening confirmed",
            body: "Hello " + data.firstName + ",\n\nWe confirm the opening of your account. You can now access your personal space to complete your file.",
            cta: "Access my space",
            info: "Login identifier: "
        },
        es: {
            subject: "Confirmacion de apertura de cuenta",
            title: "Apertura de cuenta confirmada",
            body: "Hola " + data.firstName + ",\n\nLe confirmamos la apertura de su cuenta. Ahora puede acceder a su espacio personal para completar su expediente.",
            cta: "Acceder a mi espacio",
            info: "Identificador de acceso: "
        },
        it: {
            subject: "Conferma apertura conto",
            title: "Apertura conto confermata",
            body: "Buongiorno " + data.firstName + ",\n\nTi confermiamo l'apertura del tuo account. Ora puoi accedere al tuo spazio personale per completare la tua pratica.",
            cta: "Accedi al mio spazio",
            info: "Identificativo di accesso: "
        },
        de: {
            subject: "Bestatigung der Kontoerofnung",
            title: "Kontoerofnung bestatigt",
            body: "Hallo " + data.firstName + ",\n\nWir bestatigen die Erofnung Ihres Kontos. Sie konnen nun auf Ihren personlichen Bereich zugreifen, um Ihre Akte zu vervollstandigen.",
            cta: "Meinen Bereich ansehen",
            info: "Anmeldekennung: "
        },
        nl: {
            subject: "Bevestiging van opening account",
            title: "Accountopening bevestigd",
            body: "Hallo " + data.firstName + ",\n\nWij bevestigen de opening van uw account. U kunt nu toegang krijgen tot uw persoonlijke ruimte om uw dossier te voltooien.",
            cta: "Toegang tot mijn ruimte",
            info: "Inlog-identificatie: "
        },
        pl: {
            subject: "Potwierdzenie otwarcia konta",
            title: "Otwarcie konta potwierdzone",
            body: "Witaj " + data.firstName + ",\n\nPotwierdzamy otwarcie Twojego konta. Mozesz teraz uzyskac dostep do swojego obszaru osobistego, aby uzupelnic dokumentacje.",
            cta: "Zobacz moj obszar",
            info: "Identyfikator logowania: "
        },
        pt: {
            subject: "Confirmacao de abertura de conta",
            title: "Abertura de conta confirmada",
            body: "Ola " + data.firstName + ",\n\nConfirmamos a abertura da sua conta. Pode agora aceder ao seu espaco pessoal para completar o seu processo.",
            cta: "Aceder ao meu espaco",
            info: "Identificador de acesso: "
        },
        ro: {
            subject: "Confirmare deschidere cont",
            title: "Deschidere cont confirmata",
            body: "Buna ziua " + data.firstName + ",\n\nVa confirmam deschiderea contului dumneavoastra. Acum puteti accesa spatiul personal pentru a completa dosarul.",
            cta: "Accesare spatiul meu",
            info: "Identificator de conectare: "
        },
        sv: {
            subject: "Bekraftelse pa kontooppning",
            title: "Kontooppning bekraftad",
            body: "Hej " + data.firstName + ",\n\nVi bekraftar oppnandet av ditt konto. Du kan nu komma at ditt personliga utrymme for att slutfora din fil.",
            cta: "Se mitt utrymme",
            info: "Inloggningsidentifierare: "
        },
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:13px;color:#94A3B8;margin:0;">${t.info}</p>
      <p style="font-size:15px;font-weight:700;color:#1E3A5F;margin:4px 0 0;">${data.email}</p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
