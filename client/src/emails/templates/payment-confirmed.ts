import { emailLayout, btn, APP_URL } from '../layout';

interface SimpleData {
    firstName: string;
}

export function paymentConfirmedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Confirmation de reglement — AGM INVEST",
            title: "Confirmation de reglement",
            body: "Bonjour " + data.firstName + ",\n\nNous vous confirmons la reception de votre recente operation. Votre espace personnel a ete mis a jour pour refleter ce changement.",
            cta: "Consulter mon compte"
        },
        en: {
            subject: "Payment confirmation — AGM INVEST",
            title: "Payment confirmation",
            body: "Hello " + data.firstName + ",\n\nWe confirm receipt of your recent operation. Your personal space has been updated to reflect this change.",
            cta: "View my account"
        },
        es: {
            subject: "Confirmacion de pago — AGM INVEST",
            title: "Confirmacion de pago",
            body: "Hola " + data.firstName + ",\n\nConfirmamos la recepcion de su reciente operacion. Su espacio personal ha sido actualizado para reflejar este cambio.",
            cta: "Ver mi cuenta"
        },
        it: {
            subject: "Conferma di pagamento — AGM INVEST",
            title: "Conferma di pagamento",
            body: "Buongiorno " + data.firstName + ",\n\nConfermiamo la ricezione della tua recente operazione. Il tuo spazio personale è stato aggiornato per riflettere questo cambiamento.",
            cta: "Visualizza il mio account"
        },
        de: {
            subject: "Zahlungsbestatigung — AGM INVEST",
            title: "Zahlungsbestatigung",
            body: "Hallo " + data.firstName + ",\n\nWir bestatigen den Erhalt Ihres jungsten Vorgangs. Ihr personlicher Bereich wurde aktualisiert, um diese Anderung widerzuspiegeln.",
            cta: "Mein Konto ansehen"
        },
        nl: {
            subject: "Betalingsbevestiging — AGM INVEST",
            title: "Betalingsbevestiging",
            body: "Hallo " + data.firstName + ",\n\nWij bevestigen de ontvangst van uw recente bewerking. Uw persoonlijke ruimte is bijgewerkt om deze wijziging weer te geven.",
            cta: "Mijn account bekijken"
        },
        pl: {
            subject: "Potwierdzenie platnosci — AGM INVEST",
            title: "Potwierdzenie platnosci",
            body: "Witaj " + data.firstName + ",\n\nPotwierdzamy otrzymanie Twojej ostatniej operacji. Twoj obszar osobisty zostal zaktualizowany, aby odzwierciedlic te zmiane.",
            cta: "Zobacz moje konto"
        },
        pt: {
            subject: "Confirmacao de pagamento — AGM INVEST",
            title: "Confirmacao de pagamento",
            body: "Ola " + data.firstName + ",\n\nConfirmamos a rececao da sua recente operacao. O seu espaco pessoal foi atualizado para refletir esta alteracao.",
            cta: "Ver a minha conta"
        },
        ro: {
            subject: "Confirmarea platii — AGM INVEST",
            title: "Confirmarea platii",
            body: "Bună ziua " + data.firstName + ",\n\nConfirmam primirea recentei dumneavoastra operatiuni. Spatiul dumneavoastra personal a fost actualizat pentru a reflecta aceasta schimbare.",
            cta: "Vizualizati contul meu"
        },
        sv: {
            subject: "Betalningsbekraftelse — AGM INVEST",
            title: "Betalningsbekraftelse",
            body: "Hej " + data.firstName + ",\n\nVi bekraftar mottagandet av din senaste operation. Ditt personliga utrymme har uppdaterats for att atterspegla denna forandring.",
            cta: "Se mitt konto"
        },
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
