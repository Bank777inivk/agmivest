import { emailLayout, btn, APP_URL } from '../layout';
interface SimpleData { firstName: string; }

const kyc_approved: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise à jour de votre dossier — AGM INVEST", title: "Bonjour", body: "Nous vous informons que l'examen de vos documents est terminé. Votre dossier suit son cours conformément aux procédures établies.", cta: "Consulter mon dossier" },
    en: { subject: "Account update — AGM INVEST", title: "Hello", body: "We inform you that the review of your documents is complete. Your file is proceeding in accordance with established procedures.", cta: "View my file" },
    es: { subject: "Actualización de su expediente — AGM INVEST", title: "Hola", body: "Le informamos que el examen de sus documentos ha finalizado. Su expediente sigue su curso de acuerdo con los procedimientos establecidos.", cta: "Ver mi expediente" },
    it: { subject: "Aggiornamento della pratica — AGM INVEST", title: "Buongiorno", body: "Ti informiamo che l'esame dei tuoi documenti è completato. La tua pratica sta procedendo secondo le procedure stabilite.", cta: "Visualizza la mia pratica" },
    de: { subject: "Konto-Aktualisierung — AGM INVEST", title: "Hallo", body: "Wir informieren Sie, dass die Prüfung Ihrer Unterlagen abgeschlossen ist. Ihre Akte nimmt gemäß den festgelegten Verfahren ihren Lauf.", cta: "Meine Akte ansehen" },
    nl: { subject: "Dossier bijwerking — AGM INVEST", title: "Hallo", body: "Wij informeren u dat de beoordeling van uw documenten is voltooid. Uw dossier volgt zijn koers in overeenstemming met de vastgestelde procedures.", cta: "Mijn dossier bekijken" },
    pl: { subject: "Aktualizacja wniosku — AGM INVEST", title: "Witaj", body: "Informujemy, że weryfikacja Twoich dokumentów została zakończona. Twój wniosek postępuje zgodnie z ustalonymi procedurami.", cta: "Zobacz mój wniosek" },
    pt: { subject: "Atualização de processo — AGM INVEST", title: "Olá", body: "Informamos que a análise dos seus documentos está concluída. O seu processo segue o seu curso de acordo com os procedimentos estabelecidos.", cta: "Ver o meu processo" },
    ro: { subject: "Actualizare dosar — AGM INVEST", title: "Bună ziua", body: "Vă informăm că examinarea documentelor dumneavoastră este finalizată. Dosarul dumneavoastră își urmează cursul în conformitate cu procedurile stabilite.", cta: "Vizualizați dosarul" },
    sv: { subject: "Kontouppdatering — AGM INVEST", title: "Hej", body: "Vi informerar dig om att granskningen av dina dokument är klar. Din fil fortskrider i enlighet med fastställda procedurer.", cta: "Se min fil" },
};

const kyc_rejected: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Action requise sur votre dossier — AGM INVEST", title: "Bonjour", body: "Des informations complémentaires sont nécessaires concernant vos documents d'identité. Nous vous invitons à consulter les détails dans votre espace personnel.", cta: "Soumettre mes documents" },
    en: { subject: "Account action required — AGM INVEST", title: "Hello", body: "Additional information is required regarding your identity documents. We invite you to check the details in your personal space.", cta: "Submit my documents" },
    es: { subject: "Acción requerida en su expediente — AGM INVEST", title: "Hola", body: "Se requiere información adicional sobre sus documentos de identidad. Le invitamos a consultar los detalles en su espacio personal.", cta: "Enviar mis documentos" },
    it: { subject: "Azione richiesta sulla tua pratica — AGM INVEST", title: "Buongiorno", body: "Sono richieste informazioni aggiuntive in merito ai tuoi documenti d'identità. Ti invitiamo a consultare i dettagli nel tuo spazio personale.", cta: "Invia i miei documenti" },
    de: { subject: "Kontoaktion erforderlich — AGM INVEST", title: "Hallo", body: "Zusätzliche Informationen zu Ihren Identitätsdokumenten sind erforderlich. Wir laden Sie ein, die Details in Ihrem persönlichen Bereich einzusehen.", cta: "Meine Dokumente einreichen" },
    nl: { subject: "Account actie vereist — AGM INVEST", title: "Hallo", body: "Er is aanvullende informatie nodig met betrekking tot uw identiteitsdocumenten. Wij nodigen u uit om de details in uw persoonlijke ruimte te bekijken.", cta: "Mijn documenten indienen" },
    pl: { subject: "Wymagane działanie we wniosku — AGM INVEST", title: "Witaj", body: "Wymagane są dodatkowe informacje dotyczące Twoich dokumentów tożsamości. Zapraszamy do zapoznania się ze szczegółami w Twoim obszarze osobistym.", cta: "Prześlij moje dokumenty" },
    pt: { subject: "Ação necessária no seu processo — AGM INVEST", title: "Olá", body: "São necessárias informações adicionais sobre os seus documentos de identidade. Convidamo-lo a consultar os detalhes no seu espaço pessoal.", cta: "Enviar os meus documentos" },
    ro: { subject: "Acțiune necesară pe dosar — AGM INVEST", title: "Bună ziua", body: "Sunt necesare informații suplimentare cu privire la documentele dumneavoastră de identitate. Vă invităm să consultați detaliile în spațiul dumneavoastră personal.", cta: "Trimite documentele mele" },
    sv: { subject: "Kontoåtgärd krävs — AGM INVEST", title: "Hej", body: "Ytterligare information krävs angående dina identitetshandlingar. Vi bjuder in dig att kontrollera detaljerna i ditt personliga utrymme.", cta: "Skicka in mina dokument" },
};

export function kycApprovedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = kyc_approved[lang] || kyc_approved['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}

export function kycRejectedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = kyc_rejected[lang] || kyc_rejected['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard/verification`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
