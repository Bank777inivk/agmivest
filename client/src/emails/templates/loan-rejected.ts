import { emailLayout, btn, APP_URL } from '../layout';

interface LoanRejectedData {
  firstName: string;
}

export function loanRejectedTemplate(data: LoanRejectedData, lang: string = 'fr'): { subject: string; html: string } {
  const translations: Record<string, { subject: string; title: string; body: string; cta: string; support: string }> = {
    fr: {
      subject: "Information concernant votre dossier",
      title: "Information concernant votre dossier",
      body: "Bonjour " + data.firstName + ",\n\nSuite a l'etude de votre demande, nous vous informons que nous ne sommes pas en mesure d'y repondre favorablement pour le moment.\n\nVotre dossier a ete mis a jour avec les informations correspondantes.",
      cta: "Contacter le support",
      support: "Notre equipe reste disponible pour tout complement d'information via votre espace client."
    },
    en: {
      subject: "Information regarding your file",
      title: "Information regarding your file",
      body: "Hello " + data.firstName + ",\n\nFollowing the review of your request, we inform you that we are unable to respond favorably at this time.\n\nYour file has been updated with the corresponding information.",
      cta: "Contact support",
      support: "Our team remains available for any further information through your client space."
    },
    es: {
      subject: "Informacion sobre su expediente",
      title: "Informacion sobre su expediente",
      body: "Hola " + data.firstName + ",\n\nTras el estudio de su solicitud, le informamos que no podemos responder favorablemente por el momento.\n\nSu expediente ha sido actualizado con la informacion correspondiente.",
      cta: "Contactar soporte",
      support: "Nuestro equipo sigue disponible para cualquier informacion adicional a traves de su espacio de cliente."
    },
    it: {
      subject: "Informazioni sulla tua pratica",
      title: "Informazioni sulla tua pratica",
      body: "Buongiorno " + data.firstName + ",\n\nA seguito dell'esame della tua richiesta, ti informiamo che al momento non siamo in grado di rispondere favorevolmente.\n\nLa tua pratica è stata aggiornata con le informazioni corrispondenti.",
      cta: "Contatta il supporto",
      support: "Il nostro team rimane a disposizione per qualsiasi ulteriore informazione tramite il tuo spazio cliente."
    },
    de: {
      subject: "Informationen zu Ihrer Akte",
      title: "Informationen zu Ihrer Akte",
      body: "Hallo " + data.firstName + ",\n\nNach Prufung Ihres Antrags mussen wir Ihnen mitteilen, dass wir diesem derzeit nicht stattgeben konnen.\n\nIhre Akte wurde mit den entsprechenden Informationen aktualisiert.",
      cta: "Support kontaktieren",
      support: "Unser Team steht Ihnen fur weitere Informationen uber Ihren Kundenbereich zur Verfugung."
    },
    nl: {
      subject: "Informatie over uw dossier",
      title: "Informatie over uw dossier",
      body: "Hallo " + data.firstName + ",\n\nNa bestudering van uw aanvraag informeren wij u dat wij er op dit moment niet gunstig op kunnen reageren.\n\nUw dossier is bijgewerkt met de bijbehorende informatie.",
      cta: "Contact opnemen",
      support: "Ons team blijft beschikbaar voor verdere informatie via uw klantengedeelte."
    },
    pl: {
      subject: "Informacje o Twoim wniosku",
      title: "Informacje o Twoim wniosku",
      body: "Witaj " + data.firstName + ",\n\nPo zapoznaniu sie z Twoim wnioskiem informujemy, ze w tej chwili nie mozemy wydac decyzji pozytywnej.\n\nTwoj wniosek zostal zaktualizowany o stosowne informacje.",
      cta: "Skontaktuj sie z pomoca",
      support: "Nasz zespol pozostaje do Twojej dyspozycji w celu uzyskania dalszych informacji za posrednictwem obszaru klienta."
    },
    pt: {
      subject: "Informacao sobre o seu processo",
      title: "Informacao sobre o seu processo",
      body: "Ola " + data.firstName + ",\n\nApos a analise do seu pedido, informamos que nao nos e possivel responder favoravelmente neste momento.\n\nO seu processo foi atualizado com as informacoes correspondentes.",
      cta: "Contactar suporte",
      support: "A nossa equipa permanece disponivel para qualquer informacao adicional atraves do seu espaco de cliente."
    },
    ro: {
      subject: "Informatii despre dosarul dumneavoastra",
      title: "Informatii despre dosarul dumneavoastra",
      body: "Buna ziua " + data.firstName + ",\n\nIn urma analizarii cererii dumneavoastra, va informam ca nu putem raspunde favorabil in acest moment.\n\nDosarul dumneavoastra a fost actualizat cu informatiile corespunzatoare.",
      cta: "Contactati suportul",
      support: "Echipa noastra ramane la dispozitie pentru orice informatii suplimentare prin intermediul spatiului dumneavoastra de client."
    },
    sv: {
      subject: "Information om din fil",
      title: "Information om din fil",
      body: "Hej " + data.firstName + ",\n\nEfter granskning av din ansokan informerar vi dig om att vi inte kan svara positivt for tillfallet.\n\nDin fil har uppdaterats med motsvarande information.",
      cta: "Kontakta support",
      support: "Vart team finns tillgangligt for ytterligare information via ditt kundutrymme."
    },
  };

  const t = translations[lang] || translations['fr'];

  const content = `
    <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
    <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
      <p style="font-size:14px;color:#64748B;margin:0;">${t.support}</p>
    </div>
    ${btn(t.cta, `${APP_URL}/dashboard/support`)}
  `;

  return { subject: t.subject, html: emailLayout(content, lang) };
}
