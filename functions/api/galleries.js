import { proxyUpstream } from "../../lib/proxyUpstream.js";

export async function onRequestGet({ env }) {
  return proxyUpstream(env, {
    urlKey: "GALLERIES_API_URL",
    keyKey: "GALLERIES_API_KEY",
    errorLabel: "galleries",
  });
}
