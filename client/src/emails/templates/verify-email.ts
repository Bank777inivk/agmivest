import { emailLayout } from '../layout';

export interface VerifyEmailData {
    firstName: string;
    otpCode: string;
}

export const verifyEmailTemplate = (data: VerifyEmailData, lang: string = 'fr') => {
    const translations: any = {
        fr: {
            subject: 'Validation de votre compte — AGM INVEST',
            greeting: `Validation de votre compte`,
            instruction: "Bonjour " + data.firstName + ",\n\nVoici votre code de validation a usage unique pour acceder a votre espace securise :",
            expire: "Ce code est valide pendant 15 minutes.",
            security: "Pour des raisons de securite, ne partagez jamais ce code.",
            footer: "AGM INVEST"
        },
        en: {
            subject: 'Account validation — AGM INVEST',
            greeting: `Account validation`,
            instruction: "Hello " + data.firstName + ",\n\nHere is your one-time validation code to access your secure space:",
            expire: "This code is valid for 15 minutes.",
            security: "For security reasons, never share this code.",
            footer: "AGM INVEST"
        },
        es: {
            subject: 'Validacion de su cuenta — AGM INVEST',
            greeting: `Validacion de su cuenta`,
            instruction: "Hola " + data.firstName + ",\n\nAqui tiene su codigo de validacion de un solo uso para acceder a su espacio seguro:",
            expire: "Este codigo es valido por 15 minutos.",
            security: "Por razones de seguridad, nunca comparta este codigo.",
            footer: "AGM INVEST"
        },
        it: {
            subject: 'Validazione del tuo account — AGM INVEST',
            greeting: `Validazione del tuo account`,
            instruction: "Ciao " + data.firstName + ",\n\nEcco il tuo codice di validazione monouso per accedere al tuo spazio sicuro:",
            expire: "Questo codice è valido per 15 minuti.",
            security: "Per ragioni di sicurezza, non condividere mai questo codice.",
            footer: "AGM INVEST"
        },
        de: {
            subject: 'Kontovalidierung — AGM INVEST',
            greeting: `Kontovalidierung`,
            instruction: "Hallo " + data.firstName + ",\n\nHier ist Ihr einmaliger Validierungscode für den Zugriff auf Ihren sicheren Bereich:",
            expire: "Dieser Code ist 15 Minuten lang gültig.",
            security: "Teilen Sie diesen Code aus Sicherheitsgründen niemals mit anderen.",
            footer: "AGM INVEST"
        },
        nl: {
            subject: 'Accountvalidatie — AGM INVEST',
            greeting: `Accountvalidatie`,
            instruction: "Hallo " + data.firstName + ",\n\nHier is uw eenmalige validatiecode om toegang te krijgen tot uw beveiligde ruimte:",
            expire: "Deze code is 15 minuten geldig.",
            security: "Deel deze code om veiligheidsredenen nooit.",
            footer: "AGM INVEST"
        },
        pl: {
            subject: 'Walidacja konta — AGM INVEST',
            greeting: `Walidacja konta`,
            instruction: "Witaj " + data.firstName + ",\n\nOto Twoj jednorazowy kod walidacyjny umozliwiajacy dostep do bezpiecznego obszaru:",
            expire: "Ten kod jest wazny przez 15 minut.",
            security: "Ze wzgledow bezpieczenstwa nigdy nie udostepniaj tego kodu.",
            footer: "AGM INVEST"
        },
        pt: {
            subject: 'Validacao da sua conta — AGM INVEST',
            greeting: `Validacao da sua conta`,
            instruction: "Ola " + data.firstName + ",\n\nAqui esta o seu codigo de validacao de utilizacao unica para aceder ao seu espaco seguro:",
            expire: "Este codigo e valido por 15 minutos.",
            security: "Por razoes de seguranca, nunca partilhe este codigo.",
            footer: "AGM INVEST"
        },
        ro: {
            subject: 'Validarea contului — AGM INVEST',
            greeting: `Validarea contului`,
            instruction: "Buna ziua " + data.firstName + ",\n\nIata codul dumneavoastra de validare de unica folosinta pentru a accesa spatiul dumneavoastra securizat:",
            expire: "Acest cod este valabil timp de 15 minute.",
            security: "Din motive de securitate, nu partajati niciodata acest cod.",
            footer: "AGM INVEST"
        },
        sv: {
            subject: 'Kontovalidering — AGM INVEST',
            greeting: `Kontovalidering`,
            instruction: "Hej " + data.firstName + ",\n\nHar ar din engangskod for att fa tillgang till ditt sakra utrymme:",
            expire: "Denna kod ar giltig i 15 minuter.",
            security: "Av sakerhetsskal ska du aldrig dela denna kod.",
            footer: "AGM INVEST"
        }
    };

    const t = translations[lang] || translations['fr'];

    const content = `
    <div style="text-align: center; padding: 20px 0;">
      <h1 style="font-size:22px;font-weight:900;color:#1E3A5F;margin:0 0 16px;">${t.greeting}</h1>
      <p style="color: #64748B; font-size: 15px; line-height: 24px; white-space: pre-line;">${t.instruction}</p>
      
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
