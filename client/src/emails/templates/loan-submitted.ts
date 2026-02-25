import { emailLayout, btn, APP_URL } from '../layout';

interface LoanSubmittedData {
  firstName: string;
}

export function loanSubmittedTemplate(data: LoanSubmittedData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
    fr: {
      subject: "Confirmation de votre demande",
      title: "Confirmation de votre demande",
      body: "Bonjour " + data.firstName + ",\n\nNous vous confirmons avoir bien recu les informations transmises pour votre dossier. Nos services procedent actuellement a leur etude.",
      cta: "Suivre mon dossier",
      info: "Vous pouvez consulter l'etat d'avancement de votre dossier a tout moment depuis votre espace securise."
    },
    en: {
      subject: "Confirmation of your request",
      title: "Confirmation of your request",
      body: "Hello " + data.firstName + ",\n\nWe confirm that we have received the information submitted for your file. Our services are currently reviewing them.",
      cta: "Track my file",
      info: "You can check the progress of your file at any time from your secure space."
    },
    es: {
      subject: "Confirmacion de su solicitud",
      title: "Confirmacion de su solicitud",
      body: "Hola " + data.firstName + ",\n\nLe confirmamos que hemos recibido la informacion enviada para su expediente. Nuestros servicios estan procediendo a su estudio.",
      cta: "Seguir mi expediente",
      info: "Puede consultar el progreso de su expediente en cualquier momento desde su espacio seguro."
    },
    it: {
      subject: "Conferma della tua richiesta",
      title: "Conferma della tua richiesta",
      body: "Buongiorno " + data.firstName + ",\n\nTi confermiamo di aver ricevuto le informazioni inviate per la tua pratica. I nostri servizi stanno procedendo al loro esame.",
      cta: "Segui la mia pratica",
      info: "Puoi controllare lo stato di avanzamento della tua pratica in qualsiasi momento dal tuo spazio sicuro."
    },
    de: {
      subject: "Bestatigung Ihres Antrags",
      title: "Bestatigung Ihres Antrags",
      body: "Hallo " + data.firstName + ",\n\nWir bestatigen den Erhalt der fur Ihre Akte ubermittelten Informationen. Unsere Dienste prufen diese derzeit.",
      cta: "Meine Akte verfolgen",
      info: "Sie konnen den Fortschritt Ihrer Akte jederzeit in Ihrem sicheren Bereich einsehen."
    },
    nl: {
      subject: "Bevestiging van uw aanvraag",
      title: "Bevestiging van uw aanvraag",
      body: "Hallo " + data.firstName + ",\n\nWij bevestigen de ontvangst van de voor uw dossier verzonden informatie. Onze diensten zijn momenteers bezig met de beoordeling ervan.",
      cta: "Mijn dossier volgen",
      info: "U kunt de voortgang van uw dossier op elk moment bekijken vanuit uw beveiligde ruimte."
    },
    pl: {
      subject: "Potwierdzenie Twojego wniosku",
      title: "Potwierdzenie Twojego wniosku",
      body: "Witaj " + data.firstName + ",\n\nPotwierdzamy otrzymanie informacji przeslanych do Twojego wniosku. Nasze sluzby sa w trakcie ich analizowania.",
      cta: "Sledz moj wniosek",
      info: "W kazdej chwili mozesz sprawdzic postepy w rozpatrywaniu swojego wniosku w swoim bezpiecznym obszarze."
    },
    pt: {
      subject: "Confirmacao do seu pedido",
      title: "Confirmacao do seu pedido",
      body: "Ola " + data.firstName + ",\n\nConfirmamos a rececao das informacoes enviadas para o seu processo. Os nossos servicos estao a proceder a sua analise.",
      cta: "Acompanhar o meu processo",
      info: "Pode consultar le estado de progresso do seu processo a qualquer momento a partir do seu espaco seguro."
    },
    ro: {
      subject: "Confirmarea cererii dumneavoastra",
      title: "Confirmarea cererii dumneavoastra",
      body: "Buna ziua " + data.firstName + ",\n\nVa confirmam ca am primit informatiile transmise pentru dosarul dumneavoastra. Serviciile noastre procedeaza in prezent la analizarea acestora.",
      cta: "Urmariti dosarul meu",
      info: "Puteti verifica starea de progres a dosarului dumneavoastra in orice moment din spatiul dumneavoastra securizat."
    },
    sv: {
      subject: "Bekraftelse av din ansokan",
      title: "Bekraftelse av din ansokan",
      body: "Hej " + data.firstName + ",\n\nVi bekraftar att vi har tagit emot den information som skickats for din fil. Vara tjanster granskar dem just nu.",
      cta: "Folj min fil",
      info: "Du kan kontrollera framstegen for din fil nar som helst fran ditt sakra utrymme."
    },
  };

  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        ${t.info}
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
