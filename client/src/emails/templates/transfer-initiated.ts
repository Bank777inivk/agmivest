import { emailLayout, btn, APP_URL } from '../layout';

interface TransferInitiatedData {
    firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
    fr: {
        subject: "Confirmation d'enregistrement — AGM INVEST",
        title: "Bonjour",
        body: "Nous vous informons qu'un nouvel enregistrement d'operation a ete recu. Votre dossier est en cours de traitement par nos services.",
        cta: "Consulter mon espace",
        info: "Les operations sont traitees dans les meilleurs delais par nos equipes."
    },
    en: {
        subject: "Recording confirmation — AGM INVEST",
        title: "Hello",
        body: "We inform you that a new operation recording has been received. Your file is currently being processed by our services.",
        cta: "View my space",
        info: "Operations are processed as soon as possible by our teams."
    },
    es: {
        subject: "Confirmación de registro — AGM INVEST",
        title: "Hola",
        body: "Le informamos que se ha recibido un nuevo registro de operación. Su expediente está siendo procesado por nuestros servicios.",
        cta: "Ver mi espacio",
        info: "Las operaciones son procesadas lo antes posible por nuestros equipos."
    },
    it: {
        subject: "Conferma di registrazione — AGM INVEST",
        title: "Buongiorno",
        body: "Ti informiamo che è stata ricevuta una nuova registrazione di operazione. La tua pratica è in fase di elaborazione dai nostri servizi.",
        cta: "Visualizza il mio spazio",
        info: "Le operazioni vengono elaborate il prima possibile dai nostri team."
    },
    de: {
        subject: "Registrierungsbestätigung — AGM INVEST",
        title: "Hallo",
        body: "Wir informieren Sie, dass eine neue Vorgangsregistrierung eingegangen ist. Ihre Akte wird derzeit von unseren Diensten bearbeitet.",
        cta: "Meinen Bereich ansehen",
        info: "Vorgänge werden von unseren Teams so schnell wie möglich bearbeitet."
    },
    nl: {
        subject: "Registratiebevestiging — AGM INVEST",
        title: "Hallo",
        body: "Wij informeren u dat er een nieuwe bewerkingsregistratie is ontvangen. Uw dossier wordt momenteel verwerkt door onze diensten.",
        cta: "Mijn ruimte bekijken",
        info: "Bewerkingen worden zo snel mogelijk door onze teams verwerkt."
    },
    pl: {
        subject: "Potwierdzenie rejestracji — AGM INVEST",
        title: "Witaj",
        body: "Informujemy, że wpłynęło nowe nagranie operacji. Twój wniosek jest obecnie przetwarzany przez nasze służby.",
        cta: "Zobacz mój obszar",
        info: "Operacje są przetwarzane przez nasze zespoły tak szybko, jak to możliwe."
    },
    pt: {
        subject: "Confirmação de registo — AGM INVEST",
        title: "Olá",
        body: "Informamos que foi recebido um novo registo de operação. O seu processo está atualmente a ser processado pelos nossos serviços.",
        cta: "Ver o meu espaço",
        info: "As operações são processadas o mais brevemente possível pelas nossas equipas."
    },
    ro: {
        subject: "Confirmarea înregistrării — AGM INVEST",
        title: "Bună ziua",
        body: "Vă informăm că a fost primită o nouă înregistrare de operațiune. Dosarul dumneavoastră este în curs de procesare de către serviciile noastre.",
        cta: "Vizualizați spațiul meu",
        info: "Operațiunile sunt procesate în cel mai scurt timp de către echipele noastre."
    },
    sv: {
        subject: "Registreringsbekräftelse — AGM INVEST",
        title: "Hej",
        body: "Vi informerar dig om att en ny operationsregistrering har tagits emot. Din fil behandlas just nu av våra tjänster.",
        cta: "Se mitt utrymme",
        info: "Operationer behandlas så snart som möjligt av våra team."
    },
};

export function transferInitiatedTemplate(data: TransferInitiatedData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        Vous pouvez suivre l'etat d'avancement de cette mise a jour directement dans votre espace securise.
      </p>
    </div>

    <p style="font-size:13px;color:#94A3B8;margin:24px 0 0;">💡 ${t.info}</p>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
