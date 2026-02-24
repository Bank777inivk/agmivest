const nodemailer = require('nodemailer');

const config = {
    host: "cp2.obambu.com",
    port: 465,
    secure: true,
    auth: {
        user: "contact@agm-negoce.com",
        pass: "BjSuccess2026@",
    },
    tls: {
        rejectUnauthorized: false,
    },
};

async function testSend() {
    const targetEmail = "delpaschloe4@gmail.com";
    console.log(`Tentative d'envoi d'un email de TEST vers : ${targetEmail}`);
    const transporter = nodemailer.createTransport(config);

    try {
        const info = await transporter.sendMail({
            from: '"AGM INVEST" <contact@agm-negoce.com>',
            to: targetEmail,
            subject: "✔ Test d'envoi direct depuis le serveur",
            text: "Ceci est un test pour vérifier la délivrabilité.",
            html: "<b>Ceci est un test pour vérifier la délivrabilité.</b>",
        });

        console.log("✅ Message envoyé !");
        console.log("Message ID:", info.messageId);
        console.log("Réponse du serveur:", info.response);
        console.log("Acceptés:", info.accepted);
        console.log("Rejetés:", info.rejected);
    } catch (error) {
        console.error("❌ Erreur d'envoi :");
        console.error(error);
    }
}

testSend();
