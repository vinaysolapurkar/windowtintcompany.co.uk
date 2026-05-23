"use server";

import { redirect } from "next/navigation";
import { loginWithCredentials, setSessionCookie, signSession, clearSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "") || "/admin";

  if (!email || !password) {
    redirect(`/admin/login?error=${encodeURIComponent("Email and password are required.")}&next=${encodeURIComponent(next)}`);
  }
  const res = await loginWithCredentials(email, password);
  if (!res.ok) {
    redirect(`/admin/login?error=${encodeURIComponent(res.error)}&next=${encodeURIComponent(next)}`);
  }
  const token = await signSession(res.session);
  await setSessionCookie(token);
  redirect(next);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
