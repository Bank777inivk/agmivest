import { emailLayout, btn, APP_URL } from '../layout';
interface TransferData { firstName: string; }

const approved: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise a jour de votre compte — AGM INVEST", title: "Bonjour", body: "Une mise a jour a ete effectuee sur votre compte. Votre dossier progresse conformement aux procedures prevues.", cta: "Consulter mon espace" },
    en: { subject: "Account update — AGM INVEST", title: "Hello", body: "An update has been made to your account. Your file is progressing in accordance with the planned procedures.", cta: "View my space" },
    es: { subject: "Actualización de su cuenta — AGM INVEST", title: "Hola", body: "Se ha realizado una actualización en su cuenta. Su expediente progresa de acuerdo con los procedimientos previstos.", cta: "Ver mi espacio" },
    it: { subject: "Aggiornamento dell'account — AGM INVEST", title: "Buongiorno", body: "È stato effettuato un aggiornamento sul tuo account. La tua pratica sta procedendo secondo le procedure previste.", cta: "Visualizza il mio spazio" },
    de: { subject: "Konto-Aktualisierung — AGM INVEST", title: "Hallo", body: "Ihr Konto wurde aktualisiert. Ihre Akte schreitet gemäß den geplanten Verfahren voran.", cta: "Meinen Bereich ansehen" },
    nl: { subject: "Account bijwerking — AGM INVEST", title: "Hallo", body: "Er is een update uitgevoerd op uw account. Uw dossier vordert in overeenstemming met de geplande procedures.", cta: "Mijn ruimte bekijken" },
    pl: { subject: "Aktualizacja konta — AGM INVEST", title: "Witaj", body: "Na Twoim koncie wprowadzono aktualizację. Twój wniosek postępuje zgodnie z przewidzianymi procedurami.", cta: "Zobacz mój obszar" },
    pt: { subject: "Atualização da sua conta — AGM INVEST", title: "Olá", body: "Foi efetuada uma atualização na sua conta. O seu processo está a progredir de acordo com os procedimentos previstos.", cta: "Ver o meu espaço" },
    ro: { subject: "Actualizare cont — AGM INVEST", title: "Bună ziua", body: "Contul dumneavoastră a fost actualizat. Dosarul dumneavoastră progresează în conformitate cu procedurile prevăzute.", cta: "Vizualizați spațiul meu" },
    sv: { subject: "Kontouppdatering — AGM INVEST", title: "Hej", body: "En uppdatering har gjorts på ditt konto. Din fil fortskrider i enlighet med de planerade procedurerna.", cta: "Se mitt utrymme" },
};

const rejected: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Action requise sur votre compte — AGM INVEST", title: "Bonjour", body: "Des precisions sont necessaires concernant une operation sur votre dossier. Nous vous invitons a consulter les informations detaillees dans votre espace.", cta: "Consulter mon compte" },
    en: { subject: "Account action required — AGM INVEST", title: "Hello", body: "Clarifications are needed regarding an operation on your file. We invite you to check the detailed information in your space.", cta: "View my account" },
    es: { subject: "Acción requerida en su cuenta — AGM INVEST", title: "Hola", body: "Se necesitan aclaraciones sobre una operación en su expediente. Le invitamos a consultar la información detallada en su espacio.", cta: "Ver mi cuenta" },
    it: { subject: "Azione richiesta sul tuo account — AGM INVEST", title: "Buongiorno", body: "Sono necessari chiarimenti in merito a un'operazione sulla tua pratica. Ti invitiamo a consultare le informazioni dettagliate nel tuo spazio.", cta: "Visualizza il mio account" },
    de: { subject: "Kontoaktion erforderlich — AGM INVEST", title: "Hallo", body: "Klärungen bezüglich eines Vorgangs in Ihrer Akte sind erforderlich. Wir laden Sie ein, die detaillierten Informationen in Ihrem Bereich einzusehen.", cta: "Mein Konto ansehen" },
    nl: { subject: "Account actie vereist — AGM INVEST", title: "Hallo", body: "Er is verduidelijking nodig met betrekking tot een bewerking in uw dossier. Wij nodigen u uit om de gedetailleerde informatie in uw ruimte te bekijken.", cta: "Mijn account bekijken" },
    pl: { subject: "Wymagane działanie na koncie — AGM INVEST", title: "Witaj", body: "Konieczne są wyjaśnienia dotyczące operacji w Twoim wniosku. Zapraszamy do zapoznania się ze szczegółowymi informacjami w Twoim obszarze.", cta: "Zobacz moje konto" },
    pt: { subject: "Ação necessária na sua conta — AGM INVEST", title: "Olá", body: "São necessários esclarecimentos sobre uma operação no seu processo. Convidamo-lo a consultar as informações detalhadas no seu espaço.", cta: "Ver a minha conta" },
    ro: { subject: "Acțiune necesară pe cont — AGM INVEST", title: "Bună ziua", body: "Sunt necesare clarificări cu privire la o operațiune din dosarul dumneavoastră. Vă invităm să consultați informațiile detaliate din spațiul dumneavoastră.", cta: "Vizualizați contul meu" },
    sv: { subject: "Kontoåtgärd krävs — AGM INVEST", title: "Hej", body: "Förtydliganden behövs angående en operation i din fil. Vi bjuder in dig att kontrollera den detaljerade informationen i ditt utrymme.", cta: "Se mitt konto" },
};

export function transferApprovedTemplate(data: TransferData, lang: string = 'fr'): { subject: string; html: string } {
    const t = approved[lang] || approved['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}

export function transferRejectedTemplate(data: TransferData, lang: string = 'fr'): { subject: string; html: string } {
    const t = rejected[lang] || rejected['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard/support`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
