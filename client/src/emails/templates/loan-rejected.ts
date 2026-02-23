import { emailLayout, btn, APP_URL } from '../layout';

interface LoanRejectedData {
    firstName: string;
    amount: number;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string; support: string }> = {
    fr: { subject: "📄 Décision sur votre demande — AGM INVEST", title: "Décision sur votre demande de prêt", body: "Après examen attentif de votre dossier, nous ne sommes malheureusement pas en mesure d'accorder votre demande de financement pour le moment. Cette décision peut être liée à des critères d'éligibilité actuels. N'hésitez pas à nous contacter pour en savoir plus.", cta: "Contacter le support", support: "Notre équipe reste disponible pour vous accompagner." },
    en: { subject: "📄 Decision on your application — AGM INVEST", title: "Decision on your loan application", body: "After careful review of your file, we regret to inform you that we are unable to approve your financing request at this time. This decision may be related to current eligibility criteria. Please do not hesitate to contact us to learn more.", cta: "Contact support", support: "Our team remains available to assist you." },
    es: { subject: "📄 Decisión sobre su solicitud — AGM INVEST", title: "Decisión sobre su solicitud de préstamo", body: "Tras una cuidadosa revisión de su expediente, lamentamos informarle que no podemos aprobar su solicitud de financiación en este momento. Esta decisión puede estar relacionada con los criterios de elegibilidad actuales.", cta: "Contactar soporte", support: "Nuestro equipo sigue disponible para ayudarle." },
    it: { subject: "📄 Decisione sulla tua richiesta — AGM INVEST", title: "Decisione sulla tua richiesta di prestito", body: "Dopo un'attenta revisione del tuo fascicolo, siamo spiacenti di informarti che non siamo in grado di approvare la tua richiesta di finanziamento al momento.", cta: "Contatta il supporto", support: "Il nostro team rimane disponibile ad assisterti." },
    de: { subject: "📄 Entscheidung zu Ihrem Antrag — AGM INVEST", title: "Entscheidung zu Ihrem Kreditantrag", body: "Nach sorgfältiger Prüfung Ihrer Unterlagen müssen wir Ihnen leider mitteilen, dass wir Ihren Finanzierungsantrag derzeit nicht genehmigen können.", cta: "Support kontaktieren", support: "Unser Team steht Ihnen weiterhin zur Verfügung." },
    nl: { subject: "📄 Beslissing over uw aanvraag — AGM INVEST", title: "Beslissing over uw leningaanvraag", body: "Na zorgvuldige beoordeling van uw dossier moeten we u helaas mededelen dat we uw financieringsaanvraag momenteel niet kunnen goedkeuren.", cta: "Contact opnemen", support: "Ons team staat voor u klaar." },
    pl: { subject: "📄 Decyzja w sprawie Twojego wniosku — AGM INVEST", title: "Decyzja w sprawie Twojego wniosku kredytowego", body: "Po dokładnym rozpatrzeniu Twojej dokumentacji, ze smutkiem informujemy, że nie możemy w tej chwili zatwierdzić Twojego wniosku o finansowanie.", cta: "Skontaktuj się z pomocą", support: "Nasz zespół pozostaje do Twojej dyspozycji." },
    pt: { subject: "📄 Decisão sobre o seu pedido — AGM INVEST", title: "Decisão sobre o seu pedido de empréstimo", body: "Após análise cuidadosa do seu processo, lamentamos informar que não podemos aprovar o seu pedido de financiamento neste momento.", cta: "Contactar suporte", support: "Nossa equipa permanece disponível para o ajudar." },
    ro: { subject: "📄 Decizie privind cererea dvs. — AGM INVEST", title: "Decizie privind cererea de împrumut", body: "After a thorough review of your file, we regret to inform you that we are unable to approve your financing request at this time.", cta: "Contactați suportul", support: "Echipa noastră rămâne disponibilă pentru a vă ajuta." },
    sv: { subject: "📄 Beslut om din ansökan — AGM INVEST", title: "Beslut om din låneansökan", body: "Efter noggrann granskning av din fil beklagar vi att informera dig om att vi för tillfället inte kan godkänna din finansieringsansökan.", cta: "Kontakta support", support: "Vårt team finns tillgängligt för att hjälpa dig." },
};

export function loanRejectedTemplate(data: LoanRejectedData, lang: string = 'fr'): { subject: string; html: string } {
    const t = translations[lang] || translations['fr'];
    const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 12px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:14px;font-weight:700;color:#991B1B;margin:0;">Montant demandé : ${data.amount.toLocaleString()} €</p>
    </div>
    <p style="font-size:13px;color:#94A3B8;margin:0 0 24px;">${t.support}</p>
    ${btn(t.cta, `${APP_URL}/dashboard/support`)}
  `;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
