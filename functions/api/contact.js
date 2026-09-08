import { sendContactResend } from "../../lib/sendContactResend.js";
import { validateContactPayload } from "../../lib/validateContact.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost({ request, env }) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { ok: false, error: "Invalid submission" },
        { status: 422 }
      );
    }

    const validated = validateContactPayload(body);
    if (!validated.ok) {
      return Response.json(
        { ok: false, error: validated.error },
        { status: validated.status }
      );
    }

    await sendContactResend(validated.fields, env);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err?.message || err);
    return Response.json(
      { ok: false, error: "Unable to send message" },
      { status: 500 }
    );
  }
}
