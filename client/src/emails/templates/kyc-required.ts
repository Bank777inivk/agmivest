import { emailLayout, btn, APP_URL } from '../layout';

interface KycRequiredData {
  firstName: string;
}

export function kycRequiredTemplate(data: KycRequiredData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: {
      subject: "Verification de votre identite",
      title: "Verification de votre identite",
      body: "Bonjour " + data.firstName + ",\n\nPour permettre la poursuite de l'etude de votre dossier, des pieces complementaires sont necessaires. Nous vous invitons a les soumettre directement dans votre espace personnel.",
      cta: "Soumettre mes documents"
    },
    en: {
      subject: "Identity verification",
      title: "Identity verification",
      body: "Hello " + data.firstName + ",\n\nTo allow the continued review of your file, additional documents are required. We invite you to submit them directly in your personal space.",
      cta: "Submit my documents"
    },
    es: {
      subject: "Verificacion de su identidad",
      title: "Verificacion de su identidad",
      body: "Hola " + data.firstName + ",\n\nPara permitir la continuacion del estudio de su expediente, se requieren documentos adicionales. Le invitamos a enviarlos directamente en su espacio personal.",
      cta: "Enviar mis documentos"
    },
    it: {
      subject: "Verifica della tua identità",
      title: "Verifica della tua identità",
      body: "Buongiorno " + data.firstName + ",\n\nPer consentire la prosecuzione dell'esame della tua pratica, sono necessari documenti aggiuntivi. Ti invitiamo a presentarli direttamente nel tuo spazio personale.",
      cta: "Invia i miei documenti"
    },
    de: {
      subject: "Identitatsprufung",
      title: "Identitatsprufung",
      body: "Hallo " + data.firstName + ",\n\nUm die weitere Prufung Ihrer Akte zu ermoglichen, sind zusatzliche Unterlagen erforderlich. Wir bitten Sie, diese direkt in Ihrem personlichen Bereich einzureichen.",
      cta: "Meine Dokumente einreichen"
    },
    nl: {
      subject: "Identiteitsverificatie",
      title: "Identiteitsverificatie",
      body: "Hallo " + data.firstName + ",\n\nOm de voortzetting van de beoordeling van uw dossier mogelijk te maken, zijn aanvullende documenten vereist. Wij nodigen u uit om deze rechtstreeks in uw persoonlijke ruimte in te dienen.",
      cta: "Mijn documenten indienen"
    },
    pl: {
      subject: "Weryfikacja Twojej tozsamosci",
      title: "Weryfikacja Twojej tozsamosci",
      body: "Witaj " + data.firstName + ",\n\nAby umozliwic dalsza analizę Twojego wniosku, wymagane sa dodatkowe dokumenty. Prosimy o przeslanie ich bezposrednio w Twoim obszarze osobistym.",
      cta: "Przeslij moje dokumenty"
    },
    pt: {
      subject: "Verificacao da sua identidade",
      title: "Verificacao da sua identidade",
      body: "Ola " + data.firstName + ",\n\nPara permitir a continuacao da analise do seu processo, sao necessarios documentos adicionais. Convidamo-lo a envia-los diretamente no seu espaco de cliente.",
      cta: "Enviar os meus documentos"
    },
    ro: {
      subject: "Verificarea identitatii dumneavoastra",
      title: "Verificarea identitatii dumneavoastra",
      body: "Buna ziua " + data.firstName + ",\n\nPentru a permite continuarea analizarii dosarului dumneavoastra, sunt necesare documente suplimentare. Va invitam sa le trimiteti direct in spatiul dumneavoastra personal.",
      cta: "Trimite documentele mele"
    },
    sv: {
      subject: "Identitetsverifiering",
      title: "Identitetsverifiering",
      body: "Hej " + data.firstName + ",\n\nFor att mojliggora den fortsatta granskningen av din fil kravs ytterligare dokument. Vi bjuder in dig att skicka in dessa direkt i ditt personliga utrymme.",
      cta: "Skicka in mina dokument"
    },
  };

  const t = translations[lang] || translations['fr'];
  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
    
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        Toutes les pieces peuvent etre transmises de maniere securisee depuis votre interface de verification.
      </p>
    </div>
    
    ${btn(t.cta, `${APP_URL}/dashboard/verification`)}
  `;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
