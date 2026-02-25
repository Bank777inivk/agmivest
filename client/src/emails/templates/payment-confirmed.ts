import { emailLayout, btn, APP_URL } from '../layout';

interface SimpleData {
    firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise a jour de votre compte — AGM INVEST", title: "Bonjour", body: "Nous vous confirmons la reception de votre recente operation. Votre espace personnel a ete mis a jour pour refleter ce changement.", cta: "Consulter mon compte" },
    en: { subject: "Account update — AGM INVEST", title: "Hello", body: "We confirm receipt of your recent operation. Your personal space has been updated to reflect this change.", cta: "View my account" },
    es: { subject: "Actualización de su cuenta — AGM INVEST", title: "Hola", body: "Confirmamos la recepción de su reciente operación. Su espacio personal ha sido actualizado para reflejar este cambio.", cta: "Ver mi cuenta" },
    it: { subject: "Aggiornamento dell'account — AGM INVEST", title: "Ciao", body: "Confermiamo la ricezione della tua recente operazione. Il tuo spazio personale è stato aggiornato per riflettere questo cambiamento.", cta: "Visualizza il mio account" },
    de: { subject: "Konto-Aktualisierung — AGM INVEST", title: "Hallo", body: "Wir bestätigen den Erhalt Ihres jüngsten Vorgangs. Ihr persönlicher Bereich wurde aktualisiert, um diese Änderung widerzuspiegeln.", cta: "Mein Konto ansehen" },
    nl: { subject: "Account bijwerking — AGM INVEST", title: "Hallo", body: "Wij bevestigen de ontvangst van uw recente bewerking. Uw persoonlijke ruimte is bijgewerkt om deze wijziging weer te geven.", cta: "Mijn account bekijken" },
    pl: { subject: "Aktualizacja konta — AGM INVEST", title: "Witaj", body: "Potwierdzamy otrzymanie Twojej ostatniej operacji. Twój obszar osobisty został zaktualizowany, aby odzwierciedlić tę zmianę.", cta: "Zobacz moje konto" },
    pt: { subject: "Atualização da sua conta — AGM INVEST", title: "Olá", body: "Confirmamos a receção da sua recente operação. O seu espaço pessoal foi atualizado para refletir esta alteração.", cta: "Ver a minha conta" },
    ro: { subject: "Actualizare cont — AGM INVEST", title: "Bună", body: "Confirmăm primirea recentei dumneavoastră operațiuni. Spațiul dumneavoastră personal a fost actualizat pentru a reflecta această schimbare.", cta: "Vizualizați contul meu" },
    sv: { subject: "Kontouppdatering — AGM INVEST", title: "Hej", body: "Vi bekräftar mottagandet av din senaste operation. Ditt personliga utrymme har uppdaterats för att återspegla denna förändring.", cta: "Se mitt konto" },
};

export function paymentConfirmedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
