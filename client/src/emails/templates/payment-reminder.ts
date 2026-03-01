import { emailLayout, btn, APP_URL } from '../layout';

interface PaymentReminderData {
    firstName: string;
    amount?: string;
}

export function paymentReminderTemplate(data: PaymentReminderData, lang: string = 'fr'): { subject: string; html: string } {
    const amount = data.amount || '286.00 €';
    const translations: Record<string, { subject: string; title: string; body: string; cta: string }> = {
        fr: {
            subject: "⚠️ Action requise : Effectuez votre dépôt pour finaliser votre prêt",
            title: "Votre dépôt est en attente",
            body: `Bonjour ${data.firstName},\n\nVotre vérification d'identité a bien été reçue. Il ne vous reste plus qu'une étape pour débloquer votre crédit.\n\n🔴 Votre dépôt de garantie de ${amount} est toujours en attente de réception.\n\nCette étape est obligatoire pour que notre équipe puisse finaliser et virer votre crédit sur votre compte.\n\nNe tardez pas — tout retard prolonge le délai de déblocage de vos fonds.\n\nVotre conseiller reste disponible pour toute question.`,
            cta: "Voir les instructions de virement"
        },
        en: {
            subject: "⚠️ Action required: Complete your deposit to finalize your loan",
            title: "Your deposit is pending",
            body: `Hello ${data.firstName},\n\nYour identity verification has been received. You only have one step left to unlock your credit.\n\n🔴 Your security deposit of ${amount} is still pending reception.\n\nThis step is mandatory for our team to finalize and transfer your credit to your account.\n\nDon't delay — any delay extends the time to unlock your funds.\n\nYour advisor remains available for any questions.`,
            cta: "View transfer instructions"
        },
        es: {
            subject: "⚠️ Acción requerida: Realice su depósito para finalizar su préstamo",
            title: "Su depósito está pendiente",
            body: `Hola ${data.firstName},\n\nSu verificación de identidad ha sido recibida. Solo le queda un paso para desbloquear su crédito.\n\n🔴 Su depósito de garantía de ${amount} sigue pendiente de recepción.\n\nEste paso es obligatorio para que nuestro equipo pueda finalizar y transferir su crédito a su cuenta.\n\nNo demore — cualquier retraso prolonga el tiempo de desbloqueo de sus fondos.\n\nSu asesor sigue disponible para cualquier pregunta.`,
            cta: "Ver instrucciones de transferencia"
        },
        it: {
            subject: "⚠️ Azione richiesta: Effettua il tuo deposito per finalizzare il tuo prestito",
            title: "Il tuo deposito è in attesa",
            body: `Buongiorno ${data.firstName},\n\nLa tua verifica d'identità è stata ricevuta. Ti manca solo un passaggio per sbloccare il tuo credito.\n\n🔴 Il tuo deposito cauzionale di ${amount} è ancora in attesa di ricezione.\n\nQuesto passaggio è obbligatorio affinché il nostro team possa finalizzare e trasferire il tuo credito sul tuo conto.\n\nNon tardare — qualsiasi ritardo prolunga i tempi di sblocco dei fondi.\n\nIl tuo consulente rimane disponibile per qualsiasi domanda.`,
            cta: "Visualizza le istruzioni di bonifico"
        },
        de: {
            subject: "⚠️ Aktion erforderlich: Leisten Sie Ihre Einzahlung, um Ihr Darlehen abzuschließen",
            title: "Ihre Einzahlung steht aus",
            body: `Hallo ${data.firstName},\n\nIhre Identitätsprüfung wurde erhalten. Es fehlt Ihnen nur noch ein Schritt, um Ihren Kredit freizuschalten.\n\n🔴 Ihre Sicherheitskaution von ${amount} ist noch ausstehend.\n\nDieser Schritt ist obligatorisch, damit unser Team Ihren Kredit abschließen und auf Ihr Konto überweisen kann.\n\nVerzögern Sie nicht — jede Verzögerung verlängert die Zeit bis zur Freischaltung Ihrer Gelder.\n\nIhr Berater steht für Fragen zur Verfügung.`,
            cta: "Überweisungsanweisungen anzeigen"
        },
        nl: {
            subject: "⚠️ Actie vereist: Voltooi uw storting om uw lening af te ronden",
            title: "Uw storting is in behandeling",
            body: `Hallo ${data.firstName},\n\nUw identiteitsverificatie is ontvangen. U heeft nog maar één stap te gaan om uw krediet te ontgrendelen.\n\n🔴 Uw borgsom van ${amount} wacht nog op ontvangst.\n\nDeze stap is verplicht zodat ons team uw krediet kan afronden en naar uw account kan overboeken.\n\nStel niet uit — elke vertraging verlengt de tijd om uw geld te ontgrendelen.\n\nUw adviseur blijft beschikbaar voor vragen.`,
            cta: "Overmaak instructies bekijken"
        },
        pl: {
            subject: "⚠️ Wymagane działanie: Dokonaj depozytu, aby sfinalizować swoją pożyczkę",
            title: "Twój depozyt oczekuje",
            body: `Witaj ${data.firstName},\n\nTwoja weryfikacja tożsamości została odebrana. Pozostał Ci tylko jeden krok do odblokowania kredytu.\n\n🔴 Twój depozyt zabezpieczający wynoszący ${amount} nadal oczekuje na odbiór.\n\nTen krok jest obowiązkowy, aby nasz zespół mógł sfinalizować i przelać Twój kredyt na Twoje konto.\n\nNie zwlekaj — każde opóźnienie wydłuża czas odblokowania Twoich środków.\n\nTwój doradca pozostaje do dyspozycji w razie pytań.`,
            cta: "Zobacz instrukcje przelewu"
        },
        pt: {
            subject: "⚠️ Ação necessária: Efetue o seu depósito para finalizar o seu empréstimo",
            title: "O seu depósito está pendente",
            body: `Olá ${data.firstName},\n\nA sua verificação de identidade foi recebida. Falta-lhe apenas um passo para desbloquear o seu crédito.\n\n🔴 O seu depósito de garantia de ${amount} ainda está pendente de receção.\n\nEste passo é obrigatório para que a nossa equipa possa finalizar e transferir o seu crédito para a sua conta.\n\nNão demore — qualquer atraso prolonga o tempo de desbloqueio dos seus fundos.\n\nO seu consultor está disponível para qualquer questão.`,
            cta: "Ver instruções de transferência"
        },
        ro: {
            subject: "⚠️ Acțiune necesară: Efectuați depozitul pentru a finaliza împrumutul",
            title: "Depozitul dvs. este în așteptare",
            body: `Bună ziua ${data.firstName},\n\nVerificarea dvs. de identitate a fost primită. Vă mai rămâne un singur pas pentru a vă debloca creditul.\n\n🔴 Depozitul dvs. de garanție de ${amount} este încă în așteptare.\n\nAcest pas este obligatoriu pentru ca echipa noastră să poată finaliza și vira creditul în contul dvs.\n\nNu întârziați — orice întârziere prelungește timpul de deblocare a fondurilor.\n\nConsilierul dvs. rămâne disponibil pentru orice întrebare.`,
            cta: "Vedeți instrucțiunile de transfer"
        },
        sv: {
            subject: "⚠️ Åtgärd krävs: Genomför din insättning för att slutföra ditt lån",
            title: "Din insättning väntar",
            body: `Hej ${data.firstName},\n\nDin identitetsverifiering har mottagits. Du har bara ett steg kvar för att låsa upp ditt kredit.\n\n🔴 Din säkerhetsdeposition på ${amount} väntar fortfarande på mottagning.\n\nDetta steg är obligatoriskt för att vårt team ska kunna slutföra och överföra ditt kredit till ditt konto.\n\nFördröj inte — varje försening förlänger tiden för att låsa upp dina medel.\n\nDin rådgivare finns tillgänglig för eventuella frågor.`,
            cta: "Se överföringsinstruktioner"
        }
    };

    const t = translations[lang] || translations['fr'];
    const content = `
        <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.title}</h1>
        <p style="font-size:15px;color:#64748B;margin:0 0 24px;line-height:1.7;white-space:pre-line;">${t.body}</p>
        ${btn(t.cta, `${APP_URL}/dashboard/billing`)}
    `;
    return { subject: t.subject, html: emailLayout(content, lang) };
}
