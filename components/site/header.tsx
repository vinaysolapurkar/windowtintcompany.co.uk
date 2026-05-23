"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, Menu, X, ArrowUpRight, MessageCircle, Mail } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/estimate", label: "Estimate", highlight: true },
  { href: "/showcase", label: "Showcase" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  phone,
  whatsapp,
  email,
}: {
  phone: string;
  whatsapp: string;
  email: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const waHref = `https://wa.me/${whatsapp}`;
  const mailHref = `mailto:${email}`;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-[#0f172a]",
        scrolled
          ? "shadow-[0_4px_20px_-8px_rgba(15,23,42,0.25)]"
          : "",
      )}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-3 sm:gap-6">
          <Logo width={160} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium tracking-tight transition-colors",
                    active ? "text-white" : "text-white/65 hover:text-white",
                    item.highlight && !active && "text-teal-3 hover:text-white",
                  )}
                >
                  {item.label}
                  {item.highlight && !active && (
                    <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-teal-3 animate-pulse" />
                  )}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-teal-3 transition-all duration-300 rounded-full",
                      active ? "w-4" : "w-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right side: desktop = icon cluster + CTA; mobile = call + menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5">
              <ContactIcon href={waHref} aria-label="WhatsApp" external>
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              </ContactIcon>
              <ContactIcon href={mailHref} aria-label="Email">
                <Mail className="h-4 w-4" strokeWidth={1.75} />
              </ContactIcon>
              <ContactIcon href={phoneHref} aria-label="Phone">
                <Phone className="h-4 w-4" strokeWidth={1.75} />
              </ContactIcon>
              <Link
                href="/contact"
                className="ml-2 inline-flex items-center gap-2 h-10 rounded-full px-5 bg-teal text-white font-semibold text-sm tracking-tight hover:bg-teal-2 transition-colors shadow-[0_8px_24px_-8px_rgba(20,184,166,0.6)]"
              >
                Get a quote
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile: prominent CALL button */}
            <Link
              href={phoneHref}
              className="lg:hidden inline-flex items-center gap-2 h-10 sm:h-11 pl-2.5 pr-4 rounded-full bg-teal text-white font-semibold text-sm shadow-[0_8px_24px_-8px_rgba(20,184,166,0.6)]"
              aria-label={`Call ${phone}`}
            >
              <span className="grid place-items-center h-7 w-7 rounded-full bg-white/20">
                <Phone className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <span className="hidden sm:inline">Call</span>
              <span className="hidden md:inline font-normal opacity-90">{phone}</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white/10"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden absolute inset-x-0 top-full origin-top transition-all duration-500",
          open
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none",
        )}
      >
        <div className="mx-3 sm:mx-4 mt-2 mb-4 rounded-2xl border border-line bg-white p-4 sm:p-6 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)]">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-teal-soft text-teal-2"
                      : "text-ink-2 hover:bg-bg-2 hover:text-ink",
                  )}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MobileQuickAction href={phoneHref} icon={Phone} label="Call" primary />
            <MobileQuickAction href={waHref} icon={MessageCircle} label="WhatsApp" external />
            <MobileQuickAction href={mailHref} icon={Mail} label="Email" />
          </div>
          <Link
            href="/contact"
            className="mt-3 flex items-center justify-center gap-2 h-12 rounded-full bg-teal text-white font-semibold text-sm"
          >
            Get a quote
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function ContactIcon({
  href,
  external,
  children,
  ...rest
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className="grid h-10 w-10 place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      {...rest}
    >
      {children}
    </Link>
  );
}

function MobileQuickAction({
  href,
  icon: Icon,
  label,
  primary,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 h-16 rounded-xl border text-xs font-medium transition-colors",
        primary
          ? "bg-teal text-white border-teal"
          : "bg-bg-2 text-ink-2 border-line hover:border-teal",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={primary ? 2 : 1.5} />
      {label}
    </Link>
  );
}
