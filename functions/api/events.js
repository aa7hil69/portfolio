import { proxyUpstream } from "../../lib/proxyUpstream.js";

export async function onRequestGet({ env }) {
  return proxyUpstream(env, {
    urlKey: "EVENTS_API_URL",
    keyKey: "EVENTS_API_KEY",
    errorLabel: "events",
  });
}
