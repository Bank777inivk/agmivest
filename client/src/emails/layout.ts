export function emailLayout(content: string, lang: string = 'fr'): string {
  const footers: Record<string, string> = {
    fr: "Vous recevez cet email car vous &ecirc;tes inscrit sur AGM INVEST. Ne pas r&eacute;pondre &agrave; cet email.",
    en: "You are receiving this email because you are registered on AGM INVEST. Do not reply to this email.",
    es: "Recibe este correo porque está registrado en AGM INVEST. No responda a este correo.",
    it: "Stai ricevendo questa email perché sei registrato su AGM INVEST. Non rispondere a questa email.",
    de: "Sie erhalten diese E-Mail, weil Sie bei AGM INVEST registriert sind. Bitte nicht auf diese E-Mail antworten.",
    nl: "U ontvangt deze e-mail omdat u geregistreerd bent bij AGM INVEST. Reageer niet op deze e-mail.",
    pl: "Otrzymujesz tę wiadomość, ponieważ jesteś zarejestrowany w AGM INVEST. Nie odpowiadaj na tę wiadomość.",
    pt: "Você está recebendo este email porque está registrado no AGM INVEST. Não responda a este email.",
    ro: "Primiți acest email deoarece sunteți înregistrat pe AGM INVEST. Nu răspundeți la acest email.",
    sv: "Du får det här e-postmeddelandet eftersom du är registrerad på AGM INVEST. Svara inte på det här e-postmeddelandet.",
  };

  const footer = footers[lang] || footers['fr'];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AGM INVEST</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A5F 0%,#0EA5E9 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">AGM INVEST</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Financial Solutions</div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="font-size:11px;color:#94A3B8;margin:0 0 8px;">${footer}</p>
              <p style="font-size:11px;color:#CBD5E1;margin:0;">© ${new Date().getFullYear()} AGM INVEST — contact@agm-negoce.com</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function btn(text: string, url: string): string {
  return `<div style="text-align:center;margin:32px 0;">
    <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#1E3A5F,#0EA5E9);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:14px;letter-spacing:0.3px;">${text}</a>
  </div>`;
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.agm-negoce.com';
