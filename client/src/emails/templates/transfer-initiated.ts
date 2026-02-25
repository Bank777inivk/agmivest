import { emailLayout, btn, APP_URL } from '../layout';

interface TransferInitiatedData {
    firstName: string;
    amount: number;
    beneficiaryName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; details: string; amountLabel: string; beneficiaryLabel: string; cta: string; info: string }> = {
    fr: {
        subject: "Votre demande de mise à jour a été reçue — AGM INVEST",
        title: "Demande enregistrée",
        body: "Nous avons bien reçu votre demande de mise à jour. Elle est actuellement en cours de traitement par nos services.",
        details: "Détails de l'opération",
        amountLabel: "Montant",
        beneficiaryLabel: "Destinataire",
        cta: "Suivre mes opérations",
        info: "Les opérations sont généralement traitées sous 24h à 48h ouvrées."
    },
    en: {
        subject: "Your update request received — AGM INVEST",
        title: "Update request recorded",
        body: "We have received your update request. It is currently being processed by our services.",
        details: "Operation details",
        amountLabel: "Amount",
        beneficiaryLabel: "Recipient",
        cta: "Track my operations",
        info: "Operations are usually processed within 24 to 48 business hours."
    },
    es: {
        subject: "Su solicitud de actualización ha sido recibida — AGM INVEST",
        title: "Solicitud registrada",
        body: "Hemos recibido su solicitud de actualización. Actualmente está siendo procesada por nuestros servicios.",
        details: "Detalles de la operación",
        amountLabel: "Importe",
        beneficiaryLabel: "Destinatario",
        cta: "Seguir mis operaciones",
        info: "Las operaciones se procesan generalmente en un plazo de 24 a 48 horas hábiles."
    },
    it: {
        subject: "La tua richiesta di aggiornamento è stata ricevuta — AGM INVEST",
        title: "Richiesta registrata",
        body: "Abbiamo ricevuto la tua richiesta di aggiornamento. È attualmente in fase di elaborazione dai nostri servizi.",
        details: "Dettagli dell'operazione",
        amountLabel: "Importo",
        beneficiaryLabel: "Destinatario",
        cta: "Segui le mie operazioni",
        info: "Le operazioni vengono solitamente elaborate entro 24-48 ore lavorative."
    },
    de: {
        subject: "Ihr Aktualisierungsantrag wurde empfangen — AGM INVEST",
        title: "Antrag registriert",
        body: "Wir haben Ihren Aktualisierungsantrag erhalten. Er wird derzeit von unseren Diensten bearbeitet.",
        details: "Vorgangsdetails",
        amountLabel: "Betrag",
        beneficiaryLabel: "Empfänger",
        cta: "Meine Vorgänge verfolgen",
        info: "Vorgänge werden in der Regel innerhalb von 24 bis 48 Geschäftsstunden bearbeitet."
    },
    nl: {
        subject: "Uw verzoek om bijwerking ontvangen — AGM INVEST",
        title: "Verzoek geregistreerd",
        body: "Wij hebben uw verzoek om bijwerking ontvangen. Het wordt momenteel verwerkt door onze diensten.",
        details: "Operationele gegevens",
        amountLabel: "Bedrag",
        beneficiaryLabel: "Begunstigde",
        cta: "Mijn verrichtingen volgen",
        info: "Bewerkingen worden gewoonlijk binnen 24 tot 48 werkuren verwerkt."
    },
    pl: {
        subject: "Twój wniosek o aktualizację został otrzymany — AGM INVEST",
        title: "Wniosek zarejestrowany",
        body: "Otrzymaliśmy Twój wniosek o aktualizację. Jest on obecnie przetwarzany przez nasze służby.",
        details: "Szczegóły operacji",
        amountLabel: "Kwota",
        beneficiaryLabel: "Beneficjent",
        cta: "Śledź moje operacje",
        info: "Operacje są zazwyczaj przetwarzane w ciągu 24 do 48 godzin roboczych."
    },
    pt: {
        subject: "O seu pedido de atualização foi recebido — AGM INVEST",
        title: "Pedido registado",
        body: "Recebemos o seu pedido de atualização. Ele está atualmente a ser processado pelos nossos serviços.",
        details: "Detalhes da operação",
        amountLabel: "Valor",
        beneficiaryLabel: "Beneficiário",
        cta: "Acompanhar as minhas operações",
        info: "As operações são geralmente processadas dentro de 24 a 48 horas úteis."
    },
    ro: {
        subject: "Cererea dvs. de actualizare a fost primită — AGM INVEST",
        title: "Cerere înregistrată",
        body: "Am primit cererea dvs. de actualizare. Aceasta este în curs de procesare de către serviciile noastre.",
        details: "Detalii operațiune",
        amountLabel: "Sumă",
        beneficiaryLabel: "Beneficiar",
        cta: "Urmăriți operațiunile mele",
        info: "Operațiunile sunt procesate de obicei în termen de 24 până la 48 de ore lucrătoare."
    },
    sv: {
        subject: "Din uppdateringsansökan har mottagits — AGM INVEST",
        title: "Ansökan registrerad",
        body: "Vi har mottagit din uppdateringsansökan. Den behandlas just nu av våra tjänster.",
        details: "Operationsdetaljer",
        amountLabel: "Belopp",
        beneficiaryLabel: "Mottagare",
        cta: "Följ mina transaktioner",
        info: "Operationer behandlas vanligtvis inom 24 till 48 arbetstimmar."
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
