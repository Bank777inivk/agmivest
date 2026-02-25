import { emailLayout, btn, APP_URL } from '../layout';

interface WelcomeData {
    firstName: string;
    email: string;
}

const translations: Record<string, { subject: string; greeting: string; body: string; cta: string; info: string }> = {
    fr: {
        subject: "Confirmation de creation de compte - AGM INVEST",
        greeting: "Bienvenue",
        body: "Votre compte a &eacute;t&eacute; cr&eacute;&eacute; avec succ&egrave;s. Vous pouvez d&egrave;s maintenant acc&eacute;der &agrave; votre espace personnel et soumettre votre demande de financement.",
        cta: "Acc&eacute;der &agrave; mon espace",
        info: "Votre email de connexion : "
    },
    en: {
        subject: "Welcome to AGM INVEST 🎉",
        greeting: "Welcome",
        body: "Your account has been successfully created. You can now access your personal space and submit your financing request.",
        cta: "Access my account",
        info: "Your login email: "
    },
    es: {
        subject: "Bienvenido a AGM INVEST 🎉",
        greeting: "Bienvenido",
        body: "Su cuenta ha sido creada con éxito. Ahora puede acceder a su espacio personal y enviar su solicitud de financiación.",
        cta: "Acceder a mi espacio",
        info: "Su correo electrónico de acceso: "
    },
    it: {
        subject: "Benvenuto su AGM INVEST 🎉",
        greeting: "Benvenuto",
        body: "Il tuo account è stato creato con successo. Ora puoi accedere al tuo spazio personale e inviare la tua richiesta di finanziamento.",
        cta: "Accedi al mio spazio",
        info: "La tua email di accesso: "
    },
    de: {
        subject: "Willkommen bei AGM INVEST 🎉",
        greeting: "Willkommen",
        body: "Ihr Konto wurde erfolgreich erstellt. Sie können jetzt auf Ihren persönlichen Bereich zugreifen und Ihren Finanzierungsantrag einreichen.",
        cta: "Auf meinen Bereich zugreifen",
        info: "Ihre Anmelde-E-Mail: "
    },
    nl: {
        subject: "Welkom bij AGM INVEST 🎉",
        greeting: "Welkom",
        body: "Uw account is succesvol aangemaakt. U kunt nu toegang krijgen tot uw persoonlijke ruimte en uw financieringsaanvraag indienen.",
        cta: "Toegang tot mijn account",
        info: "Uw aanmeldings-e-mail: "
    },
    pl: {
        subject: "Witamy w AGM INVEST 🎉",
        greeting: "Witamy",
        body: "Twoje konto zostało pomyślnie utworzone. Możesz teraz uzyskać dostęp do swojego osobistego obszaru i złożyć wniosek o finansowanie.",
        cta: "Przejdź do mojego konta",
        info: "Twój adres e-mail do logowania: "
    },
    pt: {
        subject: "Bem-vindo ao AGM INVEST 🎉",
        greeting: "Bem-vindo",
        body: "Sua conta foi criada com sucesso. Agora você pode acessar seu espaço pessoal e enviar seu pedido de financiamento.",
        cta: "Acessar meu espaço",
        info: "Seu e-mail de acesso: "
    },
    ro: {
        subject: "Bun venit la AGM INVEST 🎉",
        greeting: "Bun venit",
        body: "Contul dvs. a fost creat cu succes. Acum puteți accesa spațiul personal și trimite cererea de finanțare.",
        cta: "Accesați spațiul meu",
        info: "Email-ul dvs. de conectare: "
    },
    sv: {
        subject: "Välkommen till AGM INVEST 🎉",
        greeting: "Välkommen",
        body: "Ditt konto har skapats framgångsrikt. Du kan nu komma åt ditt personliga utrymme och skicka in din finansieringsansökan.",
        cta: "Gå till mitt konto",
        info: "Din inloggnings-e-post: "
    },
};

export function welcomeTemplate(data: WelcomeData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:24px;font-weight:900;color:#1E3A5F;margin:0 0 8px;">${t.greeting}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:13px;color:#94A3B8;margin:0;">${t.info}</p>
      <p style="font-size:15px;font-weight:700;color:#1E3A5F;margin:4px 0 0;">${data.email}</p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}

    <hr style="border:none;border-top:1px solid #F1F5F9;margin:32px 0;" />
    <p style="font-size:12px;color:#94A3B8;text-align:center;margin:0;">AGM INVEST — Votre partenaire financier de confiance</p>
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
