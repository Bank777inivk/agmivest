import { emailLayout, btn, APP_URL } from '../layout';

interface LoanApprovedData {
  firstName: string;
  amount: number;
  duration: number;
  monthlyPayment?: number;
}

const translations: Record<string, { subject: string; title: string; body: string; details: string; amountLabel: string; durationLabel: string; monthlyLabel: string; cta: string; caveat: string }> = {
  fr: {
    subject: "Mise a jour de votre dossier - AGM INVEST",
    title: "Votre dossier a &eacute;t&eacute; mis &agrave; jour",
    body: "Nous avons le plaisir de vous informer que votre dossier a &eacute;t&eacute; mis &agrave; jour positivement. Voici le r&eacute;capitulatif :",
    details: "R&eacute;capitulatif",
    amountLabel: "Montant accord&eacute;",
    durationLabel: "Dur&eacute;e",
    monthlyLabel: "Mensualit&eacute; estim&eacute;e",
    cta: "Acc&eacute;der &agrave; mon espace",
    caveat: "Un d&eacute;p&ocirc;t de 286 &euro; est requis pour finaliser votre dossier. Consultez votre espace pour les d&eacute;tails."
  },
  en: {
    subject: "✅ Your loan has been approved — AGM INVEST",
    title: "Congratulations! Your loan is approved.",
    body: "We are pleased to inform you that your financing request has been approved. Here is the summary of your loan:",
    details: "Summary",
    amountLabel: "Approved amount",
    durationLabel: "Duration",
    monthlyLabel: "Estimated monthly payment",
    cta: "Access my account",
    caveat: "A deposit of €286 is required to finalize your file. Check your account for details."
  },
  es: {
    subject: "✅ Su préstamo ha sido aprobado — AGM INVEST",
    title: "¡Felicitaciones! Su préstamo ha sido aprobado.",
    body: "Nos complace informarle que su solicitud de financiación ha sido aprobada. Aquí está el resumen de su préstamo:",
    details: "Resumen",
    amountLabel: "Importe aprobado",
    durationLabel: "Duración",
    monthlyLabel: "Cuota mensual estimada",
    cta: "Acceder a mi espacio",
    caveat: "Se requiere un depósito de 286 € para finalizar su expediente. Consulte su espacio para más detalles."
  },
  it: {
    subject: "✅ Il tuo prestito è stato approvato — AGM INVEST",
    title: "Congratulazioni! Il tuo prestito è approvato.",
    body: "Siamo lieti di informarti che la tua richiesta di finanziamento è stata approvata. Ecco il riepilogo del tuo prestito:",
    details: "Riepilogo",
    amountLabel: "Importo approvato",
    durationLabel: "Durata",
    monthlyLabel: "Rata mensile stimata",
    cta: "Accedi al mio spazio",
    caveat: "È richiesto un deposito di 286 € per finalizzare la tua pratica. Consulta il tuo spazio per i dettagli."
  },
  de: {
    subject: "✅ Ihr Kredit wurde genehmigt — AGM INVEST",
    title: "Herzlichen Glückwunsch! Ihr Kredit ist genehmigt.",
    body: "Wir freuen uns, Ihnen mitteilen zu können, dass Ihr Finanzierungsantrag genehmigt wurde. Hier ist die Zusammenfassung Ihres Kredits:",
    details: "Zusammenfassung",
    amountLabel: "Genehmigter Betrag",
    durationLabel: "Laufzeit",
    monthlyLabel: "Geschätzte Monatsrate",
    cta: "Auf meinen Bereich zugreifen",
    caveat: "Eine Einzahlung von 286 € ist erforderlich, um Ihre Akte abzuschließen. Überprüfen Sie Ihren Bereich für Details."
  },
  nl: {
    subject: "✅ Uw lening is goedgekeurd — AGM INVEST",
    title: "Gefeliciteerd! Uw lening is goedgekeurd.",
    body: "Wij zijn verheugd u te informeren dat uw financieringsaanvraag is goedgekeurd. Hier is een overzicht van uw lening:",
    details: "Overzicht",
    amountLabel: "Goedgekeurd bedrag",
    durationLabel: "Looptijd",
    monthlyLabel: "Geschatte maandelijkse betaling",
    cta: "Toegang tot mijn account",
    caveat: "Een aanbetaling van €286 is vereist om uw dossier te finaliseren. Raadpleeg uw account voor details."
  },
  pl: {
    subject: "✅ Twój wniosek kredytowy został zatwierdzony — AGM INVEST",
    title: "Gratulacje! Twój kredyt został zatwierdzony.",
    body: "Z przyjemnością informujemy, że Twój wniosek o finansowanie został zatwierdzony. Oto podsumowanie Twojego kredytu:",
    details: "Podsumowanie",
    amountLabel: "Zatwierdzona kwota",
    durationLabel: "Okres",
    monthlyLabel: "Szacowana miesięczna rata",
    cta: "Przejdź do mojego konta",
    caveat: "Wymagana jest wpłata 286 € w celu sfinalizowania Twojej dokumentacji. Sprawdź swoje konto, aby uzyskać szczegóły."
  },
  pt: {
    subject: "✅ Seu empréstimo foi aprovado — AGM INVEST",
    title: "Parabéns! Seu empréstimo foi aprovado.",
    body: "Temos o prazer de informar que seu pedido de financiamento foi aprovado. Aqui está o resumo do seu empréstimo:",
    details: "Resumo",
    amountLabel: "Valor aprovado",
    durationLabel: "Duração",
    monthlyLabel: "Pagamento mensal estimado",
    cta: "Acessar meu espaço",
    caveat: "Um depósito de €286 é necessário para finalizar seu processo. Consulte seu espaço para obter detalhes."
  },
  ro: {
    subject: "✅ Împrumutul dvs. a fost aprobat — AGM INVEST",
    title: "Felicitări! Împrumutul dvs. este aprobat.",
    body: "Suntem încântați să vă informăm că cererea de finanțare a fost aprobată. Iată rezumatul împrumutului dvs.:",
    details: "Rezumat",
    amountLabel: "Suma aprobată",
    durationLabel: "Durată",
    monthlyLabel: "Rată lunară estimată",
    cta: "Accesați spațiul meu",
    caveat: "Un depozit de 286 € este necesar pentru finalizarea dosarului. Consultați spațiul dvs. pentru detalii."
  },
  sv: {
    subject: "✅ Ditt lån har godkänts — AGM INVEST",
    title: "Grattis! Ditt lån är godkänt.",
    body: "Vi är glada att meddela att din finansieringsansökan har godkänts. Här är en sammanfattning av ditt lån:",
    details: "Sammanfattning",
    amountLabel: "Godkänt belopp",
    durationLabel: "Löptid",
    monthlyLabel: "Beräknad månadsbetalning",
    cta: "Gå till mitt konto",
    caveat: "En insättning på 286 € krävs för att slutföra din fil. Kontrollera ditt konto för detaljer."
  },
};

export function loanApprovedTemplate(data: LoanApprovedData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:11px;font-weight:700;color:#16A34A;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">${t.details}</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#64748B;">${t.amountLabel}</td>
          <td style="padding:8px 0;font-size:16px;font-weight:900;color:#1E3A5F;text-align:right;">${data.amount.toLocaleString()} €</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#64748B;border-top:1px solid #DCFCE7;">${t.durationLabel}</td>
          <td style="padding:8px 0;font-size:14px;font-weight:700;color:#1E3A5F;text-align:right;border-top:1px solid #DCFCE7;">${data.duration} mois</td>
        </tr>
        ${data.monthlyPayment ? `<tr>
          <td style="padding:8px 0;font-size:13px;color:#64748B;border-top:1px solid #DCFCE7;">${t.monthlyLabel}</td>
          <td style="padding:8px 0;font-size:14px;font-weight:700;color:#10B981;text-align:right;border-top:1px solid #DCFCE7;">${Math.round(data.monthlyPayment)} €/mois</td>
        </tr>` : ''}
      </table>
    </div>

    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:13px;color:#9A3412;margin:0;">${t.caveat}</p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
