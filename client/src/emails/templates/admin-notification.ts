import { emailLayout } from '../layout';

interface AdminNotificationData {
  event: string;
  userName: string;
  userEmail: string;
  details?: string;
  amount?: string;
  fullData?: Record<string, any>;
}

export function adminNotificationTemplate(data: AdminNotificationData): { subject: string; html: string } {
  const subject = `NOUVELLE ALERTE : ${data.event} - ${data.userName}`;
  
  const content = `
    <div style="background:#F8FAFC; border: 1px solid #E2E8F0; border-radius:12px; padding:32px; max-width:600px; margin:0 auto; font-family:sans-serif;">
      
      <div style="text-align:center; margin-bottom:24px;">
        <span style="display:inline-block; background:#1E3A5F; color:white; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; padding:6px 16px; border-radius:20px;">
          Notification Système
        </span>
      </div>

      <h1 style="font-size:24px; font-weight:900; color:#1E3A5F; margin:0 0 24px; text-align:center;">
        ${data.event}
      </h1>
      
      <div style="background:white; border-radius:8px; padding:24px; margin-bottom:24px; border: 1px solid #E2E8F0;">
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#64748B; font-size:14px; width:40%;">Client:</td>
            <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#0F172A; font-size:15px; font-weight:600;">${data.userName}</td>
          </tr>
          <tr>
            <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#64748B; font-size:14px;">Email:</td>
            <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#0F172A; font-size:15px; font-weight:600;">
              <a href="mailto:${data.userEmail}" style="color:#0EA5E9; text-decoration:none;">${data.userEmail}</a>
            </td>
          </tr>
          ${data.amount ? `
          <tr>
            <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#64748B; font-size:14px;">Montant:</td>
            <td style="padding:12px 0; border-bottom:1px solid #F1F5F9; color:#0F172A; font-size:15px; font-weight:600; color:#10B981;">${data.amount}</td>
          </tr>
          ` : ''}
          ${data.details ? `
          <tr>
            <td style="padding:12px 0; color:#64748B; font-size:14px;">Détails:</td>
            <td style="padding:12px 0; color:#0F172A; font-size:15px; font-weight:500;">${data.details}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${data.fullData ? `
      <div style="background:white; border-radius:8px; padding:24px; margin-bottom:24px; border: 1px solid #E2E8F0;">
        <h2 style="font-size:16px; font-weight:700; color:#1E3A5F; margin:0 0 16px;">Données Complètes Déclarées</h2>
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          ${Object.entries(data.fullData).map(([key, value]) => `
            <tr>
              <td style="padding:10px 0; border-bottom:1px solid #F1F5F9; color:#64748B; font-weight:600; text-transform:capitalize;">${key}:</td>
              <td style="padding:10px 0; border-bottom:1px solid #F1F5F9; color:#0F172A; text-align:right;">${value || '-'}</td>
            </tr>
          `).join('')}
        </table>
      </div>
      ` : ''}

      <p style="font-size:14px; color:#64748B; margin:0; text-align:center;">
        Veuillez vous connecter au tableau de bord administrateur pour gérer cette requête.
      </p>
      
      <div style="text-align:center; margin-top:32px;">
        <a href="https://agm-negoce.com/fr/dashboard/admin" style="display:inline-block; background:#14B8A6; color:white; text-decoration:none; font-weight:bold; padding:14px 28px; border-radius:8px; font-size:15px;">
          Accéder au tableau de bord
        </a>
      </div>

    </div>
  `;
  
  // We use "fr" layout as admin is presumably French
  return { subject, html: emailLayout(content, 'fr') };
}
