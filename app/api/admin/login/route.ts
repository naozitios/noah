import { NextRequest, NextResponse } from "next/server";
import {
  createToken,
  verifyPassword,
  setAuthCookie,
} from "@/lib/auth";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitResult(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true, retryAfter: 0 };
  }

  record.count += 1;
  if (record.count > 5) {
    return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

setInterval(
  () => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap) {
      if (now > record.resetAt) rateLimitMap.delete(ip);
    }
  },
  60 * 1000,
);

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const { allowed, retryAfter } = getRateLimitResult(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: `Too many attempts. Try again in ${retryAfter} seconds.`,
        },
      },
      { status: 429 },
    );
  }

  let password: string;
  try {
    const body = await request.json();
    password = body.password;
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid request body" } },
      { status: 400 },
    );
  }

  if (!password || password.length > 128) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Password is required" } },
      { status: 400 },
    );
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    return NextResponse.json(
      {
        error: {
          code: "CONFIG_ERROR",
          message: "Admin password hash not configured",
        },
      },
      { status: 500 },
    );
  }

  const valid = await verifyPassword(password, passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid password" } },
      { status: 401 },
    );
  }

  const token = await createToken({ username: "admin" });
  const response = NextResponse.json({ success: true });
  setAuthCookie(response, token);
  return response;
}
