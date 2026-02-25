import { emailLayout } from '../layout';


export interface VerifyEmailData {
    firstName: string;
    otpCode: string;
}

export const verifyEmailTemplate = (data: VerifyEmailData, lang: string = 'fr') => {
    const translations: any = {
        fr: {
            subject: 'Votre code de verification - AGM INVEST',
            title: 'V&#233;rifiez votre email (v5)',
            greeting: `Bonjour ${data.firstName},`,
            instruction: "Merci de vous &#234;tre inscrit sur AGM INVEST. Pour finaliser la cr&#233;ation de votre compte, veuillez utiliser le code de v&#233;rification &#224; 6 chiffres ci-dessous :",
            expire: "Ce code expirera dans 15 minutes.",
            security: "Si vous n'&#234;tes pas &#224; l'origine de cette demande, vous pouvez ignorer cet email.",
            footer: "L'&#233;quipe AGM INVEST"
        },
        en: {
            subject: 'Your verification code - AGM INVEST',
            title: 'Verify your email',
            greeting: `Hello ${data.firstName},`,
            instruction: "Thank you for joining AGM INVEST. To complete your account registration, please use the 6-digit verification code below:",
            expire: "This code will expire in 15 minutes.",
            security: "If you did not request this code, you can safely ignore this email.",
            footer: "The AGM INVEST Team"
        },
        es: {
            subject: 'Tu código de verificación - AGM INVEST',
            title: 'Verifica tu email',
            greeting: `Hola ${data.firstName},`,
            instruction: "Gracias por unirte a AGM INVEST. Para completar el registro de tu cuenta, utiliza le código de verificación de 6 dígitos a continuación:",
            expire: "Este código caducará en 15 minutos.",
            security: "Si no solicitaste este código, puedes ignorar este mensaje.",
            footer: "El equipo de AGM INVEST"
        },
        it: {
            subject: 'Il tuo codice di verifica - AGM INVEST',
            title: 'Verifica la tua email',
            greeting: `Ciao ${data.firstName},`,
            instruction: "Grazie per esserti iscritto ad AGM INVEST. Per completare la registrazione del tuo account, utilizza il codice di verifica a 6 cifre riportato di seguito:",
            expire: "Questo codice scadrà tra 15 minuti.",
            security: "Se non hai richiesto questo codice, puoi ignorare questo messaggio.",
            footer: "Il team di AGM INVEST"
        },
        de: {
            subject: 'Ihr Bestätigungscode - AGM INVEST',
            title: 'Bestätigen Sie Ihre E-Mail',
            greeting: `Hallo ${data.firstName},`,
            instruction: "Vielen Dank, dass Sie sich bei AGM INVEST angemeldet haben. Um Ihre Registrierung abzuschließen, verwenden Sie bitte den unten stehenden 6-stelligen Bestätigungscode:",
            expire: "Dieser Code läuft in 15 Minuten ab.",
            security: "Wenn Sie diesen Code nicht angefordert haben, können Sie diese E-Mail ignorieren.",
            footer: "Ihr AGM INVEST Team"
        },
        nl: {
            subject: 'Uw verificatiecode - AGM INVEST',
            title: 'Verifieer uw e-mail',
            greeting: `Hallo ${data.firstName},`,
            instruction: "Bedankt voor uw aanmelding bij AGM INVEST. Om uw registratie te voltooien, gebruikt u de onderstaande 6-cijferige verificatiecode:",
            expire: "Deze code verloopt over 15 minuten.",
            security: "Als u deze code niet heeft aangevraagd, kunt u deze e-mail negeren.",
            footer: "Het AGM INVEST-team"
        },
        pl: {
            subject: 'Twój kod weryfikacyjny - AGM INVEST',
            title: 'Zweryfikuj swój e-mail',
            greeting: `Witaj ${data.firstName},`,
            instruction: "Dziękujemy za dołączenie do AGM INVEST. Aby dokończyć rejestrację konta, użyj poniższego 6-cyfrowego kodu weryfikacyjnego:",
            expire: "Ten kod wygaśnie za 15 minut.",
            security: "Jeśli nie prosiłeś o ten kod, możesz zignorować tę wiadomość.",
            footer: "Zespół AGM INVEST"
        },
        pt: {
            subject: 'Seu código de verificação - AGM INVEST',
            title: 'Verifique seu e-mail',
            greeting: `Olá ${data.firstName},`,
            instruction: "Obrigado por se juntar à AGM INVEST. Para completar o registo da sua conta, utilize o código de verificação de 6 dígitos abaixo:",
            expire: "Este código expira em 15 minutos.",
            security: "Se não solicitou este código, pode ignorar esta mensagem.",
            footer: "A equipa AGM INVEST"
        },
        ro: {
            subject: 'Codul tău de verificare - AGM INVEST',
            title: 'Verifică-ți adresa de email',
            greeting: `Bună ziua ${data.firstName},`,
            instruction: "Vă mulțumim că v-ați alăturat AGM INVEST. Pentru a finaliza înregistrarea contului, vă rugăm să utilizați codul de verificare din 6 cifre de mai jos:",
            expire: "Acest cod va expira în 15 minute.",
            security: "Dacă nu ați solicitat acest cod, puteți ignora acest mesaj.",
            footer: "Echipa AGM INVEST"
        },
        sv: {
            subject: 'Din verifieringskod - AGM INVEST',
            title: 'Verifiera din e-post',
            greeting: `Hej ${data.firstName},`,
            instruction: "Tack för att du har gått med i AGM INVEST. För att slutföra din kontoregistrering, använd den 6-siffriga verifieringskoden nedan:",
            expire: "Denna kod upphör att gälla om 15 minuter.",
            security: "Om du inte har begärt denna kod kan du bortse från detta e-postmeddelande.",
            footer: "AGM INVEST-teamet"
        }
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <div style="text-align: center; padding: 20px 0;">
      <p style="color: #0F172A; font-size: 26px; font-weight: 900; margin-bottom: 20px; font-family: sans-serif;">${t.title}</p>
      <p style="color: #64748B; font-size: 16px; line-height: 24px;">${t.greeting}</p>
      <p style="color: #64748B; font-size: 16px; line-height: 24px;">${t.instruction}</p>
      
      <div style="background-color: #F8FAFC; border: 2px dashed #E2E8F0; border-radius: 12px; padding: 24px; margin: 30px 0;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: bold; letter-spacing: 10px; color: #2563EB;">
          ${data.otpCode}
        </span>
      </div>
      
      <p style="color: #94A3B8; font-size: 14px;"><em>${t.expire}</em></p>
      <p style="color: #64748B; font-size: 15px; margin-top: 30px;">${t.security}</p>
      <p style="color: #0F172A; font-size: 16px; font-weight: bold; margin-top: 20px;">${t.footer}</p>
    </div>
  `;

    return {
        subject: t.subject,
        html: emailLayout(content, lang)

    };
};
