import { emailLayout, btn, APP_URL } from '../layout';

interface KycReminderData {
  firstName: string;
}

export function kycReminderTemplate(data: KycReminderData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: {
      subject: "Relance : Verification de votre identite",
      title: "Action requise",
      body: `Bonjour ${data.firstName},\n\nVotre verification d'identite vous attend pour la finalisation de votre demande. Les prochaines etapes de votre dossier sont bloquees jusqu'a reception de vos documents.`,
      cta: "Finaliser ma demande"
    },
    en: {
      subject: "Reminder: Identity verification",
      title: "Action required",
      body: `Hello ${data.firstName},\n\nYour identity verification is waiting for you to finalize your request. The next steps of your file are blocked until we receive your documents.`,
      cta: "Finalize my request"
    },
    es: {
      subject: "Recordatorio: Verificación de su identidad",
      title: "Acción requerida",
      body: `Hola ${data.firstName},\n\nSu verificación de identidad le espera para finalizar su solicitud. Los siguientes pasos de su expediente están bloqueados hasta recibir sus documentos.`,
      cta: "Finalizar mi solicitud"
    },
    it: {
      subject: "Promemoria: Verifica della tua identità",
      title: "Azione richiesta",
      body: `Buongiorno ${data.firstName},\n\nLa tua verifica dell'identità ti aspetta per finalizzare la tua richiesta. Le fasi successive della tua pratica sono bloccate fino al ricevimento dei tuoi documenti.`,
      cta: "Finalizza la mia richiesta"
    },
    de: {
      subject: "Erinnerung: Identitätsprüfung",
      title: "Aktion erforderlich",
      body: `Hallo ${data.firstName},\n\nIhre Identitätsprüfung wartet auf Sie, um Ihre Anfrage abzuschließen. Die nächsten Schritte Ihrer Akte sind blockiert, bis wir Ihre Dokumente erhalten.`,
      cta: "Meine Anfrage abschließen"
    },
    nl: {
      subject: "Herinnering: Identiteitsverificatie",
      title: "Actie vereist",
      body: `Hallo ${data.firstName},\n\nUw identiteitsverificatie wacht op u om uw aanvraag af te ronden. De volgende stappen van uw dossier zijn geblokkeerd totdat wij uw documenten hebben ontvangen.`,
      cta: "Mijn aanvraag afronden"
    },
    pl: {
      subject: "Przypomnienie: Weryfikacja Twojej tożsamości",
      title: "Wymagane działanie",
      body: `Witaj ${data.firstName},\n\nTwoja weryfikacja tożsamości czeka na Ciebie, aby sfinalizować wniosek. Kolejne etapy Twojej sprawy są zablokowane do czasu otrzymania dokumentów.`,
      cta: "Zakończ mój wniosek"
    },
    pt: {
      subject: "Lembrete: Verificação da sua identidade",
      title: "Ação necessária",
      body: `Olá ${data.firstName},\n\nA sua verificação de identidade aguarda por si para finalizar o seu pedido. Os próximos passos do seu processo estão bloqueados até recebermos os seus documentos.`,
      cta: "Finalizar o meu pedido"
    },
    ro: {
      subject: "Memento: Verificarea identității dumneavoastră",
      title: "Acțiune necesară",
      body: `Bună ziua ${data.firstName},\n\nVerificarea identității dumneavoastră vă așteaptă pentru a finaliza cererea. Următoarele etape ale dosarului dumneavoastră sunt blocate până la primirea documentelor.`,
      cta: "Finalizează cererea mea"
    },
    sv: {
      subject: "Påminnelse: Identitetsverifiering",
      title: "Åtgärd krävs",
      body: `Hej ${data.firstName},\n\nDin identitetsverifiering väntar på dig för att slutföra din begäran. Nästa steg i din fil är blockerade tills vi får dina dokument.`,
      cta: "Slutför min begäran"
    },
  };

  const t = translations[lang] || translations['fr'];
  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
    
    <div style="background:#FFFBF0;border:1px solid #FDE68A;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#92400E;font-weight:600;margin:0;line-height:1.6;">
        Toutes les pieces peuvent etre transmises de maniere securisee depuis votre interface de verification.
      </p>
    </div>
    
    ${btn(t.cta, `${APP_URL}/dashboard/verification`)}
  `;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
