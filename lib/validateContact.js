function readBodyFields(data = {}) {
  return {
    name: String(data.name ?? "").trim(),
    email: String(data.email ?? "").trim(),
    message: String(data.message ?? "").trim(),
    website: String(data.website ?? "").trim(),
  };
}

export function validateContactPayload(data) {
  const fields = readBodyFields(data);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);

  if (fields.website) {
    return { ok: false, status: 422, error: "Invalid submission" };
  }
  if (!fields.name || !emailOk || !fields.message) {
    return { ok: false, status: 422, error: "Invalid submission" };
  }
  if (fields.message.length > 5000) {
    return { ok: false, status: 422, error: "Invalid submission" };
  }
  return { ok: true, fields };
}
