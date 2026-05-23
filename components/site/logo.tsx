import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  variant = "light",
  width = 168,
}: {
  className?: string;
  /** "light" = white wordmark for dark surfaces; "dark" = inverted for light surfaces */
  variant?: "light" | "dark";
  width?: number;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center select-none", className)}
      aria-label="Window Tint Company — Home"
    >
      <Image
        src="/brand/logo.avif"
        alt="Window Tint Company"
        width={width}
        height={Math.round(width * 33 / 200)}
        priority
        className={cn(
          "transition-opacity duration-300 group-hover:opacity-90",
          variant === "dark" && "invert brightness-0",
        )}
      />
    </Link>
  );
}
