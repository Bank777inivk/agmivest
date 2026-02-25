import { emailLayout, btn, APP_URL } from '../layout';
interface TransferData { firstName: string; amount: number; iban?: string; reason?: string; }
const approved: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise à jour de votre compte — AGM INVEST", title: "Action validée", body: "Bonne nouvelle ! Votre opération a été traitée et validée par notre équipe.", cta: "Voir mes opérations" },
    en: { subject: "Account update — AGM INVEST", title: "Action approved", body: "Good news! Your operation has been processed and approved by our team.", cta: "View my operations" },
    es: { subject: "Actualización de su cuenta — AGM INVEST", title: "Acción aprobada", body: "¡Buenas noticias! Su operación ha sido procesada y aprobada por nuestro equipo.", cta: "Ver mis operaciones" },
    it: { subject: "Aggiornamento del tuo conto — AGM INVEST", title: "Azione approvata", body: "Buone notizie! La tua operazione è stata elaborata e approvata dal nostro team.", cta: "Visualizza le mie operazioni" },
    de: { subject: "Kontoaktualisierung — AGM INVEST", title: "Aktion genehmigt", body: "Gute Nachrichten! Ihr Vorgang wurde von unserem Team bearbeitet und genehmigt.", cta: "Meine Vorgänge ansehen" },
    nl: { subject: "Account bijwerking — AGM INVEST", title: "Actie goedgekeurd", body: "Goed nieuws! Uw bewerking is verwerkt en goedgekeurd door ons team.", cta: "Mijn bewerkingen bekijken" },
    pl: { subject: "Aktualizacja konta — AGM INVEST", title: "Działanie zatwierdzone", body: "Dobra wiadomość! Twoja operacja została przetworzona i zatwierdzona przez nasz zespół.", cta: "Zobacz moje operacje" },
    pt: { subject: "Atualização da sua conta — AGM INVEST", title: "Ação aprovada", body: "Boas notícias! A sua operação foi processada e aprovada pela nossa equipa.", cta: "Ver as minhas opérations" },
    ro: { subject: "Actualizare cont — AGM INVEST", title: "Acțiune aprobată", body: "Vești bune! Operațiunea dvs. a fost procesată și aprobată de echipa noastră.", cta: "Vezi operațiunile mele" },
    sv: { subject: "Kontouppdatering — AGM INVEST", title: "Åtgärd godkänd", body: "Goda nyheter! Din operation har behandlats och godkänts av vårt team.", cta: "Se mina transaktioner" },
};
const rejected: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Action requise sur votre compte — AGM INVEST", title: "Information sur votre opération", body: "Votre demande de mise à jour n'a pas pu être finalisée. Consultez votre espace pour plus d'informations ou contactez notre support.", cta: "Contacter le support" },
    en: { subject: "Account action required — AGM INVEST", title: "Information about your operation", body: "Your update request could not be finalized. Check your account for more information or contact our support.", cta: "Contact support" },
    es: { subject: "Acción requerida en su cuenta — AGM INVEST", title: "Información sobre su operación", body: "Su solicitud de actualización no pudo ser finalizada. Consulte su espacio para obtener más información o contacte a nuestro soporte.", cta: "Contactar soporte" },
    it: { subject: "Azione richiesta sul tuo conto — AGM INVEST", title: "Informazioni sulla tua operazione", body: "La tua richiesta di aggiornamento non ha potuto essere finalizzata. Consulta il tuo spazio per ulteriori informazioni o contatta il nostro supporto.", cta: "Contatta il supporto" },
    de: { subject: "Kontoaktion erforderlich — AGM INVEST", title: "Informationen zu Ihrem Vorgang", body: "Ihr Aktualisierungsantrag konnte nicht abgeschlossen werden. Überprüfen Sie Ihren Bereich für weitere Informationen oder kontaktieren Sie unseren Support.", cta: "Support kontaktieren" },
    nl: { subject: "Account actie vereist — AGM INVEST", title: "Informatie over uw bewerking", body: "Uw verzoek om bijwerking kon niet worden voltooid. Raadpleeg uw account voor meer informatie of neem contact op met onze ondersteuning.", cta: "Contact opnemen" },
    pl: { subject: "Wymagane działanie na koncie — AGM INVEST", title: "Informacja o Twojej operacji", body: "Twój wniosek o aktualizację nie mógł zostać sfinalizowany. Sprawdź swoje konto, aby uzyskać więcej informacji lub skontaktuj się z pomocą.", cta: "Skontaktuj się z pomocą" },
    pt: { subject: "Ação necessária na sua conta — AGM INVEST", title: "Informação sobre a sua operação", body: "O seu pedido de atualização não pôde ser finalizado. Consulte o seu espace para mais informações ou contacte o nosso suporte.", cta: "Contactar suporte" },
    ro: { subject: "Acțiune necesară pe cont — AGM INVEST", title: "Informații despre operațiunea dvs.", body: "Cererea dvs. de actualizare nu a putut fi finalizată. Consultați spațiul dvs. para mai multe informações ou contactați suportul nostru.", cta: "Contactați suportul" },
    sv: { subject: "Kontoåtgärd krävs — AGM INVEST", title: "Information om din operation", body: "Din uppdateringsansökan kunde inte slutföras. Kontrollera ditt konto för mer information eller kontakta vår support.", cta: "Kontakta support" },
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
