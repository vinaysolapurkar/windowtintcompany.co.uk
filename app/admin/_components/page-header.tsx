import Link from "next/link";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <header className={cn("border-b border-line-soft px-6 lg:px-10 py-8", className)}>
      {breadcrumb && (
        <nav className="flex items-center gap-2 text-xs text-ink-3 mb-3">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-ink-4">/</span>}
              {b.href ? (
                <Link href={b.href} className="hover:text-teal">{b.label}</Link>
              ) : (
                <span>{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-2 text-ink-3 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
