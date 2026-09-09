export async function sendContactResend(fields, env) {
  const apiKey = env.RESEND_API_KEY;
  const inbox = env.CONTACT_INBOX;
  const from = env.CONTACT_FROM;
  const siteName = env.CONTACT_SITE_NAME || "Portfolio (jessymathew.me)";

  if (!apiKey || !inbox || !from) {
    const err = new Error("Mail configuration missing");
    err.status = 500;
    throw err;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [inbox],
      reply_to: `${fields.name} <${fields.email}>`,
      subject: `[Portfolio] New message from ${fields.name}`,
      text: [
        `Source: ${siteName}`,
        `From: ${fields.name} <${fields.email}>`,
        "",
        fields.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("Resend error:", response.status, details);
    const err = new Error("Unable to send message");
    err.status = 500;
    throw err;
  }
}
