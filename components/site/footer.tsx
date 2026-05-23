import Link from "next/link";
import { Phone, Mail, MapPin, AtSign, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import type { SiteSettings } from "@/lib/settings";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const phoneHref = `tel:${settings.phone.replace(/\s+/g, "")}`;
  const mailHref = `mailto:${settings.email}`;

  return (
    <footer className="relative mt-32 overflow-hidden bg-[#0f172a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-0 right-0 px-6 lg:px-10 font-display italic text-[18vw] leading-none text-white/[0.04] select-none"
      >
        Window<span className="not-italic">Tint</span>
      </div>
      <Container size="wide" className="relative pt-20 pb-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo width={180} />
            <p className="mt-8 max-w-md font-display text-[1.5rem] leading-tight text-white">
              {settings.siteTagline}
            </p>
            <p className="mt-6 text-white/60 max-w-md">
              Specialist window film, surveyed on site and installed for life.
              Based in Dunfermline, covering Edinburgh, Glasgow, Fife and the
              whole of Scotland.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-teal text-white font-medium text-sm hover:bg-teal-2 transition-colors shadow-[0_12px_32px_-10px_rgba(20,184,166,0.6)]"
              >
                Book a survey
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={phoneHref}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/20 text-white text-sm hover:border-teal-3 hover:text-teal-3"
              >
                <Phone className="h-4 w-4" />
                {settings.phone}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-3 mb-5">Navigate</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link href="/" className="hover:text-teal-3 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-teal-3 transition-colors">About</Link></li>
                <li><Link href="/services" className="hover:text-teal-3 transition-colors">Services</Link></li>
                <li><Link href="/estimate" className="hover:text-teal-3 transition-colors">Estimate</Link></li>
                <li><Link href="/showcase" className="hover:text-teal-3 transition-colors">Showcase</Link></li>
                <li><Link href="/blog" className="hover:text-teal-3 transition-colors">Journal</Link></li>
                <li><Link href="/contact" className="hover:text-teal-3 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-3 mb-5">Specialisms</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link href="/services/solar-control-film" className="hover:text-teal-3 transition-colors">Solar control</Link></li>
                <li><Link href="/services/privacy-film" className="hover:text-teal-3 transition-colors">Privacy film</Link></li>
                <li><Link href="/services/decorative-film" className="hover:text-teal-3 transition-colors">Decorative</Link></li>
                <li><Link href="/services/safety-security-film" className="hover:text-teal-3 transition-colors">Security</Link></li>
                <li><Link href="/services/anti-glare-film" className="hover:text-teal-3 transition-colors">Anti-glare</Link></li>
                <li><Link href="/services/frosted-manifestation" className="hover:text-teal-3 transition-colors">Manifestation</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-3 mb-5">Reach us</p>
              <ul className="space-y-3.5 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-teal-3 shrink-0" />
                  <Link href={phoneHref} className="hover:text-teal-3">{settings.phone}</Link>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-teal-3 shrink-0" />
                  <Link href={mailHref} className="hover:text-teal-3 break-all">{settings.email}</Link>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-teal-3 shrink-0" />
                  <Link href={settings.googleMapsUrl} target="_blank" rel="noopener" className="hover:text-teal-3">
                    {settings.address}
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <AtSign className="h-4 w-4 mt-0.5 text-teal-3 shrink-0" />
                  <Link href="https://www.facebook.com/windowtintcompany" target="_blank" rel="noopener" className="hover:text-teal-3">Facebook</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-white/45">
          <p>© {year} {settings.siteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-teal-3">Studio admin</Link>
            <span className="font-mono uppercase tracking-[0.18em]">Registered in Scotland</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
