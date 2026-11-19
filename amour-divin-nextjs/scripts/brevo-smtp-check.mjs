import nodemailer from "nodemailer";

const required = [
  "BREVO_SMTP_HOST",
  "BREVO_SMTP_PORT",
  "BREVO_SMTP_USER",
  "BREVO_SMTP_PASSWORD",
  "BREVO_SMTP_FROM",
];

for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} n’est pas configurée.`);
}

const recipient = process.env.TEST_EMAIL || process.env.SUPER_ADMIN_EMAIL;
if (!recipient) throw new Error("TEST_EMAIL ou SUPER_ADMIN_EMAIL doit être configuré.");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
});

await transporter.verify();
const info = await transporter.sendMail({
  from: process.env.BREVO_SMTP_FROM,
  to: recipient,
  subject: "Test SMTP Brevo - Amour Divin",
  text: "Ce message confirme que l’envoi SMTP Brevo fonctionne pour Amour Divin.",
  html: "<p>Ce message confirme que l’envoi SMTP Brevo fonctionne pour <strong>Amour Divin</strong>.</p>",
});

console.log(JSON.stringify({ accepted: info.accepted, rejected: info.rejected, messageId: info.messageId }));