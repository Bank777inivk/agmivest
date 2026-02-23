const nodemailer = require('nodemailer');

const config = {
    host: "agm-negoce.com",
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

async function test() {
    console.log("Tentative de connexion SMTP avec :", config.auth.user);
    const transporter = nodemailer.createTransport(config);

    try {
        await transporter.verify();
        console.log("✅ Connexion SMTP réussie !");
    } catch (error) {
        console.error("❌ Échec de la connexion SMTP :");
        console.error(error);
    }
}

test();
