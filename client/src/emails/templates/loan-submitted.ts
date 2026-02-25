import { emailLayout, btn, APP_URL } from '../layout';
interface LoanSubmittedData { firstName: string; amount: number; duration: number; }
const translations: Record<string, { subject: string; title: string; body: string; cta: string; amountLabel: string; durationLabel: string }> = {
  fr: {
    subject: "Reception de votre demande de pret - AGM INVEST",
    title: "Votre demande a bien &#233;t&#233; re&#231;ue (v5)",
    body: "Notre &#233;quipe va examiner votre dossier dans les plus brefs d&#233;lais. Vous serez notifi&#233; par email d&#232;s qu'une d&#233;cision sera prise.",
    cta: "Suivre mon dossier",
    amountLabel: "Montant demand&#233;",
    durationLabel: "Dur&#233;e"
  },
  en: { subject: "Loan application received — AGM INVEST", title: "Your application has been received", body: "Our team will review your file as soon as possible. You will be notified by email once a decision has been made.", cta: "Track my file", amountLabel: "Requested amount", durationLabel: "Duration" },
  es: { subject: "Solicitud de préstamo recibida — AGM INVEST", title: "¡Su solicitud ha sido recibida!", body: "Nuestro equipo revisará su expediente lo antes posible. Se le notificará por correo electrónico en cuanto se tome una decisión.", cta: "Seguir mi expediente", amountLabel: "Importe solicitado", durationLabel: "Duración" },
  it: { subject: "Richiesta di prestito ricevuta — AGM INVEST", title: "La tua richiesta è stata ricevuta", body: "Il nostro team esaminerà la tua pratica il prima possibile. Sarai informato via email non appena verrà presa una decisione.", cta: "Segui la mia pratica", amountLabel: "Importo richiesto", durationLabel: "Durata" },
  de: { subject: "Kreditantrag empfangen — AGM INVEST", title: "Ihr Antrag wurde erhalten", body: "Unser Team wird Ihre Akte so schnell wie möglich prüfen. Sie werden per E-Mail benachrichtigt, sobald eine Entscheidung getroffen wurde.", cta: "Meine Akte verfolgen", amountLabel: "Beantragter Betrag", durationLabel: "Laufzeit" },
  nl: { subject: "Leningaanvraag ontvangen — AGM INVEST", title: "Uw aanvraag is ontvangen", body: "Ons team beoordeelt uw dossier zo snel mogelijk. U wordt per e-mail op de hoogte gebracht zodra er een beslissing is genomen.", cta: "Mijn dossier volgen", amountLabel: "Gevraagd bedrag", durationLabel: "Looptijd" },
  pl: { subject: "Wniosek kredytowy otrzymany — AGM INVEST", title: "Twój wniosek został otrzymany", body: "Nasz zespół przejrzy Twoją dokumentację jak najszybciej. Zostaniesz powiadomiony e-mailem po podjęciu decyzji.", cta: "Śledź mój wniosek", amountLabel: "Wnioskowana kwota", durationLabel: "Okres" },
  pt: { subject: "Pedido de empréstimo recebido — AGM INVEST", title: "O seu pedido foi recebido", body: "A nossa equipa irá analisar o seu processo o mais rapidamente possibile. Será notificado por email assim que for tomada uma decisão.", cta: "Acompanhar o meu processo", amountLabel: "Valor solicitado", durationLabel: "Duração" },
  ro: { subject: "Cererea de împrumut primită — AGM INVEST", title: "Cererea dvs. a fost primită", body: "Echipa noastră va examina dosarul dvs. cât mai curând posibil. Veți fi notificat prin email imediat ce se ia o decizie.", cta: "Urmăriți dosarul meu", amountLabel: "Suma solicitată", durationLabel: "Durată" },
  sv: { subject: "Låneansökan mottagen — AGM INVEST", title: "Din ansökan har mottagits", body: "Vårt team granskar din fil så snart som möjligt. Du kommer att meddelas via e-post när ett beslut har fattats.", cta: "Följ min fil", amountLabel: "Begärt belopp", durationLabel: "Löptid" },
};
export function loanSubmittedTemplate(data: LoanSubmittedData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];
  const content = `
    <p style="font-size:24px;font-weight:900;color:#1E3A5F;margin:0 0 12px;font-family:sans-serif;">${t.title}</p>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#64748B;padding:6px 0;">${t.amountLabel}</td><td style="font-size:16px;font-weight:900;color:#1E3A5F;text-align:right;">${data.amount.toLocaleString()} €</td></tr>
        <tr><td style="font-size:13px;color:#64748B;padding:6px 0;border-top:1px solid #F1F5F9;">${t.durationLabel}</td><td style="font-size:14px;font-weight:700;color:#1E3A5F;text-align:right;border-top:1px solid #F1F5F9;">${data.duration} mois</td></tr>
      </table>
    </div>
    ${btn(t.cta, `${APP_URL}/dashboard/requests`)}`;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
