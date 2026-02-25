import { emailLayout, btn, APP_URL } from '../layout';
interface SimpleData { firstName: string; }

const kyc_approved: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise à jour de votre dossier - AGM INVEST", title: "Vos documents ont été examinés", body: "Nous vous informons que l'examen de vos documents est terminé. Votre dossier suit son cours normalement.", cta: "Voir mon dossier" },
    en: { subject: "Document update — AGM INVEST", title: "Your documents have been reviewed", body: "Excellent! Your documents have been reviewed and validated by our team. Your file continues to progress.", cta: "View my file" },
    es: { subject: "Actualización de documentos — AGM INVEST", title: "Sus documentos han sido revisados", body: "¡Excelente! Sus documentos han sido revisados y validados por nuestro equipo. Su expediente continúa progresando.", cta: "Ver mi expediente" },
    it: { subject: "Aggiornamento documenti — AGM INVEST", title: "I tuoi documenti sono stati revisionati", body: "Ottimo! I tuoi documenti sono stati esaminati e validati dal nostro team. La tua pratica continua a progredire.", cta: "Visualizza la mia pratica" },
    de: { subject: "Dokumenten-Update — AGM INVEST", title: "Ihre Dokumente wurden geprüft", body: "Ausgezeichnet! Ihre Ausweisdokumente wurden von unserem Team geprüft und validiert. Ihre Akte macht weitere Fortschritte.", cta: "Meine Akte ansehen" },
    nl: { subject: "Documenten update — AGM INVEST", title: "Uw documenten zijn gecontroleerd", body: "Uitstekend! Uw identiteitsdocumenten zijn beoordeeld en gevalideerd door ons team. Uw dossier blijft vorderen.", cta: "Mijn dossier bekijken" },
    pl: { subject: "Aktualizacja dokumentów — AGM INVEST", title: "Twoje dokumenty zostały zweryfikowane", body: "Doskonale! Twoje dokumenty tożsamości zostały sprawdzone i zatwierdzone przez nasz zespół. Twoja dokumentacja postępuje.", cta: "Zobacz mój wniosek" },
    pt: { subject: "Atualização de documentos — AGM INVEST", title: "Os seus documentos foram verificados", body: "Excelente! Os seus documentos de identidade foram analisados e validados pela nossa equipa. O seu processo continua a progredir.", cta: "Ver o meu processo" },
    ro: { subject: "Actualizare documente — AGM INVEST", title: "Documentele dvs. au fost verificate", body: "Excelent! Documentele de identitate au fost examinate și validate de echipa noastră. Dosarul dvs. continuă să progreseze.", cta: "Vizualizați dosarul" },
    sv: { subject: "Dokumentuppdatering — AGM INVEST", title: "Dina dokument har granskats", body: "Utmärkt! Dina identitetshandlingar har granskats och validerats av vårt team. Din fil fortsätter att gå framåt.", cta: "Se min fil" },
};

const kyc_rejected: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise à jour de votre dossier - AGM INVEST", title: "Action requise sur vos documents", body: "Certains documents transmis n'ont pas pu être validés en l'état. Pourriez-vous nous les transmettre de nouveau ?", cta: "Envoyer les documents" },
    en: { subject: "Document update — AGM INVEST", title: "Your documents could not be validated", body: "Unfortunately, your documents could not be accepted. Please submit new compliant documents to continue your application.", cta: "Submit my documents" },
    es: { subject: "Actualización de documentos — AGM INVEST", title: "Sus documentos no pudieron ser validados", body: "Lamentablemente, sus documentos de identidad no pudieron ser aceptados. Por favor envíe nuevos documentos conformes para continuar su expediente.", cta: "Enviar mis documentos" },
    it: { subject: "Aggiornamento documenti — AGM INVEST", title: "I tuoi documenti non hanno potuto essere validati", body: "Purtroppo, i tuoi documents di identità non hanno potuto essere accettati. Invia nuovi documenti conformi per continuare la tua pratica.", cta: "Invia i miei documenti" },
    de: { subject: "Dokumenten-Update — AGM INVEST", title: "Ihre Dokumente konnten nicht validiert werden", body: "Leider konnten Ihre Ausweisdokumente nicht akzeptiert werden. Bitte reichen Sie neue konforme Dokumente ein, um Ihre Akte fortzuführen.", cta: "Meine Dokumente einreichen" },
    nl: { subject: "Documenten update — AGM INVEST", title: "Uw documenten konden niet worden gevalideerd", body: "Helaas konden uw identiteitsdocumenten niet worden geaccepteerd. Stuur nieuwe conforme documenten in om uw dossier voort te zetten.", cta: "Mijn documenten indienen" },
    pl: { subject: "Aktualizacja dokumentów — AGM INVEST", title: "Twoje dokumenty nie mogły zostać zweryfikowane", body: "Niestety Twoje dokumenty tożsamości nie mogły zostać zaakceptowane. Prześlij nowe zgodne dokumenty, aby kontynuować wniosek.", cta: "Prześlij moje dokumenty" },
    pt: { subject: "Atualização de documentos — AGM INVEST", title: "Os seus documentos não puderam ser validados", body: "Infelizmente, os seus documentos de identidade não puderam ser aceites. Por favor, envie novos documentos conformes para continuar o seu processo.", cta: "Enviar os meus documentos" },
    ro: { subject: "Actualizare documente — AGM INVEST", title: "Documentele dvs. nu au putut fi validate", body: "Din păcate, documentele de identitate nu au putut fi acceptate. Vă rugăm trimiteți noi documente conforme pentru a continua dosarul.", cta: "Trimite documentele mele" },
    sv: { subject: "Dokumentuppdatering — AGM INVEST", title: "Dina dokument kunde inte valideras", body: "Tyvärr kunde dina identitetshandlingar inte accepteras. Skicka in nya dokument för att fortsätta din ansökan.", cta: "Skicka in mina dokument" },
};

export function kycApprovedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = kyc_approved[lang] || kyc_approved['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}

export function kycRejectedTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = kyc_rejected[lang] || kyc_rejected['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${btn(t.cta, `${APP_URL}/dashboard/verification`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
