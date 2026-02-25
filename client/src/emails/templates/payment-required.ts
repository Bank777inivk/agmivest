import { emailLayout, btn, APP_URL } from '../layout';

interface PaymentRequiredData {
  firstName: string;
}

export function paymentRequiredTemplate(data: PaymentRequiredData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; rib: string; cta: string; urgent: string }> = {
    fr: {
      subject: "Regularisation de votre compte — AGM INVEST",
      title: "Regularisation de votre compte",
      body: "Bonjour " + data.firstName + ",\n\nDes informations complementaires sont necessaires pour finaliser votre dossier. Nous vous invitons a consulter les details de regularisation dans votre espace securise.",
      rib: "Coordonnees de reglement",
      cta: "Consulter mon dossier",
      urgent: "Une action de votre part est souhaitee pour maintenir votre dossier actif."
    },
    en: {
      subject: "Account regularization — AGM INVEST",
      title: "Account regularization",
      body: "Hello " + data.firstName + ",\n\nAdditional information is required to finalize your file. We invite you to check the regularization details in your secure space.",
      rib: "Payment details",
      cta: "View my file",
      urgent: "Action is requested to keep your file active."
    },
    es: {
      subject: "Regularizacion de su cuenta — AGM INVEST",
      title: "Regularizacion de su cuenta",
      body: "Hola " + data.firstName + ",\n\nSe requiere informacion adicional para finalizar su expediente. Le invitamos a consultar los detalles de regularizacion en su espacio seguro.",
      rib: "Detalles de pago",
      cta: "Ver mi expediente",
      urgent: "Se requiere una accion por su parte para mantener su expediente activo."
    },
    it: {
      subject: "Regolarizzazione del tuo account — AGM INVEST",
      title: "Regolarizzazione del tuo account",
      body: "Buongiorno " + data.firstName + ",\n\nSono richieste informazioni aggiuntive per finalizzare la tua pratica. Ti invitiamo a consultare i dettagli della regolarizzazione nel tuo spazio sicuro.",
      rib: "Dettagli del pagamento",
      cta: "Visualizza la mia pratica",
      urgent: "E richiesta un'azione da parte tua per mantenere attiva la tua pratica."
    },
    de: {
      subject: "Kontoregulierung — AGM INVEST",
      title: "Kontoregulierung",
      body: "Hallo " + data.firstName + ",\n\nWeitere Informationen sind erforderlich, um Ihre Akte zu finalisieren. Wir laden Sie ein, die Details zur Regularisierung in Ihrem sicheren Bereich einzusehen.",
      rib: "Zahlungsdetails",
      cta: "Meine Akte ansehen",
      urgent: "Eine Aktion Ihrerseits ist erwunscht, um Ihre Akte aktiv zu halten."
    },
    nl: {
      subject: "Account regularisatie — AGM INVEST",
      title: "Account regularisatie",
      body: "Hallo " + data.firstName + ",\n\nAanvullende informatie is vereist om uw dossier af te ronden. Wij nodigen u uit om de details van de regularisatie te bekijken in uw beveiligde ruimte.",
      rib: "Betalingsgegevens",
      cta: "Mijn dossier bekijken",
      urgent: "Een actie van uw kant is gewenst om uw dossier actief te houden."
    },
    pl: {
      subject: "Regularyzacja konta — AGM INVEST",
      title: "Regularyzacja konta",
      body: "Witaj " + data.firstName + ",\n\nW celu sfinalizowania dokumentacji wymagane sa dodatkowe informacje. Zapraszamy do zapoznania sie ze szczegolami uregulowania sytuacji w bezpiecznym obszarze.",
      rib: "Szczegoly platnosci",
      cta: "Zobacz moj wniosek",
      urgent: "Wymagane jest dzialanie z Twojej strony, aby utrzymac wniosek jako aktywny."
    },
    pt: {
      subject: "Regularizacao da sua conta — AGM INVEST",
      title: "Regularizacao da sua conta",
      body: "Ola " + data.firstName + ",\n\nSao necessarias informacoes adicionais para finalizar o seu processo. Convidamo-lo a consultar los detalhes da regularizacao no seu espaco seguro.",
      rib: "Detalhes do pagamento",
      cta: "Ver o meu processo",
      urgent: "E necessaria uma acao da sua parte para manter o seu processo ativo."
    },
    ro: {
      subject: "Regularizarea contului dumneavoastra — AGM INVEST",
      title: "Regularizarea contului dumneavoastra",
      body: "Bună ziua " + data.firstName + ",\n\nSunt necesare informatii suplimentare pentru a finaliza dosarul dumneavoastra. Va invitam sa consultati detaliile de regularizare in spatiul dumneavoastra securizat.",
      rib: "Detalii de plata",
      cta: "Vizualizati dosarul",
      urgent: "Este necesara o actiune din partea dumneavoastra pentru a mentine dosarul activ."
    },
    sv: {
      subject: "Kontoreglering — AGM INVEST",
      title: "Kontoreglering",
      body: "Hej " + data.firstName + ",\n\nYtterligare information kravs for at slutfora din fil. Vi bjuder in dig att kontrollera detaljerna for reglering i ditt sakra utrymme.",
      rib: "Betalningsuppgifter",
      cta: "Se min fil",
      urgent: "En atgard kravs fran din sida for att halla din fil aktiv."
    },
  };

  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <h3 style="font-size:13px;text-transform:uppercase;color:#94A3B8;margin:0 0 16px;letter-spacing:0.05em;">${t.rib}</h3>
      <p style="font-size:15px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        Consultez les informations de reglement directement sur l'interface de votre compte.
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}

    <div style="background:#FFF7ED;border:1px solid #FFEDD5;border-radius:12px;padding:16px;text-align:center;">
      <p style="font-size:13px;color:#C2410C;margin:0;font-weight:600;">${t.urgent}</p>
    </div>
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
