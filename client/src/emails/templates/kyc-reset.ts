import { emailLayout, btn, APP_URL } from '../layout';

interface SimpleData {
    firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: {
        subject: "Mise a jour de votre verification",
        title: "Bonjour",
        body: "Pour finaliser votre dossier, une nouvelle verification de vos documents d'identite est necessaire. Nous vous invitons a soumettre a nouveau vos pieces justificatives.",
        cta: "Soumettre mes documents"
    },
    en: {
        subject: "Verification update",
        title: "Hello",
        body: "To finalize your file, a new verification of your identity documents is necessary. We invite you to resubmit your supporting documents.",
        cta: "Submit my documents"
    },
    es: {
        subject: "Actualización de su verificación",
        title: "Hola",
        body: "Para finalizar su expediente, es necesaria una nueva verificación de sus documentos de identidad. Le invitamos a enviar de nuevo sus documentos justificativos.",
        cta: "Enviar mis documentos"
    },
    it: {
        subject: "Aggiornamento della verifica",
        title: "Buongiorno",
        body: "Per finalizzare la tua pratica, è necessaria una nouvelle verifica dei tuoi documenti d'identità. Ti invitiamo a inviare nuovamente i tuoi documenti giustificativi.",
        cta: "Invia i miei documenti"
    },
    de: {
        subject: "Aktualisierung Ihrer Verifizierung",
        title: "Hallo",
        body: "Um Ihre Akte abzuschließen, ist eine neue Verifizierung Ihrer Identitätsdokumente erforderlich. Wir bitten Sie, Ihre Unterlagen erneut einzureichen.",
        cta: "Meine Dokumente einreichen"
    },
    nl: {
        subject: "Bijwerking van uw verificatie",
        title: "Hallo",
        body: "Om uw dossier te voltooien, is een nieuwe verificatie van uw identiteitsdocumenten nodig. Wij nodigen u uit om uw bewijsstukken opnieuw in te dienen.",
        cta: "Mijn documenten indienen"
    },
    pl: {
        subject: "Aktualizacja weryfikacji",
        title: "Witaj",
        body: "W celu sfinalizowania Twojego wniosku konieczna jest ponowna weryfikacja dokumentów tożsamości. Prosimy o ponowne przesłanie dokumentów uzupełniających.",
        cta: "Prześlij moje dokumenty"
    },
    pt: {
        subject: "Atualização da sua verificação",
        title: "Olá",
        body: "Para finalizar o seu processo, é necessária uma nova verificação dos seus documentos de identidade. Convidamo-lo a enviar novamente os seus documentos justificativos.",
        cta: "Enviar os meus documentos"
    },
    ro: {
        subject: "Actualizarea verificării dvs.",
        title: "Bună ziua",
        body: "Pentru a finaliza dosarul dumneavoastră, este necesară o nouă verificare a documentelor de identitate. Vă invităm să trimiteți din nou documentele justificative.",
        cta: "Trimite documentele mele"
    },
    sv: {
        subject: "Uppdatering av din verifiering",
        title: "Hej",
        body: "För att slutföra din fil krävs en ny verifiering av dina identitetshandlingar. Vi bjuder in dig att skicka in dina underlag igen.",
        cta: "Skicka in mina dokument"
    },
};

export function kycResetTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];
    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    ${btn(t.cta, `${APP_URL}/dashboard/verification`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
