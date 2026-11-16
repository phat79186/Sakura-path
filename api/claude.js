import { handleClaudeProxy } from "../gemini-proxy.js";

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const { status, json } = await handleClaudeProxy(req.body || {}, process.env.GEMINI_API_KEY);
  return res.status(status).json(json);
}
