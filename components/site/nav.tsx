"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/showcase", label: "Showcase" },
  { href: "/blog", label: "Journal" },
  { href: "/estimate", label: "Estimate" },
  { href: "/contact", label: "Contact" },
];

export function Nav({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <nav className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="nav__inner">
        <Link href="/" className="nav__logo">
          <div className="nav__logo-mark" aria-hidden />
          <span>
            Window Tint <em style={{ fontStyle: "italic", color: "var(--bronze)", fontFamily: "var(--font-display-family), serif" }}>Co.</em>
          </span>
        </Link>
        <div className="nav__links">
          {NAV.map((it) => {
            const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`nav__link ${active ? "nav__link--active" : ""}`}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
        <div className="nav__cta">
          <Link href={phoneHref} className="nav__phone hidden md:inline">{phone}</Link>
          <Link href="/contact" className="btn">
            Get a quote <span className="arr" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center border border-[color:var(--rule)]"
            aria-label={open ? "Close menu" : "Open menu"}
            style={{ display: "none" }}
          >
            <span aria-hidden style={{ width: 18, height: 1, background: "currentColor", boxShadow: open ? "none" : "0 -5px 0 currentColor, 0 5px 0 currentColor" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`lg:hidden ${open ? "block" : "hidden"}`}
        style={{ borderTop: "1px solid var(--rule-soft)", background: "var(--bg)" }}
      >
        <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div className="flex flex-col" style={{ gap: 0 }}>
            {NAV.map((it) => {
              const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`nav__link ${active ? "nav__link--active" : ""}`}
                  style={{ padding: "14px 0", borderBottom: "1px solid var(--rule-soft)" }}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
          <Link href={phoneHref} className="t-caption" style={{ display: "block", marginTop: 20 }}>{phone}</Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 981px) { .nav__cta button { display: none !important; } }
        @media (max-width: 980px) { .nav__cta button { display: inline-flex !important; } .nav__cta .btn { display: none; } .nav__phone { display: none !important; } }
      `}</style>
    </nav>
  );
}
