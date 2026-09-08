function withApiKey(base, key) {
  try {
    const parsed = new URL(base);
    parsed.searchParams.set("key", key);
    return parsed.toString();
  } catch {
    const join = String(base).includes("?") ? "&" : "?";
    return `${base}${join}key=${encodeURIComponent(key)}`;
  }
}

export async function proxyUpstream(env, { urlKey, keyKey, errorLabel }) {
  const base = env[urlKey];
  const key = env[keyKey];

  if (!base || !key) {
    console.error(`Missing ${urlKey} or ${keyKey}`);
    return Response.json(
      { error: `Server error while fetching ${errorLabel}` },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(withApiKey(base, key));

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch ${errorLabel}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(`${errorLabel} API error:`, error);
    return Response.json(
      { error: `Server error while fetching ${errorLabel}` },
      { status: 500 }
    );
  }
}
