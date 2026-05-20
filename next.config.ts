import type { NextConfig } from "next";
import * as fs from "fs";
import * as path from "path";

// Lee .env.local manualmente para garantizar que las variables estén disponibles
// (workaround para issue de carga de env en Next.js 16 + Turbopack en Windows)
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.substring(0, idx).trim();
    const value = trimmed.substring(idx + 1).trim();
    result[key] = value;
  }
  return result;
}

const envVars = loadEnvLocal();

const nextConfig: NextConfig = {
  env: {
    // Core
    ANTHROPIC_API_KEY:           envVars.ANTHROPIC_API_KEY           ?? "",
    AUTH_SECRET:                 envVars.AUTH_SECRET                 ?? "",
    USER_JM_PASSWORD:            envVars.USER_JM_PASSWORD            ?? "",
    USER_SOCIO_PASSWORD:         envVars.USER_SOCIO_PASSWORD         ?? "",
    // Supabase server-side
    SUPABASE_SERVICE_KEY:        envVars.SUPABASE_SERVICE_KEY        ?? "",
    // Public URL (used by webhooks)
    NEXT_PUBLIC_URL:             envVars.NEXT_PUBLIC_URL             ?? "http://localhost:3000",
    // Payment providers (uncomment the one you activate)
    FLOW_API_KEY:                envVars.FLOW_API_KEY                ?? "",
    FLOW_SECRET_KEY:             envVars.FLOW_SECRET_KEY             ?? "",
    MP_ACCESS_TOKEN:             envVars.MP_ACCESS_TOKEN             ?? "",
    STRIPE_SECRET_KEY:           envVars.STRIPE_SECRET_KEY           ?? "",
    STRIPE_WEBHOOK_SECRET:       envVars.STRIPE_WEBHOOK_SECRET       ?? "",
  },
};

export default nextConfig;
