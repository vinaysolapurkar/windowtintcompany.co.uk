"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Wrench,
  Images,
  Inbox,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Hammer,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/cn";
import { logoutAction } from "../login/actions";

type Session = { sub: string; email: string; name: string; role: string };

const NAV: { label: string; href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads & enquiries", href: "/admin/leads", icon: Inbox },
  { label: "Availability", href: "/admin/availability", icon: CalendarDays },
  { label: "Posts", href: "/admin/posts", icon: Newspaper },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Showcase", href: "/admin/showcase", icon: Hammer },
  { label: "Media", href: "/admin/media", icon: Images },
  { label: "Site settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[#0f172a] px-4 h-14 flex items-center justify-between">
        <Logo width={140} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className="lg:hidden h-14" />

      {/* Mobile drawer */}
      {open && (
        <button
          aria-label="Close menu"
          type="button"
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm"
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky lg:top-0 z-50 lg:z-auto inset-y-0 left-0 w-72 bg-white border-r border-line transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "flex flex-col",
        )}
      >
        <div className="p-6 border-b border-line-soft bg-[#0f172a]">
          <Logo width={180} />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-teal-3">Studio admin</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-teal/10 text-teal"
                    : "text-ink-2 hover:bg-bg-2 hover:text-ink",
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-line-soft">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink-3 hover:bg-bg-2 hover:text-ink"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            View site
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3 py-3 rounded-lg bg-bg-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal/30 to-bg border border-teal/30 font-display text-teal text-sm">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{session.name}</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3 truncate">{session.email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="grid h-8 w-8 place-items-center rounded-md text-ink-3 hover:text-danger hover:bg-bg"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
