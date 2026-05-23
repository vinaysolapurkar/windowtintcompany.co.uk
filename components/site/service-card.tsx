import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/cn";

type Service = {
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;
  icon: string;
  vlt?: string | null;
  uvBlock?: string | null;
  heatReject?: string | null;
};

export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const Icon =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[
      service.icon
    ] ?? LucideIcons.Sparkles;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group surface-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-7",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-teal-3/30 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <div className="flex items-start justify-between relative">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-soft text-teal-2 transition-transform duration-500 group-hover:-translate-y-1">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <ArrowUpRight className="h-5 w-5 text-ink-4 transition-all duration-300 group-hover:text-teal-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div className="mt-10 relative">
        <h3 className="font-display text-[1.65rem] leading-[1.05] tracking-tight text-ink">
          {service.name}
        </h3>
        <p className="mt-2 text-sm text-ink-3 italic font-display">
          {service.tagline}
        </p>
        <p className="mt-5 text-sm text-ink-2 leading-relaxed">
          {service.shortDesc}
        </p>
        {(service.vlt || service.uvBlock || service.heatReject) && (
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3">
            {service.vlt && (
              <span className="rounded-full border border-line px-3 py-1 bg-bg-2">
                VLT {service.vlt}
              </span>
            )}
            {service.heatReject && (
              <span className="rounded-full border border-line px-3 py-1 bg-bg-2">
                Heat <span className="text-teal-2">{service.heatReject}</span>
              </span>
            )}
            {service.uvBlock && (
              <span className="rounded-full border border-line px-3 py-1 bg-bg-2">
                UV <span className="text-teal-2">{service.uvBlock}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
