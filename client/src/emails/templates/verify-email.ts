import { emailLayout } from '../layout';

export interface VerifyEmailData {
    firstName: string;
    otpCode: string;
}

export const verifyEmailTemplate = (data: VerifyEmailData, lang: string = 'fr') => {
    const translations: any = {
        fr: {
            subject: 'Validation de votre acces — AGM INVEST',
            greeting: `Bonjour ${data.firstName},`,
            instruction: "Voici votre code de validation a usage unique pour acceder a votre espace securise :",
            expire: "Ce code est valide pendant 15 minutes.",
            security: "Pour des raisons de securite, ne partagez jamais ce code.",
            footer: "AGM INVEST"
        },
        en: {
            subject: 'Access validation — AGM INVEST',
            greeting: `Hello ${data.firstName},`,
            instruction: "Here is your one-time validation code to access your secure space:",
            expire: "This code is valid for 15 minutes.",
            security: "For security reasons, never share this code.",
            footer: "AGM INVEST"
        },
        es: {
            subject: 'Validación de acceso — AGM INVEST',
            greeting: `Hola ${data.firstName},`,
            instruction: "Aquí tiene su código de validación de un solo uso para acceder a su espacio seguro:",
            expire: "Este código es válido por 15 minutos.",
            security: "Por razones de seguridad, nunca comparta este código.",
            footer: "AGM INVEST"
        },
        it: {
            subject: 'Validazione accesso — AGM INVEST',
            greeting: `Ciao ${data.firstName},`,
            instruction: "Ecco il tuo codice di validazione monouso per accedere al tuo spazio sicuro:",
            expire: "Questo codice è valido per 15 minuti.",
            security: "Per ragioni di sicurezza, non condividere mai questo codice.",
            footer: "AGM INVEST"
        },
        de: {
            subject: 'Zugriffsvalidierung — AGM INVEST',
            greeting: `Hallo ${data.firstName},`,
            instruction: "Hier ist Ihr einmaliger Validierungscode für den Zugriff auf Ihren sicheren Bereich:",
            expire: "Dieser Code ist 15 Minuten lang gültig.",
            security: "Teilen Sie diesen Code aus Sicherheitsgründen niemals mit anderen.",
            footer: "AGM INVEST"
        },
        nl: {
            subject: 'Toegangsvalidatie — AGM INVEST',
            greeting: `Hallo ${data.firstName},`,
            instruction: "Hier is uw eenmalige validatiecode om toegang te krijgen tot uw beveiligde ruimte:",
            expire: "Deze code is 15 minuten geldig.",
            security: "Deel deze code om veiligheidsredenen nooit.",
            footer: "AGM INVEST"
        },
        pl: {
            subject: 'Walidacja dostępu — AGM INVEST',
            greeting: `Witaj ${data.firstName},`,
            instruction: "Oto Twój jednorazowy kod walidacyjny umożliwiający dostęp do bezpiecznego obszaru:",
            expire: "Ten kod jest ważny przez 15 minut.",
            security: "Ze względów bezpieczeństwa nigdy nie udostępniaj tego kodu.",
            footer: "AGM INVEST"
        },
        pt: {
            subject: 'Validação de acesso — AGM INVEST',
            greeting: `Olá ${data.firstName},`,
            instruction: "Aqui está o seu código de validação de utilização única para aceder ao seu espaço seguro:",
            expire: "Este código é válido por 15 minutos.",
            security: "Por razões de segurança, nunca partilhe este código.",
            footer: "AGM INVEST"
        },
        ro: {
            subject: 'Validarea accesului — AGM INVEST',
            greeting: `Bună ziua ${data.firstName},`,
            instruction: "Iată codul dumneavoastră de validare de unică folosință pentru a accesa spațiul dumneavoastră securizat:",
            expire: "Acest cod este valabil timp de 15 minute.",
            security: "Din motive de securitate, nu partajați niciodată acest cod.",
            footer: "AGM INVEST"
        },
        sv: {
            subject: 'Atkomstvalidering — AGM INVEST',
            greeting: `Hej ${data.firstName},`,
            instruction: "Här är din engångskod för att få tillgång till ditt säkra utrymme:",
            expire: "Denna kod är giltig i 15 minuter.",
            security: "Av säkerhetsskäl ska du aldrig dela denna kod.",
            footer: "AGM INVEST"
        }
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <div style="text-align: center; padding: 20px 0;">
      <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.greeting}</h1>
      <p style="color: #64748B; font-size: 15px; line-height: 24px;">${t.instruction}</p>
      
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px; margin: 30px 0;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #1E3A5F;">
          ${data.otpCode}
        </span>
      </div>
      
      <p style="color: #94A3B8; font-size: 13px;"><em>${t.expire}</em></p>
      <p style="color: #94A3B8; font-size: 13px; margin-top: 24px;">${t.security}</p>
      <p style="color: #1E3A5F; font-size: 14px; font-weight: bold; margin-top: 32px;">${t.footer}</p>
    </div>
  `;

    return { subject: t.subject, html: emailLayout(content, lang) };
};
