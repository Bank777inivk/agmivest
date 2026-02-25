import { emailLayout, btn, APP_URL } from '../layout';

interface TransferInitiatedData {
    firstName: string;
}

export function transferInitiatedTemplate(data: TransferInitiatedData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
        fr: {
            subject: "Demande de virement enregistree",
            title: "Demande de virement enregistree",
            body: "Bonjour " + data.firstName + ",\n\nNous vous informons qu'une nouvelle demande de virement a ete enregistree. Votre dossier est en cours de traitement par nos services.",
            cta: "Consulter mon espace",
            info: "Les operations sont traitees dans les meilleurs delais par nos equipes."
        },
        en: {
            subject: "Transfer request recorded",
            title: "Transfer request recorded",
            body: "Hello " + data.firstName + ",\n\nWe inform you that a new transfer request has been recorded. Your file is currently being processed by our services.",
            cta: "View my space",
            info: "Operations are processed as soon as possible by our teams."
        },
        es: {
            subject: "Solicitud de transferencia registrada",
            title: "Solicitud de transferencia registrada",
            body: "Hola " + data.firstName + ",\n\nLe informamos que se ha registrado una nueva solicitud de transferencia. Su expediente esta siendo procesado por nuestros servicios.",
            cta: "Ver mi espacio",
            info: "Las operaciones son procesadas lo antes posible por nuestros equipos."
        },
        it: {
            subject: "Richiesta di trasferimento registrata",
            title: "Richiesta di trasferimento registrata",
            body: "Buongiorno " + data.firstName + ",\n\nTi informiamo che e stata ricevuta una nuova richiesta di trasferimento. La tua pratica e in fase di elaborazione dai nostri servizi.",
            cta: "Visualizza il mio spazio",
            info: "Le operazioni vengono elaborate il prima possibile dai nostri team."
        },
        de: {
            subject: "Transferanfrage registriert",
            title: "Transferanfrage registriert",
            body: "Hallo " + data.firstName + ",\n\nWir informieren Sie, dass eine neue Transferanfrage eingegangen ist. Ihre Akte wird derzeit von unseren Diensten bearbeitet.",
            cta: "Meinen Bereich ansehen",
            info: "Vorgange werden von unseren Teams so schnell wie moglich bearbeitet."
        },
        nl: {
            subject: "Overboekingsverzoek geregistreerd",
            title: "Overboekingsverzoek geregistreerd",
            body: "Hallo " + data.firstName + ",\n\nWij informeren u dat er een nieuw overboekingsverzoek is ontvangen. Uw dossier wordt momenteel verwerkt door onze diensten.",
            cta: "Mijn ruimte bekijken",
            info: "Bewerkingen worden zo snel mogelijk door onze teams verwerkt."
        },
        pl: {
            subject: "Zlecenie przelewu zarejestrowane",
            title: "Zlecenie przelewu zarejestrowane",
            body: "Witaj " + data.firstName + ",\n\nInformujemy, ze wplynelo nowe zlecenie przelewu. Twoj wniosek jest obecnie przetwarzany przez nasze sluzby.",
            cta: "Zobacz moj obszar",
            info: "Operacje sa przetwarzane przez nasze zespoly tak szybko, jak to mozliwe."
        },
        pt: {
            subject: "Pedido de transferencia registado",
            title: "Pedido de transferencia registado",
            body: "Ola " + data.firstName + ",\n\nInformamos que foi recebido um novo pedido de transferencia. O seu processo esta atualmente a ser processado pelos nossos servicos.",
            cta: "Ver o meu espaco",
            info: "As operacoes sao processadas o mais brevemente possivel pelas nossas equipas."
        },
        ro: {
            subject: "Cerere de transfer inregistrata",
            title: "Cerere de transfer inregistrata",
            body: "Buna ziua " + data.firstName + ",\n\nVa confirmam ca am primit informatiile transmise pentru dosarul dumneavoastra. Serviciile noastre procedeaza in prezent la analizarea acestora.",
            cta: "Vizualizati spatiul meu",
            info: "Operatiunile sunt procesate in cel mai scurt timp de catre echipele noastre."
        },
        sv: {
            subject: "Overforingsbegaran registrerad",
            title: "Overforingsbegaran registrerad",
            body: "Hej " + data.firstName + ",\n\nVi bekraftar att vi har tagit emot den information som skickats for din fil. Vara tjanster granskar dem just nu.",
            cta: "Se mitt utrymme",
            info: "Operationer behandlas sa snart som mojligt av vara team."
        },
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>

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
