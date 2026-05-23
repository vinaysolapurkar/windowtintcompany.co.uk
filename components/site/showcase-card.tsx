import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Project = {
  slug: string;
  title: string;
  location?: string | null;
  category: string;
  summary: string;
  heroImage: string;
  filmUsed?: string | null;
};

export function ShowcaseCard({
  project,
  index = 0,
  size = "default",
}: {
  project: Project;
  index?: number;
  size?: "default" | "wide" | "tall";
}) {
  return (
    <Link
      href={`/showcase/${project.slug}`}
      className={cn(
        "group surface-card relative block overflow-hidden rounded-2xl",
        size === "wide" && "md:col-span-2",
        size === "tall" && "md:row-span-2",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 opacity-90" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-3/40 shadow-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-line shadow-sm">
            {project.category}
          </span>
        </div>
      </div>
      <div className="relative p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.4rem] leading-tight tracking-tight text-ink">
            {project.title}
          </h3>
          <ArrowUpRight className="h-5 w-5 text-ink-4 mt-1 transition-all duration-300 group-hover:text-teal-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
        </div>
        {project.location && (
          <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em] text-ink-3">
            {project.location}
          </p>
        )}
        <p className="mt-4 text-sm text-ink-2 line-clamp-2">{project.summary}</p>
        {project.filmUsed && (
          <p className="mt-5 pt-4 border-t border-line-soft text-[11px] font-mono uppercase tracking-[0.16em] text-ink-3">
            Film: <span className="text-ink">{project.filmUsed}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
