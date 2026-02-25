import { emailLayout, btn, APP_URL } from '../layout';

interface LoanSubmittedData {
  firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
  fr: {
    subject: "Accusé de réception de votre dossier — AGM INVEST",
    title: "Bonjour",
    body: "Nous vous confirmons avoir bien reçu les informations transmises pour votre dossier. Nos services procèdent actuellement à leur étude.",
    cta: "Suivre mon dossier",
    info: "Vous pouvez consulter l'état d'avancement de votre dossier à tout moment depuis votre espace sécurisé."
  },
  en: {
    subject: "File reception confirmation — AGM INVEST",
    title: "Hello",
    body: "We confirm that we have received the information submitted for your file. Our services are currently reviewing them.",
    cta: "Track my file",
    info: "You can check the progress of your file at any time from your secure space."
  },
  es: {
    subject: "Confirmación de recepción de expediente — AGM INVEST",
    title: "Hola",
    body: "Le confirmamos que hemos recibido la información enviada para su expediente. Nuestros servicios están procediendo a su estudio.",
    cta: "Seguir mi expediente",
    info: "Puede consultar el progreso de su expediente en cualquier momento desde su espacio seguro."
  },
  it: {
    subject: "Conferma ricezione pratica — AGM INVEST",
    title: "Buongiorno",
    body: "Ti confermiamo di aver ricevuto le informazioni inviate per la tua pratica. I nostri servizi stanno procedendo al loro esame.",
    cta: "Segui la mia pratica",
    info: "Puoi controllare lo stato di avanzamento della tua pratica in qualsiasi momento dal tuo spazio sicuro."
  },
  de: {
    subject: "Eingangsbestätigung Ihres Antrags — AGM INVEST",
    title: "Hallo",
    body: "Wir bestätigen den Erhalt der für Ihre Akte übermittelten Informationen. Unsere Dienste prüfen diese derzeit.",
    cta: "Meine Akte verfolgen",
    info: "Sie können den Fortschritt Ihrer Akte jederzeit in Ihrem sicheren Bereich einsehen."
  },
  nl: {
    subject: "Ontvangstbevestiging van uw dossier — AGM INVEST",
    title: "Hallo",
    body: "Wij bevestigen de ontvangst van de voor uw dossier verzonden informatie. Onze diensten zijn momenteers bezig met de beoordeling ervan.",
    cta: "Mijn dossier volgen",
    info: "U kunt de voortgang van uw dossier op elk moment bekijken vanuit uw beveiligde ruimte."
  },
  pl: {
    subject: "Potwierdzenie otrzymania wniosku — AGM INVEST",
    title: "Witaj",
    body: "Potwierdzamy otrzymanie informacji przesłanych do Twojego wniosku. Nasze służby są w trakcie ich analizowania.",
    cta: "Śledź mój wniosek",
    info: "W każdej chwili możesz sprawdzić postępy w rozpatrywaniu swojego wniosku w swoim bezpiecznym obszarze."
  },
  pt: {
    subject: "Confirmação de receção de processo — AGM INVEST",
    title: "Olá",
    body: "Confirmamos a receção das informações enviadas para o seu processo. Os nossos serviços estão a proceder à sua análise.",
    cta: "Acompanhar o meu processo",
    info: "Pode consultar o estado de progresso do seu processo a qualquer momento a partir do seu espaço seguro."
  },
  ro: {
    subject: "Confirmare recepție dosar — AGM INVEST",
    title: "Bună ziua",
    body: "Vă confirmăm că am primit informațiile transmise pentru dosarul dumneavoastră. Serviciile noastre procedează în prezent la analizarea acestora.",
    cta: "Urmăriți dosarul meu",
    info: "Puteți verifica starea de progres a dosarului dumneavoastră în orice moment din spațiul dumneavoastră securizat."
  },
  sv: {
    subject: "Bekräftelse på mottagande av fil — AGM INVEST",
    title: "Hej",
    body: "Vi bekräftar att vi har tagit emot den information som skickats för din fil. Våra tjänster granskar dem just nu.",
    cta: "Följ min fil",
    info: "Du kan kontrollera framstegen för din fil när som helst från ditt säkra utrymme."
  },
};

export function loanSubmittedTemplate(data: LoanSubmittedData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        ${t.info}
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
