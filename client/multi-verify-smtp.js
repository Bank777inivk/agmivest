const nodemailer = require('nodemailer');

const hosts = [
    "cp5.obambu.com",
    "cp1.obambu.com",
    "cp2.obambu.com",
    "cp3.obambu.com",
    "cp4.obambu.com",
    "cp6.obambu.com",
    "mail.agm-negoce.com",
    "agm-negoce.com"
];

const config = {
    port: 465,
    secure: true,
    auth: {
        user: "contact@agm-negoce.com",
        pass: "BjSuccess2026@",
    },
    tls: {
        rejectUnauthorized: false,
    },
    timeout: 5000
};

async function test() {
    for (const host of hosts) {
        console.log(`--- Test de l'hôte : ${host} ---`);
        const transporter = nodemailer.createTransport({ ...config, host });

        try {
            await transporter.verify();
            console.log(`✅ SUCCÈS sur : ${host}`);
            process.exit(0);
        } catch (error) {
            console.log(`❌ ÉCHEC sur : ${host} (${error.message})`);
        }
    }
    console.log("--- Aucun hôte n'a fonctionné ---");
}

test();
