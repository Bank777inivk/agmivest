import { emailLayout, btn, APP_URL } from '../layout';

interface TransferInitiatedData {
    firstName: string;
    amount: number;
    beneficiaryName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; details: string; amountLabel: string; beneficiaryLabel: string; cta: string; info: string }> = {
    fr: {
        subject: "📨 Votre demande de virement a été reçue — AGM INVEST",
        title: "Demande de virement enregistrée",
        body: "Nous avons bien reçu votre demande de virement. Elle est actuellement en cours de traitement par nos services.",
        details: "Détails du virement",
        amountLabel: "Montant",
        beneficiaryLabel: "Bénéficiaire",
        cta: "Suivre mes opérations",
        info: "Les virements sont généralement traités sous 24h à 48h ouvrées."
    },
    en: {
        subject: "📨 Your transfer request received — AGM INVEST",
        title: "Transfer request recorded",
        body: "We have received your transfer request. It is currently being processed by our services.",
        details: "Transfer details",
        amountLabel: "Amount",
        beneficiaryLabel: "Beneficiary",
        cta: "Track my operations",
        info: "Transfers are usually processed within 24 to 48 business hours."
    },
    es: {
        subject: "📨 Su solicitud de transferencia ha sido recibida — AGM INVEST",
        title: "Solicitud de transferencia registrada",
        body: "Hemos recibido su solicitud de transferencia. Actualmente está siendo procesada por nuestros servicios.",
        details: "Detalles de la transferencia",
        amountLabel: "Importe",
        beneficiaryLabel: "Beneficiario",
        cta: "Seguir mis operaciones",
        info: "Las transferencias se procesan generalmente en un plazo de 24 a 48 horas hábiles."
    },
    it: {
        subject: "📨 La tua richiesta di bonifico è stata ricevuta — AGM INVEST",
        title: "Richiesta di bonifico registrata",
        body: "Abbiamo ricevuto la tua richiesta di bonifico. È attualmente in fase di elaborazione dai nostri servizi.",
        details: "Dettagli del bonifico",
        amountLabel: "Importo",
        beneficiaryLabel: "Beneficiario",
        cta: "Segui le mie operazioni",
        info: "I bonifici vengono solitamente elaborati entro 24-48 ore lavorative."
    },
    de: {
        subject: "📨 Ihr Überweisungsantrag wurde empfangen — AGM INVEST",
        title: "Überweisungsantrag registriert",
        body: "Wir haben Ihren Überweisungsantrag erhalten. Er wird derzeit von unseren Diensten bearbeitet.",
        details: "Überweisungsdetails",
        amountLabel: "Betrag",
        beneficiaryLabel: "Empfänger",
        cta: "Meine Vorgänge verfolgen",
        info: "Überweisungen werden in der Regel innerhalb von 24 bis 48 Geschäftsstunden bearbeitet."
    },
    nl: {
        subject: "📨 Uw overschrijvingsverzoek ontvangen — AGM INVEST",
        title: "Overboekingsverzoek geregistreerd",
        body: "Wij hebben uw overboekingsverzoek ontvangen. Het wordt momenteel verwerkt door onze diensten.",
        details: "Overboekingsgegevens",
        amountLabel: "Bedrag",
        beneficiaryLabel: "Begunstigde",
        cta: "Mijn verrichtingen volgen",
        info: "Overboekingen worden gewoonlijk binnen 24 tot 48 werkuren verwerkt."
    },
    pl: {
        subject: "📨 Twój wniosek o przelew został otrzymany — AGM INVEST",
        title: "Wniosek o przelew zarejestrowany",
        body: "Otrzymaliśmy Twój wniosek o przelew. Jest on obecnie przetwarzany przez nasze służby.",
        details: "Szczegóły przelewu",
        amountLabel: "Kwota",
        beneficiaryLabel: "Beneficjent",
        cta: "Śledź moje operacje",
        info: "Przelewy są zazwyczaj przetwarzane w ciągu 24 do 48 godzin roboczych."
    },
    pt: {
        subject: "📨 O seu pedido de transferência foi recebido — AGM INVEST",
        title: "Pedido de transferência registado",
        body: "Recebemos o seu pedido de transferência. Ele está atualmente a ser processado pelos nossos serviços.",
        details: "Detalhes da transferência",
        amountLabel: "Valor",
        beneficiaryLabel: "Beneficiário",
        cta: "Acompanhar as minhas operações",
        info: "As transferências são geralmente processadas dentro de 24 a 48 horas úteis."
    },
    ro: {
        subject: "📨 Cererea dvs. de transfer a fost primită — AGM INVEST",
        title: "Cerere de transfer înregistrată",
        body: "Am primit cererea dvs. de transfer. Aceasta este în curs de procesare de către serviciile noastre.",
        details: "Detalii transfer",
        amountLabel: "Sumă",
        beneficiaryLabel: "Beneficiar",
        cta: "Urmăriți operațiunile mele",
        info: "Transferurile sunt procesate de obicei în termen de 24 până la 48 de ore lucrătoare."
    },
    sv: {
        subject: "📨 Din överföringsansökan har mottagits — AGM INVEST",
        title: "Överföringsansökan registrerad",
        body: "Vi har mottagit din överföringsansökan. Den behandlas just nu av våra tjänster.",
        details: "Överföringsdetaljer",
        amountLabel: "Belopp",
        beneficiaryLabel: "Mottagare",
        cta: "Följ mina transaktioner",
        info: "Överföringar behandlas vanligtvis inom 24 till 48 arbetstimmar."
    },
};

export function transferInitiatedTemplate(data: TransferInitiatedData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">${t.details}</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#64748B;">${t.amountLabel}</td>
          <td style="padding:8px 0;font-size:16px;font-weight:900;color:#1E3A5F;text-align:right;">${data.amount.toLocaleString()} €</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#64748B;border-top:1px solid #F1F5F9;">${t.beneficiaryLabel}</td>
          <td style="padding:8px 0;font-size:14px;font-weight:700;color:#1E3A5F;text-align:right;border-top:1px solid #F1F5F9;">${data.beneficiaryName}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#94A3B8;margin:24px 0 0;">💡 ${t.info}</p>

    ${btn(t.cta, `${APP_URL}/dashboard/accounts/transfer`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
