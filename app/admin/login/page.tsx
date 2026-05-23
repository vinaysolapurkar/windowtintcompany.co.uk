import { redirect } from "next/navigation";
import { Logo } from "@/components/site/logo";
import { loginAction } from "./actions";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Studio admin · sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage(props: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const search = await props.searchParams;
  const session = await getSession();
  if (session) redirect(search?.next || "/admin");

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white">
      <section className="hidden lg:flex relative overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 40% 30%, rgba(20,184,166,0.25), transparent)" }} />
        <div className="relative z-10 m-auto px-16 max-w-md text-white">
          <Logo width={200} />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-3 mt-12">Studio admin</p>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight">
            Quietly run<br/><span className="italic text-teal-3">the studio.</span>
          </h1>
          <p className="mt-6 text-white/70 leading-relaxed">
            Publish journal entries, edit services, manage showcase work, and
            review every lead and survey request — from a single, fast back
            office.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {[
              { v: "100%", l: "Offline-friendly" },
              { v: "SQLite", l: "Today" },
              { v: "Neon", l: "Tomorrow" },
              { v: "0ms", l: "Editor friction" },
            ].map((s) => (
              <div key={s.l} className="bg-[#0f172a] p-4">
                <p className="font-display text-2xl text-teal-3">{s.v}</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-20 bg-bg">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <div className="inline-block rounded-lg bg-[#0f172a] p-4">
              <Logo width={180} />
            </div>
          </div>
          <h2 className="font-display text-3xl text-ink leading-tight">
            Sign in to the studio.
          </h2>
          <p className="mt-2 text-ink-3 text-sm">
            Use the admin credentials seeded with the database.
          </p>

          <form action={loginAction} className="mt-10 space-y-5">
            <input type="hidden" name="next" value={search?.next ?? ""} />
            {search?.error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
                {decodeURIComponent(search.error)}
              </div>
            )}
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.18em] text-ink-3">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@windowtintcompany.co.uk"
                className="mt-2 admin-input"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-[0.18em] text-ink-3">Password</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 admin-input"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-teal text-bg font-semibold tracking-tight hover:bg-teal-2 transition-colors"
            >
              Sign in →
            </button>
          </form>
          <p className="mt-8 text-xs text-ink-4">
            Forgot your credentials? Reset directly in the database with{" "}
            <code className="text-ink-2 bg-bg-2 px-1.5 py-0.5 rounded">pnpm run db:seed</code>{" "}
            after updating <code className="text-ink-2 bg-bg-2 px-1.5 py-0.5 rounded">.env</code>.
          </p>
        </div>
      </section>

      <style>{`
        .admin-input {
          width: 100%;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 0.95rem;
          color: var(--ink);
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--teal);
          box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.15);
        }
        .admin-input::placeholder { color: var(--ink-4); }
      `}</style>
    </main>
  );
}
