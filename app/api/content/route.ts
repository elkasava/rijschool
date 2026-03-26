import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentPath = path.join(process.cwd(), "data", "content.json");

// ── In-memory rate limiter (resets on cold start — sufficient for low-traffic admin endpoint) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;   // max requests per window
const RATE_WINDOW = 60_000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Strip keys starting with $ or containing dots (NoSQL-style injection guard) */
function sanitizeObject(obj: unknown, depth = 0): unknown {
  if (depth > 10) return null;
  if (typeof obj === "string") return obj.slice(0, 10_000); // cap field length
  if (typeof obj === "number" || typeof obj === "boolean" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObject(item, depth + 1));
  if (typeof obj === "object" && obj !== null) {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key.startsWith("$") || key.includes(".")) continue; // drop dangerous keys
      clean[key] = sanitizeObject(value, depth + 1);
    }
    return clean;
  }
  return null;
}

export async function GET() {
  try {
    const data = fs.readFileSync(contentPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Kon content niet laden" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Te veel verzoeken. Probeer het over een minuut opnieuw." },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      }
    );
  }

  // Auth
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  // Parse + sanitize body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig JSON-formaat" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Ongeldig verzoek" }, { status: 400 });
  }

  const sanitized = sanitizeObject(body);

  try {
    fs.writeFileSync(contentPath, JSON.stringify(sanitized, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kon content niet opslaan" }, { status: 500 });
  }
}
