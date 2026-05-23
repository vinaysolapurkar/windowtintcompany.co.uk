import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const COOKIE = "wtc_admin";
const ALG = "HS256";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET must be set and at least 16 characters.");
  }
  return new TextEncoder().encode(s);
}

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHENTICATED");
  return s;
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<{ ok: true; session: SessionPayload } | { ok: false; error: string }> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Email or password is incorrect." };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { ok: false, error: "Email or password is incorrect." };
  return {
    ok: true,
    session: { sub: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE);
}

export const COOKIE_NAME = COOKIE;
