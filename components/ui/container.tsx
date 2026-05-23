import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto px-6 lg:px-10",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[1440px]",
        size === "narrow" && "max-w-5xl",
        size === "prose" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono uppercase text-[0.7rem] tracking-[0.18em] text-teal flex items-center gap-3",
        className,
      )}
    >
      <span className="h-px w-6 bg-teal/60" />
      {children}
    </div>
  );
}
