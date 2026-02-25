import { emailLayout, btn, APP_URL } from '../layout';

interface LoanApprovedData {
  firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
  fr: {
    subject: "Mise à jour de votre dossier — AGM INVEST",
    title: "Bonjour",
    body: "Nous avons le plaisir de vous informer que votre dossier a été mis à jour avec une décision favorable. Vous pouvez désormais finaliser les dernières étapes de votre demande.",
    cta: "Accéder à mon espace",
    info: "Consultez votre espace personnel pour découvrir les prochaines étapes de votre dossier."
  },
  en: {
    subject: "Account update — AGM INVEST",
    title: "Hello",
    body: "We are pleased to inform you that your file has been updated with a favorable decision. You can now finalize the last steps of your request.",
    cta: "Access my space",
    info: "Visit your personal space to discover the next steps for your file."
  },
  es: {
    subject: "Actualización de su expediente — AGM INVEST",
    title: "Hola",
    body: "Nos complace informarle que su expediente ha sido actualizado con una decisión favorable. Ahora puede finalizar los últimos pasos de su solicitud.",
    cta: "Acceder a mi espacio",
    info: "Consulte su espacio personal para descubrir los próximos pasos de su expediente."
  },
  it: {
    subject: "Aggiornamento della pratica — AGM INVEST",
    title: "Buongiorno",
    body: "Siamo lieti di informarti che la tua pratica è stata aggiornata con una decisione favorevole. Ora puoi finalizzare gli ultimi passaggi della tua richiesta.",
    cta: "Accedi al mio spazio",
    info: "Visita il tuo spazio personale per scoprire i prossimi passaggi della tua pratica."
  },
  de: {
    subject: "Konto-Aktualisierung — AGM INVEST",
    title: "Hallo",
    body: "Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Akte positiv aktualisiert wurde. Sie können nun die letzten Schritte Ihres Antrags abschließen.",
    cta: "Meinen Bereich ansehen",
    info: "Besuchen Sie Ihren persönlichen Bereich, um die nächsten Schritte für Ihre Akte zu erfahren."
  },
  nl: {
    subject: "Dossier bijwerking — AGM INVEST",
    title: "Hallo",
    body: "Wij zijn verheugd u te informeren dat uw dossier positief is bijgewerkt. U kunt nu de laatste stappen van uw aanvraag afronden.",
    cta: "Toegang tot mijn ruimte",
    info: "Bezoek uw persoonlijke ruimte om de volgende stappen voor uw dossier te ontdekken."
  },
  pl: {
    subject: "Aktualizacja wniosku — AGM INVEST",
    title: "Witaj",
    body: "Z przyjemnością informujemy, że Twój wniosek został pozytywnie zaktualizowany. Możesz teraz sfinalizować ostatnie etapy swojego wniosku.",
    cta: "Zobacz mój obszar",
    info: "Odwiedź swój obszar osobisty, aby poznać kolejne etapy rozpatrywania Twojego wniosku."
  },
  pt: {
    subject: "Atualização de processo — AGM INVEST",
    title: "Olá",
    body: "Temos o prazer de informar que o seu processo foi atualizado com uma decisão favorável. Pode agora finalizar os últimos passos do seu pedido.",
    cta: "Aceder ao meu espaço",
    info: "Consulte o seu espaço pessoal para descobrir os próximos passos do seu processo."
  },
  ro: {
    subject: "Actualizare dosar — AGM INVEST",
    title: "Bună ziua",
    body: "Suntem încântați să vă informăm că dosarul dumneavoastră a fost actualizat cu o decizie favorabilă. Acum puteți finaliza ultimii pași ai cererii dumneavoastră.",
    cta: "Accesare spațiul meu",
    info: "Vizitați spațiul dumneavoastră personal pentru a descoperi următorii pași pentru dosarul dumneavoastră."
  },
  sv: {
    subject: "Kontouppdatering — AGM INVEST",
    title: "Hej",
    body: "Vi är glada att meddela att din fil har uppdaterats med ett positivt beslut. Du kan nu slutföra de sista stegen i din ansökan.",
    cta: "Se mitt utrymme",
    info: "Besök ditt personliga utrymme för att upptäcka nästa steg för din fil."
  },
};

export function loanApprovedTemplate(data: LoanApprovedData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#16A34A;font-weight:600;margin:0;line-height:1.6;">
        ${t.info}
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
