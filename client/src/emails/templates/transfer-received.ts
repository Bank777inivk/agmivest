import { emailLayout, btn, APP_URL } from '../layout';

interface TransferReceivedData {
    amount: number;
}

export function transferReceivedTemplate(data: TransferReceivedData, lang: string = 'fr'): { subject: string; html: string } {
    const translations: Record<string, { subject: string; title: string; body: string; cta: string; info: string }> = {
        fr: {
            subject: "Un virement vous est destiné",
            title: "Virement en attente",
            body: `Bonjour,\n\nNous vous informons qu'un virement d'un montant de **${data.amount.toLocaleString()} €** vous est destiné.\nCelui-ci est actuellement en attente et sera traité sous un délai de **24 à 48 heures** pour sa recevabilité.`,
            cta: "Consulter l'espace client",
            info: "Les fonds seront crédités une fois les vérifications d'usage terminées."
        },
        en: {
            subject: "A transfer is destined for you",
            title: "Pending Transfer",
            body: `Hello,\n\nWe inform you that a transfer of **${data.amount.toLocaleString()} €** is destined for you.\nThis is currently pending and will be processed within **24 to 48 hours** for admissibility.`,
            cta: "View client space",
            info: "Funds will be credited once standard verifications are complete."
        },
        es: {
            subject: "Una transferencia le está destinada",
            title: "Transferencia Pendiente",
            body: `Hola,\n\nLe informamos que una transferencia de **${data.amount.toLocaleString()} €** le está destinada.\nActualmente está pendiente y será procesada en un plazo de **24 a 48 horas** para su admisibilidad.`,
            cta: "Ver el espacio del cliente",
            info: "Los fondos serán acreditados una vez finalizadas las verificaciones habituales."
        },
        it: {
            subject: "Un bonifico ti è destinato",
            title: "Bonifico in sospeso",
            body: `Buongiorno,\n\nTi informiamo che un bonifico di **${data.amount.toLocaleString()} €** ti è destinato.\nÈ attualmente in sospeso e sarà elaborato entro **24-48 ore** per l'ammissibilità.`,
            cta: "Vai all'area clienti",
            info: "I fondi saranno accreditati una volta completate le consuete verifiche."
        },
        de: {
            subject: "Eine Überweisung ist für Sie bestimmt",
            title: "Ausstehende Überweisung",
            body: `Guten Tag,\n\nWir informieren Sie, dass eine Überweisung in Höhe von **${data.amount.toLocaleString()} €** für Sie bestimmt ist.\nDiese ist derzeit ausstehend und wird innerhalb von **24 bis 48 Stunden** auf ihre Zulässigkeit geprüft.`,
            cta: "Kundenbereich anzeigen",
            info: "Die Mittel werden nach Abschluss der üblichen Überprüfungen gutgeschrieben."
        },
        nl: {
            subject: "Een overschrijving is voor u bestemd",
            title: "Overschrijving in afwachting",
            body: `Hallo,\n\nWij informeren u dat een overschrijving van **${data.amount.toLocaleString()} €** voor u bestemd is.\nDeze is momenteel in afwachting en zal worden verwerkt binnen **24 tot 48 uur** voor ontvankelijkheid.`,
            cta: "Bekijk klantenzone",
            info: "Fondsen worden gecrediteerd zodra standaard verificaties zijn voltooid."
        },
        pl: {
            subject: "Przelew jest do Ciebie skierowany",
            title: "Oczekujący przelew",
            body: `Dzień dobry,\n\nInformujemy, że przelew o kwocie **${data.amount.toLocaleString()} €** jest do Ciebie skierowany.\nObecnie oczekuje i zostanie przetworzony w ciągu **24 do 48 godzin** w celu akceptacji.`,
            cta: "Zobacz strefę klienta",
            info: "Środki zostaną zaksięgowane po zakończeniu standardowych weryfikacji."
        },
        pt: {
            subject: "Uma transferência é destinada a você",
            title: "Transferência pendente",
            body: `Olá,\n\nInformamos que uma transferência no valor de **${data.amount.toLocaleString()} €** é destinada a você.\nEsta atualmente encontra-se pendente e será processada no prazo de **24 a 48 horas** para admissibilidade.`,
            cta: "Ver espaço do cliente",
            info: "Os fundos serão creditados assim que as verificações habituais forem concluídas."
        },
        ro: {
            subject: "Un transfer vă este destinat",
            title: "Transfer în așteptare",
            body: `Bună ziua,\n\nVă informăm că un transfer în valoare de **${data.amount.toLocaleString()} €** vă este destinat.\nAcesta este momentan în așteptare și va fi procesat într-un termen de **24 până la 48 de ore** pentru admisibilitate.`,
            cta: "Vezi spațiul clientului",
            info: "Fondurile vor fi creditate odată ce verificările standard sunt finalizate."
        },
        sv: {
            subject: "En överföring är avsedd för dig",
            title: "Väntande överföring",
            body: `Hej,\n\nVi informerar dig om att en överföring på **${data.amount.toLocaleString()} €** är avsedd för dig.\nDenna är för närvarande väntande och kommer att behandlas inom **24 till 48 timmar** för godkännande.`,
            cta: "Visa kundområde",
            info: "Medel kommer att krediteras när sedvanliga verifieringar är slutförda."
        },
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:0 0 24px;">
      <p style="font-size:14px;color:#1E3A5F;font-weight:600;margin:0;line-height:1.6;">
        ${t.info}
      </p>
    </div>

    ${btn(t.cta, `${APP_URL}/dashboard`)}
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
}
