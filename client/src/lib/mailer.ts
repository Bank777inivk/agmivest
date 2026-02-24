import nodemailer from 'nodemailer';

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    // Create transporter per-call to ensure env vars are read at runtime (not build time)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    console.log(`[Mailer] Sending to ${to} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'AGM INVEST <contact@agm-negoce.com>',
        to,
        subject,
        html,
        textEncoding: 'base64', // Fix for special characters encoding
    });

    console.log(`[Mailer] Response: ${info.response} | MessageId: ${info.messageId}`);
}
