import { proxyUpstream } from "../../lib/proxyUpstream.js";

export async function onRequestGet({ env }) {
  return proxyUpstream(env, {
    urlKey: "CLIENTS_API_URL",
    keyKey: "CLIENTS_API_KEY",
    errorLabel: "clients",
  });
}
