import Link from "next/link";
import Image from "next/image";

export function Logo({
  className,
  width = 168,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Link
      href="/"
      className={className}
      aria-label="Window Tint Company — Home"
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <Image
        src="/brand/logo.avif"
        alt="Window Tint Company"
        width={width}
        height={Math.round((width * 33) / 200)}
        priority
        style={{ height: "auto" }}
      />
    </Link>
  );
}
