import { emailLayout, btn, APP_URL } from '../layout';

interface SimpleData {
    firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: {
        subject: "Mise à jour de votre vérification — AGM INVEST",
        title: "Votre dossier de vérification a été mis à jour",
        body: "Pour finaliser votre dossier, nous avons réinitialisé votre étape de vérification d'identité. Veuillez soumettre à nouveau vos documents pour régulariser votre situation.",
        cta: "Soumettre mes documents"
    },
    en: {
        subject: "Verification update — AGM INVEST",
        title: "Your verification file has been updated",
        body: "To finalize your file, we have reset your identity verification step. Please resubmit your documents to regularize your situation.",
        cta: "Submit my documents"
    },
    es: {
        subject: "Actualización de su verificación — AGM INVEST",
        title: "Su expediente de verificación ha sido actualizado",
        body: "Para finalizar su expediente, hemos reiniciado su paso de verificación de identidad. Por favor envíe de nuevo sus documentos para regularizar su situación.",
        cta: "Enviar mis documentos"
    },
    it: {
        subject: "Aggiornamento della tua verifica — AGM INVEST",
        title: "La tua pratica di verifica è stata aggiornata",
        body: "Per finalizzare la tua pratica, abbiamo ripristinato la tua fase di verifica dell'identità. Invia nuovamente i tuoi documenti per regolarizzare la tua situazione.",
        cta: "Invia i miei documenti"
    },
    de: {
        subject: "Aktualisierung Ihrer Verifizierung — AGM INVEST",
        title: "Ihre Verifizierungsakte wurde aktualisiert",
        body: "Um Ihre Akte abzuschließen, haben wir Ihren Schritt zur Identitätsverifizierung zurückgesetzt. Bitte reichen Sie Ihre Dokumente erneut ein, um Ihre Situation zu bereigen.",
        cta: "Meine Dokumente einreichen"
    },
    nl: {
        subject: "Bijwerking van uw verificatie — AGM INVEST",
        title: "Uw verificatiedossier is bijgewerkt",
        body: "Om uw dossier te voltooien, hebben we uw identiteitsverificatiestap gereset. Stuur uw documenten opnieuw in om uw situatie te regulariseren.",
        cta: "Mijn documenten indienen"
    },
    pl: {
        subject: "Aktualizacja Twojej weryfikacji — AGM INVEST",
        title: "Twoja dokumentacja weryfikacyjna została zaktualizowana",
        body: "W celu sfinalizowania dokumentacji zresetowaliśmy Twój etap weryfikacji tożsamości. Prześlij ponownie swoje dokumenty, aby uregulować sytuację.",
        cta: "Prześlij moje dokumenty"
    },
    pt: {
        subject: "Atualização da sua verificação — AGM INVEST",
        title: "O seu processo de verificação foi atualizado",
        body: "Para finalizar o seu processo, reiniciámos o seu passo de verificação de identidade. Por favor, envie novamente os seus documentos para regularizar a sua situação.",
        cta: "Enviar os meus documentos"
    },
    ro: {
        subject: "Actualizarea verificării dvs. — AGM INVEST",
        title: "Dosarul dvs. de verificare a fost actualizat",
        body: "Pentru a finaliza dosarul dvs., am resetat etapa de verificare a identității. Vă rugăm să trimiteți din nou documentele pentru a vă regulariza situația.",
        cta: "Trimite documentele mele"
    },
    sv: {
        subject: "Uppdatering av din verifiering — AGM INVEST",
        title: "Din verifieringsfil har uppdaterats",
        body: "För att slutföra din fil har vi återställt ditt steg för identitetsverifiering. Skicka in dina dokument igen för att reglera din situation.",
        cta: "Skicka in mina dokument"
    },
};

export function kycResetTemplate(data: SimpleData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];
    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    ${btn(t.cta, `${APP_URL}/dashboard/verification`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
