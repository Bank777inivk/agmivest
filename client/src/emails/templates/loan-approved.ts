import { emailLayout, btn, APP_URL } from '../layout';

interface LoanApprovedData {
  firstName: string;
}

export function loanApprovedTemplate(data: LoanApprovedData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
    fr: {
      subject: "Approbation de votre demande",
      title: "Approbation de votre demande",
      body: "Bonjour " + data.firstName + ",\n\nNous avons le plaisir de vous informer que votre dossier a ete mis a jour avec une decision favorable. Vous pouvez desormais finaliser les dernieres etapes de votre demande.",
      cta: "Acceder a mon espace",
      info: "Consultez votre espace personnel pour decouvrir les prochaines etapes de votre dossier."
    },
    en: {
      subject: "Approval of your request",
      title: "Approval of your request",
      body: "Hello " + data.firstName + ",\n\nWe are pleased to inform you that your file has been updated with a favorable decision. You can now finalize the last steps of your request.",
      cta: "Access my space",
      info: "Visit your personal space to discover the next steps for your file."
    },
    es: {
      subject: "Aprobacion de su solicitud",
      title: "Aprobacion de su solicitud",
      body: "Hola " + data.firstName + ",\n\nNos complace informarle que su expediente ha sido actualizado con una decision favorable. Ahora puede finalizar los ultimos pasos de su solicitud.",
      cta: "Acceder a mi espacio",
      info: "Consulte su espacio personal para descubrir los proximos pasos de su expediente."
    },
    it: {
      subject: "Approvazione della tua richiesta",
      title: "Approvazione della tua richiesta",
      body: "Buongiorno " + data.firstName + ",\n\nSiamo lieti di informarti che la tua pratica è stata aggiornata con una decisione favorevole. Ora puoi finalizzare gli ultimi passaggi della tua richiesta.",
      cta: "Accedi al mio spazio",
      info: "Visita il tuo spazio personale per scoprire i prossimi passaggi della tua pratica."
    },
    de: {
      subject: "Genehmigung Ihres Antrags",
      title: "Genehmigung Ihres Antrags",
      body: "Hallo " + data.firstName + ",\n\nWir freuen uns, Ihnen mitteilen zu konnen, dass Ihre Akte positiv aktualisiert wurde. Sie konnen nun die letzten Schritte Ihres Antrags abschließen.",
      cta: "Meinen Bereich ansehen",
      info: "Besuchen Sie Ihren personlichen Bereich, um die nachsten Schritte fur Ihre Akte zu erfahren."
    },
    nl: {
      subject: "Goedkeuring van uw aanvraag",
      title: "Goedkeuring van uw aanvraag",
      body: "Hallo " + data.firstName + ",\n\nWij zijn verheugd u te informeren dat uw dossier positief is bijgewerkt. U kunt nu de laatste stappen van uw aanvraag afronden.",
      cta: "Toegang tot mijn ruimte",
      info: "Bezoek uw persoonlijke ruimte om de volgende stappen voor uw dossier te ontdekken."
    },
    pl: {
      subject: "Zatwierdzenie Twojego wniosku",
      title: "Zatwierdzenie Twojego wniosku",
      body: "Witaj " + data.firstName + ",\n\nZ przyjemnoscia informujemy, ze Twoj wniosek zostal pozytywnie zatwierdzony. Mozesz teraz sfinalizowac ostatnie etapy swojego wniosku.",
      cta: "Zobacz moj obszar",
      info: "Odwiedz swoj obszar osobisty, aby poznac kolejne etapy rozpatrywania Twojego wniosku."
    },
    pt: {
      subject: "Aprovacao do seu pedido",
      title: "Aprovacao do seu pedido",
      body: "Ola " + data.firstName + ",\n\nTemos o prazer de informar que o seu processo foi atualizado com uma decisao favoravel. Pode agora finalizar os ultimos passos do seu pedido.",
      cta: "Aceder ao meu espaco",
      info: "Consulte o seu espaco pessoal para descobrir os proximos passos do seu processo."
    },
    ro: {
      subject: "Aprobarea cererii dumneavoastra",
      title: "Aprobarea cererii dumneavoastra",
      body: "Buna ziua " + data.firstName + ",\n\nSuntem bucurosi sa va informam ca dosarul dumneavoastra a fost actualizat cu o decizie favorabila. Acum puteti finaliza ultimii pasi ai cererii.",
      cta: "Accesare spatiul meu",
      info: "Vizitati spatiul dumneavoastra personal pentru a descoperi urmatorii pasi pentru dosarul dumneavoastra."
    },
    sv: {
      subject: "Godkannande av din ansokan",
      title: "Godkannande av din ansokan",
      body: "Hej " + data.firstName + ",\n\nVi ar glada att meddela att din fil har uppdaterats med ett positivt beslut. Du kan nu slutfora de sista stegen i din ansokan.",
      cta: "Se mitt utrymme",
      info: "Besok ditt personliga utrymme for att upptacka nasta steg for din fil."
    },
  };

  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#16A34A;font-weight:600;margin:0;line-height:1.6;">
        ${t.info}
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
