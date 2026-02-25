import { emailLayout, btn, APP_URL } from '../layout';
interface PaymentConfirmedData { firstName: string; amount?: number; }
const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Mise à jour de votre compte — AGM INVEST", title: "Votre opération a été confirmée", body: "Nous avons bien reçu votre mise à jour. Votre solde a été mis à jour et votre dossier progresse vers la finalisation.", cta: "Voir mon compte" },
    en: { subject: "Account update — AGM INVEST", title: "Your operation has been confirmed", body: "We have received your update. Your balance has been updated and your file is progressing towards completion.", cta: "View my account" },
    es: { subject: "Actualización de su cuenta — AGM INVEST", title: "Su operación ha sido confirmada", body: "Hemos recibido su actualización. Su saldo ha sido actualizado y su expediente avanza hacia la finalización.", cta: "Ver mi cuenta" },
    it: { subject: "Aggiornamento del tuo conto — AGM INVEST", title: "La tua operazione è stata confermata", body: "Abbiamo ricevuto il tuo aggiornamento. Il tuo saldo è stato aggiornato e la tua pratica sta progredendo verso il completamento.", cta: "Visualizza il mio conto" },
    de: { subject: "Kontoaktualisierung — AGM INVEST", title: "Ihre Operation wurde bestätigt", body: "Wir haben Ihre Aktualisierung erhalten. Ihr Guthaben wurde aktualisiert und Ihre Akte schreitet auf den Abschluss zu.", cta: "Mein Konto ansehen" },
    nl: { subject: "Account bijwerking — AGM INVEST", title: "Uw bewerking is bevestigd", body: "We hebben uw bijwerking ontvangen. Uw saldo is bijgewerkt en uw dossier vordert naar voltooiing.", cta: "Mijn account bekijken" },
    pl: { subject: "Aktualizacja konta — AGM INVEST", title: "Twoja operacja została potwierdzona", body: "Otrzymaliśmy Twoją aktualizację. Twoje saldo zostało zaktualizowane, a dokumentacja postępuje w kierunku zakończenia.", cta: "Zobacz moje konto" },
    pt: { subject: "Atualização da sua conta — AGM INVEST", title: "A sua operação foi confirmada", body: "Recebemos a sua atualização. O seu saldo foi atualizado e o seu processo está a progredir para a conclusão.", cta: "Ver a minha conta" },
    ro: { subject: "Actualizare cont — AGM INVEST", title: "Operațiunea dvs. a fost confirmată", body: "Am primit actualizarea dvs. Soldul dvs. a été actualizat și dosarul progresează spre finalizare.", cta: "Vizualizați contul meu" },
    sv: { subject: "Kontouppdatering — AGM INVEST", title: "Din operation har bekräftats", body: "Vi har mottagit din uppdatering. Ditt saldo har uppdaterats och din fil fortskrider mot slutförandet.", cta: "Se mitt konto" },
};
export function paymentConfirmedTemplate(data: PaymentConfirmedData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];
    const amount = data.amount || 286;
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p><div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center;"><p style="font-size:28px;font-weight:900;color:#16A34A;margin:0;">+ ${amount} €</p></div>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
