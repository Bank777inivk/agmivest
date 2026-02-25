import { emailLayout, btn, APP_URL } from '../layout';

interface LoanRejectedData {
  firstName: string;
}

const translations: Record<string, { subject: string; title: string; body: string; cta: string; support: string }> = {
  fr: { subject: "Mise à jour de votre dossier — AGM INVEST", title: "Bonjour", body: "Suite à l'étude de votre demande, nous vous informons que nous ne sommes pas en mesure d'y répondre favorablement pour le moment. Votre dossier a été mis à jour avec les informations correspondantes.", cta: "Contacter le support", support: "Notre équipe reste disponible pour tout complément d'information via votre espace client." },
  en: { subject: "Account update — AGM INVEST", title: "Hello", body: "Following the review of your request, we inform you that we are unable to respond favorably at this time. Your file has been updated with the corresponding information.", cta: "Contact support", support: "Our team remains available for any further information through your client space." },
  es: { subject: "Actualización de su expediente — AGM INVEST", title: "Hola", body: "Tras el estudio de su solicitud, le informamos que no podemos responder favorablemente por el momento. Su expediente ha sido actualizado con la información correspondiente.", cta: "Contactar soporte", support: "Nuestro equipo sigue disponible para cualquier información adicional a través de su espacio de cliente." },
  it: { subject: "Aggiornamento della pratica — AGM INVEST", title: "Buongiorno", body: "A seguito dell'esame della tua richiesta, ti informiamo che al momento non siamo in grado di rispondere favorevolmente. La tua pratica è stata aggiornata con le informazioni corrispondenti.", cta: "Contatta il supporto", support: "Il nostro team rimane a disposizione per qualsiasi ulteriore informazione tramite il tuo spazio cliente." },
  de: { subject: "Konto-Aktualisierung — AGM INVEST", title: "Hallo", body: "Nach Prüfung Ihres Antrags müssen wir Ihnen mitteilen, dass wir diesem derzeit nicht stattgeben können. Ihre Akte wurde mit den entsprechenden Informationen aktualisiert.", cta: "Support kontaktieren", support: "Unser Team steht Ihnen für weitere Informationen über Ihren Kundenbereich zur Verfügung." },
  nl: { subject: "Dossier bijwerking — AGM INVEST", title: "Hallo", body: "Na bestudering van uw aanvraag informeren wij u dat wij er op dit moment niet gunstig op kunnen reageren. Uw dossier is bijgewerkt met de bijbehorende informatie.", cta: "Contact opnemen", support: "Ons team blijft beschikbaar voor verdere informatie via uw klantengedeelte." },
  pl: { subject: "Aktualizacja wniosku — AGM INVEST", title: "Witaj", body: "Po zapoznaniu się z Twoim wnioskiem informujemy, że w tej chwili nie możemy wydać decyzji pozytywnej. Twój wniosek został zaktualizowany o stosowne informacje.", cta: "Skontaktuj się z pomocą", support: "Nasz zespół pozostaje do Twojej dyspozycji w celu uzyskania dalszych informacji za pośrednictwem obszaru klienta." },
  pt: { subject: "Atualização de processo — AGM INVEST", title: "Olá", body: "Após a análise do seu pedido, informamos que não nos é possível responder favoravelmente neste momento. O seu processo foi atualizado com as informações correspondentes.", cta: "Contactar suporte", support: "A nossa equipa permanece disponível para qualquer informação adicional através do seu espaço de cliente." },
  ro: { subject: "Actualizare dosar — AGM INVEST", title: "Bună ziua", body: "În urma analizării cererii dumneavoastră, vă informăm că nu putem răspunde favorabil în acest moment. Dosarul dumneavoastră a fost actualizat cu informațiile corespunzătoare.", cta: "Contactați suportul", support: "Echipa noastră rămâne la dispoziție pentru orice informații suplimentare prin intermediul spațiului dumneavoastră de client." },
  sv: { subject: "Kontouppdatering — AGM INVEST", title: "Hej", body: "Efter granskning av din ansökan informerar vi dig om att vi inte kan svara positivt för tillfället. Din fil har uppdaterats med motsvarande information.", cta: "Kontakta support", support: "Vårt team finns tillgängligt för ytterligare information via ditt kundutrymme." },
};

export function loanRejectedTemplate(data: LoanRejectedData, lang: string = 'fr'): { subject: string; html: string } {
  const t = translations[lang] || translations['fr'];
  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}, ${data.firstName}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;">${t.body}</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:14px;color:#64748B;margin:0;">${t.support}</p>
    </div>
    ${btn(t.cta, `${APP_URL}/dashboard/support`)}
  `;
  return { subject: t.subject, html: emailLayout(content, lang) };
}
