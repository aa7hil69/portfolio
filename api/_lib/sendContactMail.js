import nodemailer from "nodemailer";
import { sendContactResend } from "../../lib/sendContactResend.js";
import { validateContactPayload } from "../../lib/validateContact.js";

export { validateContactPayload };

export async function sendContactMail(fields, env = process.env) {
  if (env.RESEND_API_KEY) {
    await sendContactResend(fields, env);
    return;
  }

  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const inbox = env.CONTACT_INBOX;

  if (!user || !pass || !inbox) {
    const err = new Error("Mail configuration missing");
    err.status = 500;
    throw err;
  }

  const port = Number(env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465 || String(env.SMTP_SECURE ?? "true") !== "false",
    auth: { user, pass: String(pass).replace(/\s+/g, "") },
  });

  await transporter.sendMail({
    from: `"Jessy Mathew Portfolio" <${user}>`,
    to: inbox,
    replyTo: `"${fields.name}" <${fields.email}>`,
    subject: `[Portfolio] New message from ${fields.name}`,
    text: [
      "Source: Portfolio (jessymathew.me)",
      `From: ${fields.name} <${fields.email}>`,
      "",
      fields.message,
    ].join("\n"),
  });
}
