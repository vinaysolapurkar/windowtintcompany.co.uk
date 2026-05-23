import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-teal text-white hover:bg-teal-2 shadow-[0_12px_32px_-10px_rgba(20,184,166,0.5)]",
        secondary:
          "border border-line bg-white text-ink hover:border-teal hover:text-teal-2 shadow-sm",
        ghost: "text-ink-2 hover:text-teal-2",
        outline:
          "border border-teal text-teal-2 hover:bg-teal hover:text-white",
        soft: "bg-teal-soft text-teal-2 hover:bg-teal-3/40",
        danger:
          "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-full",
        md: "h-11 px-6 text-sm rounded-full",
        lg: "h-14 px-8 text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface BaseProps extends VariantProps<typeof buttonStyles> {
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = BaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { className, variant, size, ...rest } = props as ButtonProps & LinkProps;
  const cls = cn(buttonStyles({ variant, size }), className);
  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {props.children}
      </Link>
    );
  }
  return <button className={cls} {...(rest as ButtonProps)} />;
}
