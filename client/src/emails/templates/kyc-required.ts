import { emailLayout, btn, APP_URL } from '../layout';

interface KycRequiredData {
  firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; docs: string[]; cta: string }> = {
  fr: { subject: "Documents requis - AGM INVEST", title: "Nous avons besoin de vos documents d'identit&eacute;", body: "Votre dossier avance ! Pour poursuivre l'examen de votre demande, nous avons besoin de v&eacute;rifier votre identit&eacute;. Veuillez soumettre les documents suivants :", docs: ["Pi&egrave;ce d'identit&eacute; (recto/verso)", "Justificatif de domicile"], cta: "Soumettre mes documents" },
  en: { subject: "Documents required — AGM INVEST", title: "We need your identity documents", body: "Your file is progressing! To continue reviewing your application, we need to verify your identity. Please submit the following documents:", docs: ["Identity document (front/back)", "Proof of address"], cta: "Submit my documents" },
  es: { subject: "Documentos requeridos — AGM INVEST", title: "Necesitamos sus documentos de identidad", body: "¡Su expediente avanza! Para continuar revisando su solicitud, necesitamos verificar su identidad. Por favor envíe los siguientes documentos:", docs: ["Documento de identidad (anverso/reverso)", "Justificante de domicilio"], cta: "Enviar mis documentos" },
  it: { subject: "Documenti richiesti — AGM INVEST", title: "Abbiamo bisogno dei tuoi documenti di identità", body: "La tua pratica sta avanzando! Per continuare a esaminare la tua richiesta, dobbiamo verificare la tua identità. Si prega di presentare i seguenti documenti:", docs: ["Documento d'identità (fronte/retro)", "Prova di residenza"], cta: "Invia i miei documenti" },
  de: { subject: "Dokumente erforderlich — AGM INVEST", title: "Wir benötigen Ihre Identitätsdokumente", body: "Ihre Akte schreitet voran! Um Ihren Antrag weiter prüfen zu können, müssen wir Ihre Identität verifizieren. Bitte reichen Sie folgende Dokumente ein:", docs: ["Personalausweis (Vorder-/Rückseite)", "Adressnachweis"], cta: "Meine Dokumente einreichen" },
  nl: { subject: "Documenten vereist — AGM INVEST", title: "We hebben uw identiteitsdocumenten nodig", body: "Uw dossier vordert! Om uw aanvraag verder te beoordelen, moeten we uw identiteit verifiëren. Stuur de volgende documenten op:", docs: ["Identiteitsbewijs (voor-/achterkant)", "Bewijs van adres"], cta: "Mijn documenten indienen" },
  pl: { subject: "Wymagane dokumenty — AGM INVEST", title: "Potrzebujemy Twoich dokumentów tożsamości", body: "Twoja dokumentacja postępuje! Aby kontynuować rozpatrywanie Twojego wniosku, musimy zweryfikować Twoją tożsamość. Prześlij następujące dokumenty:", docs: ["Dokument tożsamości (przód/tył)", "Dowód zamieszkania"], cta: "Prześlij moje dokumenty" },
  pt: { subject: "Documentos necessários — AGM INVEST", title: "Precisamos dos seus documentos de identidade", body: "O seu processo está avançando! Para continuar analisando o seu pedido, precisamos verificar a sua identidade. Por favor, envie os seguintes documentos:", docs: ["Documento de identidade (frente/verso)", "Comprovativo de morada"], cta: "Enviar os meus documentos" },
  ro: { subject: "Documente necesare — AGM INVEST", title: "Avem nevoie de documentele dvs. de identitate", body: "Dosarul dvs. avansează! Pentru a continua examinarea cererii, trebuie să vă verificăm identitatea. Vă rugăm să trimiteți următoarele documente:", docs: ["Act de identitate (față/verso)", "Dovadă de domiciliu"], cta: "Trimite documentele mele" },
  sv: { subject: "Dokument krävs — AGM INVEST", title: "Vi behöver dina identitetshandlingar", body: "Din fil framskrider! För att fortsätta granska din ansökan måste vi verifiera din identitet. Vänligen skicka in följande dokument:", docs: ["Identitetshandling (fram-/baksida)", "Adressbevis"], cta: "Skicka in mina dokument" },
};

export function kycRequiredTemplate(data: KycRequiredData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];
  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    <ul style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 20px 20px 40px;margin:0 0 24px;">
      ${t.docs.map(d => `<li style="font-size:14px;color:#1E3A5F;font-weight:600;padding:4px 0;">${d}</li>`).join('')}
    </ul>
    ${btn(t.cta, `${APP_URL}/dashboard/verification`)}
  `;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
