"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloater({ number }: { number: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp us"
      className={`group fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full bg-bronze text-paper shadow-[0_20px_60px_-15px_rgba(164,113,72,0.55)] transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-bronze/60 animate-ping opacity-40" />
      <span className="relative grid place-items-center h-14 w-14 rounded-full bg-bronze">
        <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <span className="relative pr-6 hidden md:inline text-sm font-medium tracking-tight">
        Chat now
      </span>
    </Link>
  );
}
