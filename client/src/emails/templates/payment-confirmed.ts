import { emailLayout, btn, APP_URL } from '../layout';
interface PaymentConfirmedData { firstName: string; amount?: number; }
const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: { subject: "Depot confirme - AGM INVEST", title: "Votre d&eacute;p&ocirc;t a &eacute;t&eacute; re&ccedil;u et confirm&eacute;", body: "Nous avons bien re&ccedil;u votre d&eacute;p&ocirc;t. Votre solde a &eacute;t&eacute; mis &agrave; jour et votre dossier progresse vers la finalisation.", cta: "Voir mon compte" },
    en: { subject: "✅ Deposit confirmed — AGM INVEST", title: "Your deposit has been received and confirmed", body: "We have received your deposit. Your balance has been updated and your file is progressing towards completion.", cta: "View my account" },
    es: { subject: "✅ Depósito confirmado — AGM INVEST", title: "Su depósito ha sido recibido y confirmado", body: "Hemos recibido su depósito. Su saldo ha sido actualizado y su expediente avanza hacia la finalización.", cta: "Ver mi cuenta" },
    it: { subject: "✅ Deposito confermato — AGM INVEST", title: "Il tuo deposito è stato ricevuto e confermato", body: "Abbiamo ricevuto il tuo deposito. Il tuo saldo è stato aggiornato e la tua pratica sta progredendo verso il completamento.", cta: "Visualizza il mio conto" },
    de: { subject: "✅ Einzahlung bestätigt — AGM INVEST", title: "Ihre Einzahlung wurde empfangen und bestätigt", body: "Wir haben Ihre Einzahlung erhalten. Ihr Guthaben wurde aktualisiert und Ihre Akte schreitet auf den Abschluss zu.", cta: "Mein Konto ansehen" },
    nl: { subject: "✅ Aanbetaling bevestigd — AGM INVEST", title: "Uw aanbetaling is ontvangen en bevestigd", body: "We hebben uw aanbetaling ontvangen. Uw saldo is bijgewerkt en uw dossier vordert naar voltooiing.", cta: "Mijn account bekijken" },
    pl: { subject: "✅ Wpłata potwierdzona — AGM INVEST", title: "Twoja wpłata została otrzymana i potwierdzona", body: "Otrzymaliśmy Twoją wpłatę. Twoje saldo zostało zaktualizowane, a dokumentacja postępuje w kierunku zakończenia.", cta: "Zobacz moje konto" },
    pt: { subject: "✅ Depósito confirmado — AGM INVEST", title: "O seu depósito foi recebido e confirmado", body: "Recebemos o seu depósito. O seu saldo foi atualizado e o seu processo está a progredir para a conclusão.", cta: "Ver a minha conta" },
    ro: { subject: "✅ Depozit confirmat — AGM INVEST", title: "Depozitul dvs. a fost primit și confirmat", body: "Am primit depozitul dvs. Soldul dvs. a fost actualizat și dosarul progresează spre finalizare.", cta: "Vizualizați contul meu" },
    sv: { subject: "✅ Insättning bekräftad — AGM INVEST", title: "Din insättning har mottaqits och bekräftats", body: "Vi har mottagit din insättning. Ditt saldo har uppdaterats och din fil fortskrider mot slutförandet.", cta: "Se mitt konto" },
};
export function paymentConfirmedTemplate(data: PaymentConfirmedData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];
    const amount = data.amount || 286;
    const content = `<h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1><p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p><div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center;"><p style="font-size:28px;font-weight:900;color:#16A34A;margin:0;">+ ${amount} €</p></div>${btn(t.cta, `${APP_URL}/dashboard`)}`;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
