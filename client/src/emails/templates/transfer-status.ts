import { emailLayout, btn, APP_URL } from '../layout';
interface TransferData { firstName: string; }

export function transferApprovedTemplate(data: TransferData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Approbation de votre transfert — AGM INVEST",
            title: "Approbation de votre transfert",
            body: "Bonjour " + data.firstName + ",\n\nNous vous informons qu'une mise a jour a ete effectuee sur votre compte concernant votre demande de transfert. Celle-ci a ete approuvee et suit son cours.",
            cta: "Consulter mon espace"
        },
        en: {
            subject: "Transfer approval — AGM INVEST",
            title: "Transfer approval",
            body: "Hello " + data.firstName + ",\n\nWe inform you that an update has been made to your account regarding your transfer request. It has been approved and is proceeding.",
            cta: "View my space"
        },
        es: {
            subject: "Aprobacion de su transferencia — AGM INVEST",
            title: "Aprobacion de su transferencia",
            body: "Hola " + data.firstName + ",\n\nLe informamos que se ha realizado una actualizacion en su cuenta sobre su solicitud de transferencia. Esta ha sido aprobada y sigue su curso.",
            cta: "Ver mi espacio"
        },
        it: {
            subject: "Approvazione del tuo trasferimento — AGM INVEST",
            title: "Approvazione del tuo trasferimento",
            body: "Buongiorno " + data.firstName + ",\n\nTi informiamo che e stato effettuato un aggiornamento sul tuo account in merito alla tua richiesta di trasferimento. Questa e stata approvata e sta procedendo.",
            cta: "Visualizza il mio spazio"
        },
        de: {
            subject: "Genehmigung Ihres Transfers — AGM INVEST",
            title: "Genehmigung Ihres Transfers",
            body: "Hallo " + data.firstName + ",\n\nWir informieren Sie, dass Ihr Konto bezuglich Ihrer Transferanfrage aktualisiert wurde. Diese wurde genehmigt und nimmt ihren Lauf.",
            cta: "Meinen Bereich ansehen"
        },
        nl: {
            subject: "Goedkeuring van uw overboeking — AGM INVEST",
            title: "Goedkeuring van uw overboeking",
            body: "Hallo " + data.firstName + ",\n\nWij informeren u dat er een update is uitgevoerd op uw account met betrekking tot uw overboekingsverzoek. Dit is goedgekeurd en vordert.",
            cta: "Mijn ruimte bekijken"
        },
        pl: {
            subject: "Zatwierdzenie Twojego przelewu — AGM INVEST",
            title: "Zatwierdzenie Twojego przelewu",
            body: "Witaj " + data.firstName + ",\n\nInformujemy, ze na Twoim koncie wprowadzono aktualizację dotyczącą zlecenia przelewu. Zostalo ono zatwierdzone i postępuje.",
            cta: "Zobacz moj obszar"
        },
        pt: {
            subject: "Aprovacao da sua transferencia — AGM INVEST",
            title: "Aprovacao da sua transferencia",
            body: "Ola " + data.firstName + ",\n\nInformamos que foi efetuada uma atualizacao na sua conta relativamente ao seu pedido de transferencia. Este foi aprovado e esta a progredir.",
            cta: "Ver o meu espaco"
        },
        ro: {
            subject: "Aprobarea transferului dumneavoastra — AGM INVEST",
            title: "Aprobarea transferului dumneavoastra",
            body: "Buna ziua " + data.firstName + ",\n\nVa informam ca a fost efectuata o actualizare a contului dumneavoastra cu privire la cererea de transfer. Aceasta a fost aprobata si isi urmeaza cursul.",
            cta: "Vizualizati spatiul meu"
        },
        sv: {
            subject: "Godkannande av din overforing — AGM INVEST",
            title: "Godkannande av din overforing",
            body: "Hej " + data.firstName + ",\n\nVi informerar dig om att en uppdatering har gjorts pa ditt konto angaende din overforingsbegaran. Den har godkants och fortskrider.",
            cta: "Se mitt utrymme"
        },
    };

    const t = translations[lang] || translations['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}

export function transferRejectedTemplate(data: TransferData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Suivi de votre transfert — AGM INVEST",
            title: "Ajustement de votre transfert",
            body: "Bonjour " + data.firstName + ",\n\nDes precisions sont necessaires concernant une operation de transfert sur votre dossier. Nous vous invitons a consulter les informations detaillees dans votre espace.",
            cta: "Consulter mon compte"
        },
        en: {
            subject: "Transfer follow-up — AGM INVEST",
            title: "Transfer adjustment",
            body: "Hello " + data.firstName + ",\n\nClarifications are needed regarding a transfer operation on your file. We invite you to check the detailed information in your space.",
            cta: "View my account"
        },
        es: {
            subject: "Seguimiento de su transferencia — AGM INVEST",
            title: "Ajuste de su transferencia",
            body: "Hola " + data.firstName + ",\n\nSe necesitan aclaraciones sobre una operacion de transferencia en su expediente. Le invitamos a consultar la informacion detallada en su espacio.",
            cta: "Ver mi cuenta"
        },
        it: {
            subject: "Seguimento del tuo trasferimento — AGM INVEST",
            title: "Rettifica del tuo trasferimento",
            body: "Buongiorno " + data.firstName + ",\n\nSono necessari chiarimenti in merito a un'operazione di trasferimento sulla tua pratica. Ti invitiamo a consultare le informazioni dettagliate nel tuo spazio.",
            cta: "Visualizza il mio account"
        },
        de: {
            subject: "Transfer-Nachverfolgung — AGM INVEST",
            title: "Transferanpassung",
            body: "Hallo " + data.firstName + ",\n\nKlarungen bezuglich eines Transfervorgangs in Ihrer Akte sind erforderlich. Wir laden Sie ein, die detaillierten Informationen in Ihrem Bereich einzusehen.",
            cta: "Mein Konto ansehen"
        },
        nl: {
            subject: "Opvolging van uw overboeking — AGM INVEST",
            title: "Aanpassing van uw overboeking",
            body: "Hallo " + data.firstName + ",\n\nEr is verduidelijking nodig met betrekking tot een overboekingsbewerking in uw dossier. Wij nodigen u uit om de gedetailleerde informatie in uw ruimte te bekijken.",
            cta: "Mijn account bekijken"
        },
        pl: {
            subject: "Monitorowanie Twojego przelewu — AGM INVEST",
            title: "Korekta Twojego przelewu",
            body: "Witaj " + data.firstName + ",\n\nKonieczne sa wyjasnienia dotyczące operacji przelewu w Twoim wniosku. Zapraszamy do zapoznania sie ze szczegolowymi informacjami w Twoim obszarze.",
            cta: "Zobacz moje konto"
        },
        pt: {
            subject: "Acompanhamento da sua transferencia — AGM INVEST",
            title: "Ajuste da sua transferencia",
            body: "Ola " + data.firstName + ",\n\nSao necessarios esclarecimentos sobre uma operacao de transferencia no seu processo. Convidamo-lo a consultar as informacoes detalhadas no seu espaco.",
            cta: "Ver a minha conta"
        },
        ro: {
            subject: "Urmarirea transferului dumneavoastra — AGM INVEST",
            title: "Ajustarea transferului dumneavoastra",
            body: "Buna ziua " + data.firstName + ",\n\nSunt necesare clarificari cu privire la o operatiune de transfer din dosarul dumneavoastra. Va invitam sa consultati informatiile detaliate din spatiul dumneavoastra.",
            cta: "Vizualizati contul meu"
        },
        sv: {
            subject: "Uppfoljning av din overforing — AGM INVEST",
            title: "Justering av din overforing",
            body: "Hej " + data.firstName + ",\n\nFortydliganden behovs angaende en overforingsoperation i din fil. Vi bjuder in dig att kontrollera den detaljerade informationen i ditt utrymme.",
            cta: "Se mitt konto"
        },
    };

    const t = translations[lang] || translations['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard/support`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
