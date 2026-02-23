import { emailLayout, btn, APP_URL } from '../layout';

interface PaymentRequiredData {
    firstName: string;
    bankName: string;
    iban: string;
    bic: string;
    beneficiary: string;
    amount?: number;
}

const translations: Record<string, { subject: string; title: string; body: string; rib: string; cta: string; urgent: string }> = {
    fr: { subject: "💳 Dépôt requis pour finaliser votre dossier — AGM INVEST", title: "Un dépôt est requis pour débloquer votre prêt", body: "Pour finaliser votre dossier et procéder au déblocage de votre prêt, un dépôt d'authentification de 286 € est requis. Ce montant vous sera crédité sur votre compte.", rib: "Coordonnées bancaires pour le virement", cta: "Voir mon dossier", urgent: "Action requise sous 72h pour maintenir votre dossier actif." },
    en: { subject: "💳 Deposit required to finalize your file — AGM INVEST", title: "A deposit is required to unlock your loan", body: "To finalize your file and proceed with the release of your loan, an authentication deposit of €286 is required. This amount will be credited to your account.", rib: "Bank details for the transfer", cta: "View my file", urgent: "Action required within 72 hours to keep your file active." },
    es: { subject: "💳 Depósito requerido para finalizar su expediente — AGM INVEST", title: "Se requiere un depósito para desbloquear su préstamo", body: "Para finalizar su expediente y proceder al desbloqueo de su préstamo, se requiere un depósito de autenticación de 286 €. Este importe le será abonado en su cuenta.", rib: "Datos bancarios para la transferencia", cta: "Ver mi expediente", urgent: "Acción requerida en 72 horas para mantener su expediente activo." },
    it: { subject: "💳 Deposito richiesto per finalizzare la tua pratica — AGM INVEST", title: "È richiesto un deposito per sbloccare il tuo prestito", body: "Per finalizzare la tua pratica e procedere con il rilascio del tuo prestito, è richiesto un deposito di autenticazione di 286 €. Questo importo verrà accreditato sul tuo conto.", rib: "Coordinate bancarie per il bonifico", cta: "Visualizza la mia pratica", urgent: "Azione richiesta entro 72 ore per mantenere la tua pratica attiva." },
    de: { subject: "💳 Einzahlung erforderlich — AGM INVEST", title: "Eine Einzahlung ist erforderlich, um Ihren Kredit freizuschalten", body: "Um Ihre Akte abzuschließen und die Auszahlung Ihres Kredits durchzuführen, ist eine Authentifizierungseinzahlung von 286 € erforderlich. Dieser Betrag wird Ihrem Konto gutgeschrieben.", rib: "Bankdaten für die Überweisung", cta: "Meine Akte ansehen", urgent: "Aktion innerhalb von 72 Stunden erforderlich, um Ihre Akte aktiv zu halten." },
    nl: { subject: "💳 Aanbetaling vereist — AGM INVEST", title: "Een aanbetaling is vereist om uw lening vrij te geven", body: "Om uw dossier te finaliseren en uw lening vrij te geven, is een authenticatie-aanbetaling van €286 vereist. Dit bedrag wordt bijgeschreven op uw rekening.", rib: "Bankgegevens voor de overschrijving", cta: "Mijn dossier bekijken", urgent: "Actie vereist binnen 72 uur om uw dossier actief te houden." },
    pl: { subject: "💳 Wymagana wpłata — AGM INVEST", title: "Wymagana wpłata w celu odblokowania kredytu", body: "Aby sfinalizować dokumentację i uruchomić kredyt, wymagana jest wpłata uwierzytelniająca w wysokości 286 €. Kwota ta zostanie zaksięgowana na Twoim koncie.", rib: "Dane bankowe do przelewu", cta: "Zobacz moją dokumentację", urgent: "Działanie wymagane w ciągu 72 godzin, aby utrzymać aktywność dokumentacji." },
    pt: { subject: "💳 Depósito necessário — AGM INVEST", title: "Um depósito é necessário para desbloquear o seu empréstimo", body: "Para finalizar o seu processo e prosseguir com a liberação do seu empréstimo, é necessário um depósito de autenticação de 286 €. Este valor será creditado na sua conta.", rib: "Dados bancários para a transferência", cta: "Ver o meu processo", urgent: "Ação necessária em 72 horas para manter o seu processo ativo." },
    ro: { subject: "💳 Depozit necesar — AGM INVEST", title: "Un depozit este necesar pentru a debloca împrumutul", body: "Pentru a finaliza dosarul și a proceda la deblocarea împrumutului, este necesar un depozit de autentificare de 286 €. Această sumă va fi creditată în contul dvs.", rib: "Date bancare pentru transfer", cta: "Vizualizați dosarul meu", urgent: "Acțiune necesară în 72 de ore pentru a menține dosarul activ." },
    sv: { subject: "💳 Insättning krävs — AGM INVEST", title: "En insättning krävs för att låsa upp ditt lån", body: "För att slutföra din fil och genomföra utbetalningen av ditt lån krävs en autentiseringsinsättning på 286 €. Detta belopp krediteras ditt konto.", rib: "Bankuppgifter för överföringen", cta: "Visa min fil", urgent: "Åtgärd krävs inom 72 timmar för att hålla din fil aktiv." },
};

export function paymentRequiredTemplate(data: PaymentRequiredData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];
    const amount = data.amount || 286;
    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#FFF7ED;border:2px solid #FED7AA;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="font-size:11px;font-weight:700;color:#C2410C;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">⚠️ ${t.urgent}</p>
      <p style="font-size:28px;font-weight:900;color:#EA580C;margin:0 0 4px;">${amount} €</p>
    </div>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">${t.rib}</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:12px;color:#94A3B8;padding:4px 0;">Bénéficiaire</td><td style="font-size:13px;font-weight:700;color:#1E3A5F;text-align:right;">${data.beneficiary}</td></tr>
        <tr><td style="font-size:12px;color:#94A3B8;padding:4px 0;border-top:1px solid #F1F5F9;">Banque</td><td style="font-size:13px;font-weight:700;color:#1E3A5F;text-align:right;border-top:1px solid #F1F5F9;">${data.bankName}</td></tr>
        <tr><td style="font-size:12px;color:#94A3B8;padding:4px 0;border-top:1px solid #F1F5F9;">IBAN</td><td style="font-size:12px;font-weight:700;color:#1E3A5F;text-align:right;border-top:1px solid #F1F5F9;font-family:monospace;">${data.iban}</td></tr>
        <tr><td style="font-size:12px;color:#94A3B8;padding:4px 0;border-top:1px solid #F1F5F9;">BIC</td><td style="font-size:12px;font-weight:700;color:#1E3A5F;text-align:right;border-top:1px solid #F1F5F9;font-family:monospace;">${data.bic}</td></tr>
      </table>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard/billing`)}
  `;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
