import { emailLayout, btn, APP_URL } from '../layout';

interface ChatNotificationData {
  firstName: string;
}

export function chatNotificationTemplate(data: ChatNotificationData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    fr: {
      subject: "Nouveau message de votre conseiller",
      title: "Nouveau message disponible",
      body: `Bonjour ${data.firstName},\n\nUn nouveau message de votre conseiller financier vous attend dans votre espace client. Nous vous invitons à en prendre connaissance pour continuer le traitement de votre dossier.`,
      cta: "Consulter mon message"
    },
    en: {
      subject: "New message from your advisor",
      title: "New message available",
      body: `Hello ${data.firstName},\n\nA new message from your financial advisor is waiting for you in your client area. We invite you to read it to continue processing your file.`,
      cta: "Check my message"
    },
    es: {
      subject: "Nuevo mensaje de su asesor",
      title: "Nuevo mensaje disponible",
      body: `Hola ${data.firstName},\n\nUn nuevo mensaje de su asesor financiero le espera en su área de cliente. Le invitamos a leerlo para continuar con la tramitación de su expediente.`,
      cta: "Consultar mi mensaje"
    },
    it: {
      subject: "Nuovo messaggio dal tuo consulente",
      title: "Nuovo messaggio disponibile",
      body: `Buongiorno ${data.firstName},\n\nUn nuovo messaggio dal tuo consulente finanziario ti aspetta nella tua area clienti. Ti invitiamo a prenderne visione per proseguire l'elaborazione della tua pratica.`,
      cta: "Consulta il mio messaggio"
    },
    de: {
      subject: "Neue Nachricht von Ihrem Berater",
      title: "Neue Nachricht verfügbar",
      body: `Hallo ${data.firstName},\n\nEine neue Nachricht von Ihrem Finanzberater wartet in Ihrem Kundenbereich auf Sie. Wir laden vous ein, diese zu lesen, um die Bearbeitung Ihrer Akte fortzusetzen.`,
      cta: "Meine Nachricht prüfen"
    },
    nl: {
      subject: "Nieuw bericht van uw adviseur",
      title: "Nieuw bericht beschikbaar",
      body: `Hallo ${data.firstName},\n\nEr wacht een nieuw bericht van uw financieel adviseur op u in uw klantenzone. Wij nodigen u uit om dit te lezen om de verwerking van uw dossier voort te zetten.`,
      cta: "Mijn bericht bekijken"
    },
    pl: {
      subject: "Nowa wiadomość od Twojego doradcy",
      title: "Nowa wiadomość dostępna",
      body: `Witaj ${data.firstName},\n\nNowa wiadomość od Twojego doradcy finansowego czeka na Ciebie w panelu klienta. Zapraszamy do zapoznania się z nią, aby kontynuować procesowanie Twojej sprawy.`,
      cta: "Sprawdź moją wiadomość"
    },
    pt: {
      subject: "Nova mensagem do seu consultor",
      title: "Nova mensagem disponível",
      body: `Olá ${data.firstName},\n\nUma nova mensagem do seu consultor financeiro aguarda por si na sua área de cliente. Convidamo-lo a lê-la para continuar o processamento do seu processo.`,
      cta: "Consultar a minha mensagem"
    },
    ro: {
      subject: "Mesaj nou de la consilierul dumneavoastră",
      title: "Mesaj nou disponibil",
      body: `Bună ziua ${data.firstName},\n\nUn mesaj nou de la consilierul dumneavoastră financiar vă așteaptă în zona de client. Vă invităm să îl citiți pentru a continua procesarea dosarului dumneavoastră.`,
      cta: "Consultă mesajul meu"
    },
    sv: {
      subject: "Nytt meddelande från din rådgivare",
      title: "Nytt meddelande tillgängligt",
      body: `Hej ${data.firstName},\n\nEtt nytt meddelande från din finansiella rådgivare väntar på dig i ditt klientområde. Vi bjuder in dig att läsa det för att fortsätta handläggningen av ditt ärende.`,
      cta: "Kontrollera mitt meddelande"
    },
  };

  const t = translations[lang] || translations['fr'];
  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
    
    <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#0369A1;font-weight:600;margin:0;line-height:1.6;">
        Vous pouvez repondre directement a ce message depuis votre messagerie securisee.
      </p>
    </div>
    
    ${btn(t.cta, `${APP_URL}/dashboard/chat`)}
  `;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
