import { emailLayout, btn, APP_URL } from '../layout';
interface TransferData { firstName: string; amount: number; iban?: string; reason?: string; }
const approved: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "✅ Virement approuvé — AGM INVEST", title: "Votre virement a été approuvé", body: "Bonne nouvelle ! Votre demande de virement a été traitée et approuvée par notre équipe.", cta: "Voir mes virements" },
    en: { subject: "✅ Transfer approved — AGM INVEST", title: "Your transfer has been approved", body: "Good news! Your transfer request has been processed and approved by our team.", cta: "View my transfers" },
    es: { subject: "✅ Transferencia aprobada — AGM INVEST", title: "Su transferencia ha sido aprobada", body: "¡Buenas noticias! Su solicitud de transferencia ha sido procesada y aprobada por nuestro equipo.", cta: "Ver mis transferencias" },
    it: { subject: "✅ Bonifico approvato — AGM INVEST", title: "Il tuo bonifico è stato approvato", body: "Buone notizie! La tua richiesta di bonifico è stata elaborata e approvata dal nostro team.", cta: "Visualizza i miei bonifici" },
    de: { subject: "✅ Überweisung genehmigt — AGM INVEST", title: "Ihre Überweisung wurde genehmigt", body: "Gute Nachrichten! Ihr Überweisungsantrag wurde von unserem Team bearbeitet und genehmigt.", cta: "Meine Überweisungen ansehen" },
    nl: { subject: "✅ Overschrijving goedgekeurd — AGM INVEST", title: "Uw overschrijving is goedgekeurd", body: "Goed nieuws! Uw overboekingsverzoek is verwerkt en goedgekeurd door ons team.", cta: "Mijn overschrijvingen bekijken" },
    pl: { subject: "✅ Przelew zatwierdzony — AGM INVEST", title: "Twój przelew został zatwierdzony", body: "Dobra wiadomość! Twoje zlecenie przelewu zostało przetworzone i zatwierdzone przez nasz zespół.", cta: "Zobacz moje przelewy" },
    pt: { subject: "✅ Transferência aprovada — AGM INVEST", title: "A sua transferência foi aprovada", body: "Boas notícias! O seu pedido de transferência foi processado e aprovado pela nossa equipa.", cta: "Ver as minhas transferências" },
    ro: { subject: "✅ Transfer aprobat — AGM INVEST", title: "Transferul dvs. a fost aprobat", body: "Vești bune! Cererea de transfer a fost procesată și aprobată de echipa noastră.", cta: "Vezi transferurile mele" },
    sv: { subject: "✅ Överföring godkänd — AGM INVEST", title: "Din överföring har godkänts", body: "Goda nyheter! Din överföringsansökan har behandlats och godkänts av vårt team.", cta: "Se mina överföringar" },
};
const rejected: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "❌ Virement refusé — AGM INVEST", title: "Votre virement n'a pas pu être traité", body: "Malheureusement, votre demande de virement a été refusée. Consultez votre espace pour plus d'informations ou contactez notre support.", cta: "Contacter le support" },
    en: { subject: "❌ Transfer rejected — AGM INVEST", title: "Your transfer could not be processed", body: "Unfortunately, your transfer request has been rejected. Check your account for more information or contact our support.", cta: "Contact support" },
    es: { subject: "❌ Transferencia rechazada — AGM INVEST", title: "Su transferencia no pudo ser procesada", body: "Lamentablemente, su solicitud de transferencia fue rechazada. Consulte su espacio para obtener más información o contacte a nuestro soporte.", cta: "Contactar soporte" },
    it: { subject: "❌ Bonifico rifiutato — AGM INVEST", title: "Il tuo bonifico non ha potuto essere elaborato", body: "Purtroppo la tua richiesta di bonifico è stata rifiutata. Consulta il tuo spazio per ulteriori informazioni o contatta il nostro supporto.", cta: "Contatta il supporto" },
    de: { subject: "❌ Überweisung abgelehnt — AGM INVEST", title: "Ihre Überweisung konnte nicht bearbeitet werden", body: "Leider wurde Ihr Überweisungsantrag abgelehnt. Überprüfen Sie Ihren Bereich für weitere Informationen oder kontaktieren Sie unseren Support.", cta: "Support kontaktieren" },
    nl: { subject: "❌ Overschrijving geweigerd — AGM INVEST", title: "Uw overschrijving kon niet worden verwerkt", body: "Helaas is uw overboekingsverzoek afgewezen. Raadpleeg uw account voor meer informatie of neem contact op met onze ondersteuning.", cta: "Contact opnemen" },
    pl: { subject: "❌ Przelew odrzucony — AGM INVEST", title: "Twój przelew nie mógł zostać zrealizowany", body: "Niestety Twoje zlecenie przelewu zostało odrzucone. Sprawdź swoje konto, aby uzyskać więcej informacji lub skontaktuj się z pomocą.", cta: "Skontaktuj się z pomocą" },
    pt: { subject: "❌ Transferência recusada — AGM INVEST", title: "A sua transferência não pôde ser processada", body: "Infelizmente, o seu pedido de transferência foi recusado. Consulte o seu espaço para mais informações ou contacte o nosso suporte.", cta: "Contactar suporte" },
    ro: { subject: "❌ Transfer respins — AGM INVEST", title: "Transferul dvs. nu a putut fi procesat", body: "Din păcate, cererea de transfer a fost respinsă. Consultați spațiul dvs. pentru mai multe informații sau contactați suportul nostru.", cta: "Contactați suportul" },
    sv: { subject: "❌ Överföring avvisad — AGM INVEST", title: "Din överföring kunde inte behandlas", body: "Tyvärr har din överföringsansökan avslagits. Kontrollera ditt konto för mer information eller kontakta vår support.", cta: "Kontakta support" },
};
export function transferApprovedTemplate(data: TransferData, lang: string = 'fr'): { subject: string; html: string } {
    const t = approved[lang] || approved['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p><div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center;"><p style="font-size:28px;font-weight:900;color:#16A34A;margin:0;">${data.amount.toLocaleString()} €</p></div>${btn(t.cta, `${APP_URL}/dashboard/accounts/transfer`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
export function transferRejectedTemplate(data: TransferData, lang: string = 'fr'): { subject: string; html: string } {
    const t = rejected[lang] || rejected['fr'];
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>${data.reason ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px;margin:0 0 24px;"><p style="font-size:13px;color:#991B1B;margin:0;">Raison : ${data.reason}</p></div>` : ''}${btn(t.cta, `${APP_URL}/dashboard/support`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
