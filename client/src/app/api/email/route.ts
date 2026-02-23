import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { welcomeTemplate } from '@/emails/templates/welcome';
import { loanApprovedTemplate } from '@/emails/templates/loan-approved';
import { loanRejectedTemplate } from '@/emails/templates/loan-rejected';
import { loanSubmittedTemplate } from '@/emails/templates/loan-submitted';
import { kycRequiredTemplate } from '@/emails/templates/kyc-required';
import { kycApprovedTemplate, kycRejectedTemplate } from '@/emails/templates/kyc-status';
import { kycResetTemplate } from '@/emails/templates/kyc-reset';
import { transferApprovedTemplate, transferRejectedTemplate } from '@/emails/templates/transfer-status';
import { transferInitiatedTemplate } from '@/emails/templates/transfer-initiated';
import { paymentRequiredTemplate } from '@/emails/templates/payment-required';
import { paymentConfirmedTemplate } from '@/emails/templates/payment-confirmed';

// Simple API Key for basic security between client/admin and API
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || 'agm-invest-secure-email-key';

export async function POST(req: Request) {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { to, template, language, data, apiKey } = body;

        // Basic security check
        if (apiKey !== EMAIL_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, {
                status: 401,
                headers: corsHeaders
            });
        }

        if (!to || !template) {
            return NextResponse.json({ error: 'Missing required fields' }, {
                status: 400,
                headers: corsHeaders
            });
        }

        let emailContent: { subject: string; html: string } | null = null;
        const lang = language || 'fr';

        switch (template) {
            case 'welcome':
                emailContent = welcomeTemplate(data, lang);
                break;
            case 'loan-approved':
                emailContent = loanApprovedTemplate(data, lang);
                break;
            case 'loan-rejected':
                emailContent = loanRejectedTemplate(data, lang);
                break;
            case 'loan-submitted':
                emailContent = loanSubmittedTemplate(data, lang);
                break;
            case 'kyc-required':
                emailContent = kycRequiredTemplate(data, lang);
                break;
            case 'kyc-approved':
                emailContent = kycApprovedTemplate(data, lang);
                break;
            case 'kyc-rejected':
                emailContent = kycRejectedTemplate(data, lang);
                break;
            case 'kyc-reset':
                emailContent = kycResetTemplate(data, lang);
                break;
            case 'transfer-approved':
                emailContent = transferApprovedTemplate(data, lang);
                break;
            case 'transfer-rejected':
                emailContent = transferRejectedTemplate(data, lang);
                break;
            case 'transfer-initiated':
                emailContent = transferInitiatedTemplate(data, lang);
                break;
            case 'payment-required':
                emailContent = paymentRequiredTemplate(data, lang);
                break;
            case 'payment-confirmed':
                emailContent = paymentConfirmedTemplate(data, lang);
                break;
            default:
                return NextResponse.json({ error: 'Invalid template' }, {
                    status: 400,
                    headers: corsHeaders
                });
        }

        if (emailContent) {
            await sendEmail({
                to,
                subject: emailContent.subject,
                html: emailContent.html,
            });
            return NextResponse.json({ success: true }, { headers: corsHeaders });
        }

        return NextResponse.json({ error: 'Failed to generate email content' }, {
            status: 500,
            headers: corsHeaders
        });
    } catch (error: any) {
        console.error('Email API Error:', error);
        return NextResponse.json({ error: error.message }, {
            status: 500,
            headers: corsHeaders
        });
    }
}
