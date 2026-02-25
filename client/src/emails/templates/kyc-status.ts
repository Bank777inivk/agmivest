import { emailLayout, btn, APP_URL } from '../layout';

interface SimpleData {
    firstName: string;
}

export function kycApprovedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Verification de documents validee",
            title: "Verification de documents validee",
            body: "Bonjour " + data.firstName + ",\n\nNous vous informons que l'examen de vos documents est termine. Votre dossier suit son cours conformement aux procedures etablies.",
            cta: "Consulter mon dossier"
        },
        en: {
            subject: "Document verification validated",
            title: "Document verification validated",
            body: "Hello " + data.firstName + ",\n\nWe inform you that the review of your documents is complete. Your file is proceeding in accordance with established procedures.",
            cta: "View my file"
        },
        es: {
            subject: "Verificacion de documentos validada",
            title: "Verificacion de documentos validada",
            body: "Hola " + data.firstName + ",\n\nLe informamos que el examen de sus documentos ha finalizado. Su expediente sigue su curso de acuerdo con los procedimientos establecidos.",
            cta: "Ver mi expediente"
        },
        it: {
            subject: "Verifica dei documenti convalidata",
            title: "Verifica dei documenti convalidata",
            body: "Buongiorno " + data.firstName + ",\n\nTi informiamo che l'esame dei tuoi documenti è completato. La tua pratica sta procedendo secondo le procedure stabilite.",
            cta: "Visualizza la mia pratica"
        },
        de: {
            subject: "Dokumentenprufung validiert",
            title: "Dokumentenprufung validiert",
            body: "Hallo " + data.firstName + ",\n\nWir informieren Sie, dass die Prufung Ihrer Unterlagen abgeschlossen ist. Ihre Akte nimmt gemäß den festgelegten Verfahren ihren Lauf.",
            cta: "Meine Akte ansehen"
        },
        nl: {
            subject: "Documentverificatie gevalideerd",
            title: "Documentverificatie gevalideerd",
            body: "Hallo " + data.firstName + ",\n\nWij informeren u dat de beoordeling van uw documenten is voltooid. Uw dossier volgt zijn koers in overeenstemming met de vastgestelde procedures.",
            cta: "Mijn dossier bekijken"
        },
        pl: {
            subject: "Weryfikacja dokumentow zatwierdzona",
            title: "Weryfikacja dokumentow zatwierdzona",
            body: "Witaj " + data.firstName + ",\n\nInformujemy, ze weryfikacja Twoich dokumentow zostala zakonczona. Twoj wniosek postępuje zgodnie z ustalonymi procedurami.",
            cta: "Zobacz moj wniosek"
        },
        pt: {
            subject: "Verificacao de documentos validada",
            title: "Verificacao de documentos validada",
            body: "Ola " + data.firstName + ",\n\nInformamos que a analise dos seus documentos esta concluida. O seu processo segue o seu curso de acordo com os procedimentos estabelecidos.",
            cta: "Ver o meu processo"
        },
        ro: {
            subject: "Verificarea documentelor validata",
            title: "Verificarea documentelor validata",
            body: "Buna ziua " + data.firstName + ",\n\nVa informam ca examinarea documentelor dumneavoastra este finalizata. Dosarul dumneavoastra isi urmeaza cursul in conformitate cu procedurile stabilite.",
            cta: "Vizualizati dosarul"
        },
        sv: {
            subject: "Dokumentverifiering validerad",
            title: "Dokumentverifiering validerad",
            body: "Hej " + data.firstName + ",\n\nVi informerar dig om att granskningen av dina dokument ar klar. Din fil fortskrider i enlighet med faststallda procedurer.",
            cta: "Se min fil"
        },
    };

    const t = translations[lang] || translations['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}

export function kycRejectedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Action requise sur vos documents",
            title: "Action requise sur vos documents",
            body: "Bonjour " + data.firstName + ",\n\nDes informations complementaires sont necessaires concernant vos documents d'identite. Nous vous invitons a consulter les details dans votre espace personnel.",
            cta: "Soumettre mes documents"
        },
        en: {
            subject: "Action required on your documents",
            title: "Action required on your documents",
            body: "Hello " + data.firstName + ",\n\nAdditional information is required regarding your identity documents. We invite you to check the details in your personal space.",
            cta: "Submit my documents"
        },
        es: {
            subject: "Accion requerida en sus documentos",
            title: "Accion requerida en sus documentos",
            body: "Hola " + data.firstName + ",\n\nSe requiere informacion adicional sobre sus documentos de identidad. Le invitamos a consultar los detalles en su espacio personal.",
            cta: "Enviar mis documentos"
        },
        it: {
            subject: "Azione richiesta sui tuoi documenti",
            title: "Azione richiesta sui tuoi documenti",
            body: "Buongiorno " + data.firstName + ",\n\nSono richieste informazioni aggiuntive in merito ai tuoi documenti d'identità. Ti invitiamo a consultare i dettagli nel tuo spazio personale.",
            cta: "Invia i miei documenti"
        },
        de: {
            subject: "Aktion fur Ihre Dokumente erforderlich",
            title: "Aktion fur Ihre Dokumente erforderlich",
            body: "Hallo " + data.firstName + ",\n\nZusatzliche Informationen zu Ihren Identitatsdokumenten sind erforderlich. Wir laden Sie ein, die Details in Ihrem personlichen Bereich einzusehen.",
            cta: "Meine Dokumente einreichen"
        },
        nl: {
            subject: "Actie vereist voor uw documenten",
            title: "Actie vereist voor uw documenten",
            body: "Hallo " + data.firstName + ",\n\nEr is aanvullende informatie nodig met betrekking tot uw identiteitsdocumenten. Wij nodigen u uit om de details in uw persoonlijke ruimte te bekijken.",
            cta: "Mijn documenten indienen"
        },
        pl: {
            subject: "Wymagane dzialanie w dokumentach",
            title: "Wymagane dzialanie w dokumentach",
            body: "Witaj " + data.firstName + ",\n\nWymagane sa dodatkowe informacje dotyczące Twoich dokumentow tozsamosci. Zapraszamy do zapoznania sie ze szczegolami w Twoim obszarze osobistym.",
            cta: "Przeslij moje dokumenty"
        },
        pt: {
            subject: "Acao necessaria nos seus documentos",
            title: "Acao necessaria nos seus documentos",
            body: "Ola " + data.firstName + ",\n\nSao necessarias informacoes adicionais sobre os seus documentos de identidade. Convidamo-lo a consultar os detalhes no seu espaco pessoal.",
            cta: "Enviar os meus documentos"
        },
        ro: {
            subject: "Actiune necesara pe documentele dumneavoastra",
            title: "Actiune necesara pe documentele dumneavoastra",
            body: "Buna ziua " + data.firstName + ",\n\nSunt necesare informatii suplimentare cu privire la documentele dumneavoastra de identitate. Va invitam sa consultati detaliile in spatiul dumneavoastra personal.",
            cta: "Trimite documentele mele"
        },
        sv: {
            subject: "Atgard kravs for dina dokument",
            title: "Atgard kravs for dina dokument",
            body: "Hej " + data.firstName + ",\n\nYtterligare information kravs angaende dina identitetshandlingar. Vi bjuder in dig att kontrollera detaljerna i ditt personliga utrymme.",
            cta: "Skicka in mina dokument"
        },
    };

    const t = translations[lang] || translations['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard/verification`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
