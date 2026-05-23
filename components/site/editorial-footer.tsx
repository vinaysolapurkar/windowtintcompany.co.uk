import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

export function EditorialFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__giant"><em>Window Tint</em>&nbsp;Co.</div>
        <div className="footer__top">
          <div className="footer__brand">
            <Link href="/" className="nav__logo" style={{ marginBottom: 20, color: "var(--paper)" }}>
              <div className="nav__logo-mark" style={{ borderColor: "var(--paper)" }} aria-hidden />
              <span>Window Tint <em style={{ fontStyle: "italic", color: "var(--bronze-2)", fontFamily: "var(--font-display-family), serif" }}>Co.</em></span>
            </Link>
            <p style={{ maxWidth: "36ch", color: "rgba(242,237,228,.7)", fontSize: 14, lineHeight: 1.55, margin: 0 }}>
              Professional window film installation across Scotland. Specialists in privacy, solar control,
              heat reduction, UV protection and energy-saving films for residential and commercial properties.
            </p>
          </div>
          <div className="footer__col">
            <h5>Navigate</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/showcase">Showcase</Link></li>
              <li><Link href="/blog">Journal</Link></li>
              <li><Link href="/estimate">Estimate</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Services</h5>
            <ul>
              <li><Link href="/services/solar-control-film">Solar control</Link></li>
              <li><Link href="/services/privacy-film">Privacy film</Link></li>
              <li><Link href="/services/decorative-film">Decorative</Link></li>
              <li><Link href="/services/safety-security-film">Security</Link></li>
              <li><Link href="/services/anti-glare-film">Anti-glare</Link></li>
              <li><Link href="/services/frosted-manifestation">Manifestation</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Contact</h5>
            <ul>
              <li><Link href={`tel:${settings.phone.replace(/\s+/g, "")}`}>{settings.phone}</Link></li>
              <li><Link href={`mailto:${settings.email}`}>{settings.email}</Link></li>
              <li>Mon–Fri, 08:00 – 17:00</li>
              <li style={{ marginTop: 16 }}>Edinburgh · Glasgow · Dunfermline</li>
              <li><Link href={settings.googleMapsUrl} target="_blank" rel="noopener">{settings.address}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Window Tint Company Ltd.</span>
          <span>Scotland · United Kingdom</span>
          <span>
            <Link href="/admin">Studio admin</Link> · Privacy · Terms · Sitemap
          </span>
        </div>
      </div>
    </footer>
  );
}
