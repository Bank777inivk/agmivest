import { emailLayout, btn, APP_URL } from '../layout';

interface PaymentRequiredData {
  firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; rib: string; cta: string; urgent: string }> = {
  fr: { subject: "Mise à jour de votre espace — AGM INVEST", title: "Bonjour", body: "Des informations complémentaires sont nécessaires pour finaliser votre dossier. Nous vous invitons à consulter les détails de régularisation dans votre espace sécurisé.", rib: "Coordonnées de règlement", cta: "Consulter mon dossier", urgent: "Une action de votre part est souhaitée pour maintenir votre dossier actif." },
  en: { subject: "Account update — AGM INVEST", title: "Hello", body: "Additional information is required to finalize your file. We invite you to check the regularization details in your secure space.", rib: "Payment details", cta: "View my file", urgent: "Action is requested to keep your file active." },
  es: { subject: "Actualización de su cuenta — AGM INVEST", title: "Buenos días", body: "Se requiere información adicional para finalizar su expediente. Le invitamos a consultar los detalles de regularización en su espacio seguro.", rib: "Detalles de pago", cta: "Ver mi expediente", urgent: "Se requiere una acción por su parte para mantener su expediente activo." },
  it: { subject: "Aggiornamento dell'account — AGM INVEST", title: "Buongiorno", body: "Sono richieste informazioni aggiuntive per finalizzare la tua pratica. Ti invitiamo a consultare i dettagli della regolarizzazione nel tuo spazio sicuro.", rib: "Dettagli del pagamento", cta: "Visualizza la mia pratica", urgent: "È richiesta un'azione da parte tua per mantenere attiva la tua pratica." },
  de: { subject: "Konto-Aktualisierung — AGM INVEST", title: "Guten Tag", body: "Weitere Informationen sind erforderlich, um Ihre Akte zu finalisieren. Wir laden Sie ein, die Details zur Regularisierung in Ihrem sicheren Bereich einzusehen.", rib: "Zahlungsdetails", cta: "Meine Akte ansehen", urgent: "Eine Aktion Ihrerseits ist erwünscht, um Ihre Akte aktiv zu halten." },
  nl: { subject: "Account bijwerking — AGM INVEST", title: "Goedendag", body: "Aanvullende informatie is vereist om uw dossier af te ronden. Wij nodigen u uit om de details van de regularisatie te bekijken in uw beveiligde ruimte.", rib: "Betalingsgegevens", cta: "Mijn dossier bekijken", urgent: "Een actie van uw kant is gewenst om uw dossier actief te houden." },
  pl: { subject: "Aktualizacja konta — AGM INVEST", title: "Dzień dobry", body: "W celu sfinalizowania dokumentacji wymagane są dodatkowe informacje. Zapraszamy do zapoznania się ze szczegółami uregulowania sytuacji w bezpiecznym obszarze.", rib: "Szczegóły płatności", cta: "Zobacz mój wniosek", urgent: "Wymagane jest działanie z Twojej strony, aby utrzymać wniosek jako aktywny." },
  pt: { subject: "Atualização da sua conta — AGM INVEST", title: "Olá", body: "São necessárias informações adicionais para finalizar o seu processo. Convidamo-lo a consultar los detalhes da regularização no seu espaço seguro.", rib: "Detalhes do pagamento", cta: "Ver o meu processo", urgent: "É necessária uma ação da sua parte para manter o seu processo ativo." },
  ro: { subject: "Actualizare cont — AGM INVEST", title: "Bună ziua", body: "Sunt necesare informații suplimentare pentru a finaliza dosarul dumneavoastră. Vă invităm să consultați detaliile de regularizare în spațiul dumneavoastră securizat.", rib: "Detalii de plată", cta: "Vizualizați dosarul", urgent: "Este necesară o acțiune din partea dumneavoastră pentru a menține dosarul activ." },
  sv: { subject: "Kontouppdatering — AGM INVEST", title: "Hej", body: "Ytterligare information krävs för att slutföra din fil. Vi bjuder in dig att kontrollera detaljerna för reglering i ditt säkra utrymme.", rib: "Betalningsuppgifter", cta: "Se min fil", urgent: "En åtgärd krävs från din sida för att hålla din fil aktiv." },
};

export function paymentRequiredTemplate(data: PaymentRequiredData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <h3 style="font-size:13px;text-transform:uppercase;color:#94A3B8;margin:0 0 16px;letter-spacing:0.05em;">${t.rib}</h3>
      <p style="font-size:15px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        Consultez les informations de règlement directement sur l'interface de votre compte.
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}

    <div style="background:#FFF7ED;border:1px solid #FFEDD5;border-radius:12px;padding:16px;text-align:center;">
      <p style="font-size:13px;color:#C2410C;margin:0;font-weight:600;">${t.urgent}</p>
    </div>
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
