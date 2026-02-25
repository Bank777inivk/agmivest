import { emailLayout, btn, APP_URL } from '../layout';

interface KycRequiredData {
  firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
  fr: { subject: "Mise a jour de votre dossier — AGM INVEST", title: "Bonjour", body: "Pour permettre la poursuite de l'etude de votre dossier, des pieces complementaires sont necessaires. Nous vous invitons a les soumettre directement dans votre espace personnel.", cta: "Soumettre mes documents" },
  en: { subject: "Account update — AGM INVEST", title: "Hello", body: "To allow the continued review of your file, additional documents are required. We invite you to submit them directly in your personal space.", cta: "Submit my documents" },
  es: { subject: "Actualización de su expediente — AGM INVEST", title: "Hola", body: "Para permitir la continuación del estudio de su expediente, se requieren documentos adicionales. Le invitamos a enviarlos directamente en su espacio personal.", cta: "Enviar mis documentos" },
  it: { subject: "Aggiornamento della pratica — AGM INVEST", title: "Buongiorno", body: "Per consentire la prosecuzione dell'esame della tua pratica, sono necessari documenti aggiuntivi. Ti invitiamo a presentarli direttamente nel tuo spazio personale.", cta: "Invia i miei documenti" },
  de: { subject: "Konto-Aktualisierung — AGM INVEST", title: "Hallo", body: "Um die weitere Prüfung Ihrer Akte zu ermöglichen, sind zusätzliche Unterlagen erforderlich. Wir bitten Sie, diese direkt in Ihrem persönlichen Bereich einzureichen.", cta: "Meine Dokumente einreichen" },
  nl: { subject: "Dossier bijwerking — AGM INVEST", title: "Hallo", body: "Om de voortzetting van de beoordeling van uw dossier mogelijk te maken, zijn aanvullende documenten vereist. Wij nodigen u uit om deze rechtstreeks in uw persoonlijke ruimte in te dienen.", cta: "Mijn documenten indienen" },
  pl: { subject: "Aktualizacja wniosku — AGM INVEST", title: "Witaj", body: "Aby umożliwić dalszą analizę Twojego wniosku, wymagane są dodatkowe dokumenty. Prosimy o przesłanie ich bezpośrednio w Twoim obszarze osobistym.", cta: "Prześlij moje dokumenty" },
  pt: { subject: "Atualização de processo — AGM INVEST", title: "Olá", body: "Para permitir a continuação da análise do seu processo, são necessários documentos adicionais. Convidamo-lo a enviá-los diretamente no seu espaço de cliente.", cta: "Enviar os meus documentos" },
  ro: { subject: "Actualizare dosar — AGM INVEST", title: "Bună ziua", body: "Pentru a permite continuarea analizării dosarului dumneavoastră, sunt necesare documente suplimentare. Vă invităm să le trimiteți direct în spațiul dumneavoastră personal.", cta: "Trimite documentele mele" },
  sv: { subject: "Kontouppdatering — AGM INVEST", title: "Hej", body: "För att möjliggöra den fortsatta granskningen av din fil krävs ytterligare dokument. Vi bjuder in dig att skicka in dessa direkt i ditt personliga utrymme.", cta: "Skicka in mina dokument" },
};

export function kycRequiredTemplate(data: KycRequiredData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];
  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        Toutes les pieces peuvent etre transmises de maniere securisee depuis votre interface de verification.
      </p>
    </div>
    
    ${btn(t.cta, `${APP_URL}/dashboard/verification`)}
  `;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
