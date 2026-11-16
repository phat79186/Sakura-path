import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleClaudeProxy } from "./gemini-proxy.js";

export default defineConfig(({ mode }) => {
  // .env KHÔNG có tiền tố VITE_ => key không bao giờ lọt vào code trình duyệt
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      {
        name: "gemini-proxy",
        configureServer(server) {
          server.middlewares.use("/api/claude", (req, res) => {
            if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
            let raw = "";
            req.on("data", (c) => (raw += c));
            req.on("end", async () => {
              let body = {};
              try { body = JSON.parse(raw || "{}"); } catch {}
              const { status, json } = await handleClaudeProxy(body, env.GEMINI_API_KEY);
              res.statusCode = status;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify(json));
            });
          });
        },
      },
    ],
  };
});
