// Script de test pour mail-tester.com
// USAGE: node test-mailtester.js test-XXXXX@srv1.mail-tester.com

const nodemailer = require('nodemailer');

const TO_ADDRESS = process.argv[2]; // Passez l'adresse mail-tester en argument

if (!TO_ADDRESS || !TO_ADDRESS.includes('mail-tester.com')) {
    console.log('❌ Usage: node test-mailtester.js test-XXXXX@srv1.mail-tester.com');
    console.log('   (Copiez l\'adresse depuis mail-tester.com)');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: 'cp2.obambu.com',
    port: 465,
    secure: true,
    auth: {
        user: 'contact@agm-negoce.com',
        pass: 'BjSuccess2026@',
    },
    tls: { rejectUnauthorized: false }
});

async function sendTest() {
    console.log(`📧 Envoi du test vers: ${TO_ADDRESS}`);
    try {
        const info = await transporter.sendMail({
            from: 'AGM INVEST <contact@agm-negoce.com>',
            to: TO_ADDRESS,
            subject: 'Test de délivrabilité AGM INVEST',
            html: `
                <html>
                <body>
                    <h1>Test d'envoi - AGM INVEST</h1>
                    <p>Ceci est un email de test pour vérifier la délivrabilité depuis <strong>agm-negoce.com</strong>.</p>
                    <p>Envoyé via cp2.obambu.com</p>
                </body>
                </html>
            `,
            text: 'Test de délivrabilité AGM INVEST depuis agm-negoce.com via cp2.obambu.com'
        });
        console.log('✅ Email envoyé!');
        console.log('   Message ID:', info.messageId);
        console.log('   Réponse SMTP:', info.response);
        console.log('\n⏳ Attendez 10 secondes puis rafraîchissez mail-tester.com pour voir votre score.');
    } catch (err) {
        console.error('❌ Erreur:', err.message);
    }
}

sendTest();
