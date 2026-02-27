import { emailLayout, btn, APP_URL } from '../layout';

interface KycData {
    firstName: string;
}

export function kycReceivedTemplate(data: KycData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "Confirmation de reception de vos documents",
            title: "Documents bien recus",
            body: "Bonjour " + data.firstName + ",\n\nNous vous confirmons avoir bien recu vos documents justificatifs. Notre equipe etudie actuellement votre dossier.\n\nVous serez informe par email des que la verification sera terminee.",
            cta: "Suivre mon dossier"
        },
        en: {
            subject: "Confirmation of document receipt",
            title: "Documents received",
            body: "Hello " + data.firstName + ",\n\nWe confirm that we have received your supporting documents. Our team is currently reviewing your file.\n\nYou will be informed by email as soon as the verification is complete.",
            cta: "Track my file"
        },
        es: {
            subject: "Confirmacion de recepcion de sus documentos",
            title: "Documentos recibidos con exito",
            body: "Hola " + data.firstName + ",\n\nLe confirmamos que hemos recibido sus documentos justificativos. Nuestro equipo esta revisando su expediente en este momento.\n\nSe le informara por correo electronico tan pronto como finalice la verificacion.",
            cta: "Seguir mi expediente"
        },
        it: {
            subject: "Conferma di ricezione dei tuoi documenti",
            title: "Documenti ricevuti con successo",
            body: "Buongiorno " + data.firstName + ",\n\nTi confermiamo di aver ricevuto i tuoi documenti giustificativi. Il nostro team sta attualmente esaminando la tua pratica.\n\nSarai informato via email non appena la verifica sarà completata.",
            cta: "Segui la mia pratica"
        },
        de: {
            subject: "Bestatigung des Eingangs Ihrer Dokumente",
            title: "Dokumente erfolgreich erhalten",
            body: "Hallo " + data.firstName + ",\n\nWir bestatigen den Erhalt Ihrer Unterlagen. Unser Team pruft derzeit Ihre Akte.\n\nSie werden per E-Mail informiert, sobald die Prufung abgeschlossen ist.",
            cta: "Meine Akte verfolgen"
        },
        nl: {
            subject: "Bevestiging van ontvangst van uw documenten",
            title: "Documenten succesvol ontvangen",
            body: "Hallo " + data.firstName + ",\n\nWij bevestigen dat we uw ondersteunende documenten hebben ontvangen. Ons team beoordeelt momenteel uw dossier.\n\nU wordt per e-mail geinformeerd zodra de verificatie is voltooid.",
            cta: "Mijn dossier volgen"
        },
        pl: {
            subject: "Potwierdzenie otrzymania dokumentow",
            title: "Dokumenty zostaly odebrane",
            body: "Witaj " + data.firstName + ",\n\nPotwierdzamy otrzymanie Twoich dokumentow uzupelniających. Nasz zespol analizuje obecnie Twoj wniosek.\n\nZostaniesz poinformowany drogą mailową, gdy tylko weryfikacja zostanie zakonczona.",
            cta: "Sledz moj wniosek"
        },
        pt: {
            subject: "Confirmacao de rececao dos seus documentos",
            title: "Documentos recebidos com sucesso",
            body: "Ola " + data.firstName + ",\n\nConfirmamos que recebemos os seus documentos comprovativos. A nossa equipa esta a analisar o seu processo neste momento.\n\nSera informado por e-mail assim que a verificacao estiver concluida.",
            cta: "Acompanhar o meu processo"
        },
        ro: {
            subject: "Confirmarea primirii documentelor dumneavoastra",
            title: "Documente primite cu succes",
            body: "Buna ziua " + data.firstName + ",\n\nVa confirmam ca am primit documentele dumneavoastra justificative. Echipa noastra analizeaza in prezent dosarul dumneavoastra.\n\nVeti fi informat prin e-mail imediat ce verificarea va fi finalizata.",
            cta: "Urmariti dosarul meu"
        },
        sv: {
            subject: "Bekraftelse pa mottagande av dina dokument",
            title: "Dokumenten har tagits emot",
            body: "Hej " + data.firstName + ",\n\nVi bekraftar att vi har tagit emot dina styrkande handlingar. Vart team granskar just nu din fil.\n\nDu kommer att informeras via e-post sa snart verifieringen ar klar.",
            cta: "Folj min fil"
        }
    };

    const t = translations[lang] || translations['fr'];
    const content = `
        <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
        <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
            <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
                Merci de votre confiance.
            </p>
        </div>
        ${btn(t.cta, `${APP_URL}/dashboard/profile/verification`)}
    `;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
