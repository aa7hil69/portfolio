import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import {
  sendContactMail,
  validateContactPayload,
} from "./api/_lib/sendContactMail.js";

function spaFallbackPlugin() {
  return {
    name: "spa-404",
    closeBundle() {
      const dist = path.resolve("dist");
      const indexPath = path.join(dist, "index.html");
      if (!fs.existsSync(indexPath)) return;
      fs.copyFileSync(indexPath, path.join(dist, "404.html"));
    },
  };
}

function readRequestJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function contactDevPlugin(mailEnv) {
  return {
    name: "contact-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") {
          next();
          return;
        }

        res.setHeader("Content-Type", "application/json");

        try {
          const body = await readRequestJson(req);
          const validated = validateContactPayload(body);
          if (!validated.ok) {
            res.statusCode = validated.status;
            res.end(JSON.stringify({ ok: false, error: validated.error }));
            return;
          }

          await sendContactMail(validated.fields, mailEnv);
          res.statusCode = 200;
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error("Contact API error:", err?.message || err);
          res.statusCode = err?.status || 500;
          res.end(
            JSON.stringify({ ok: false, error: "Unable to send message" })
          );
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") {
          next();
          return;
        }

        res.setHeader("Content-Type", "application/json");

        try {
          const body = await readRequestJson(req);
          const validated = validateContactPayload(body);
          if (!validated.ok) {
            res.statusCode = validated.status;
            res.end(JSON.stringify({ ok: false, error: validated.error }));
            return;
          }

          await sendContactMail(validated.fields, mailEnv);
          res.statusCode = 200;
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error("Contact API error:", err?.message || err);
          res.statusCode = err?.status || 500;
          res.end(
            JSON.stringify({ ok: false, error: "Unable to send message" })
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), "VITE_");
  const mailEnv = loadEnv(mode, process.cwd(), "");
  const apiBase = (viteEnv.VITE_API_BASE || "https://jminternationalspc.com/API").replace(
    /\/$/,
    ""
  );
  const apiOrigin = new URL(apiBase).origin;
  const apiKey = viteEnv.VITE_API_KEY || "";

  const proxyTo = (remotePath) => ({
    target: apiOrigin,
    changeOrigin: true,
    secure: true,
    rewrite: () => {
      const url = new URL(remotePath, apiOrigin);
      if (apiKey) url.searchParams.set("key", apiKey);
      return `${url.pathname}${url.search}`;
    },
  });

  const proxy = {
    "/api/clients": proxyTo("/API/clients"),
    "/api/events": proxyTo("/API/events"),
    "/api/galleries": proxyTo("/API/gallery"),
    "/api/gallery": proxyTo("/API/gallery"),
  };

  return {
    plugins: [
      react(),
      tailwindcss(),
      contactDevPlugin(mailEnv),
      spaFallbackPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: { proxy },
    preview: { proxy },
  };
});
