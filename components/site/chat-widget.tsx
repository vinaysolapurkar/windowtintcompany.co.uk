"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquareText, X, Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Will solar film darken my room?",
  "I have neighbours close — what's the best privacy film?",
  "Do you cover Edinburgh / Glasgow / Fife?",
  "How does a survey work?",
];

const OPENER: Msg = {
  role: "assistant",
  content:
    "Hi — I'm Clara, the studio assistant. Ask me anything about window film, prices, our process, or which film might suit your room. I can also help you book a survey across Scotland.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([OPENER]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        let err = "We couldn't reach the assistant. Please call +44 73 9500 9701 or WhatsApp us.";
        try {
          const j = await res.json();
          if (j?.error) err = j.error;
        } catch { /* noop */ }
        setMessages((ms) => {
          const copy = ms.slice(0, -1);
          return [...copy, { role: "assistant", content: err }];
        });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((ms) => {
          const copy = ms.slice(0, -1);
          return [...copy, { role: "assistant", content: acc }];
        });
      }
    } catch {
      setMessages((ms) => {
        const copy = ms.slice(0, -1);
        return [
          ...copy,
          {
            role: "assistant",
            content:
              "Sorry — something went wrong. Please WhatsApp us on +44 7395 009701 or email hello@windowtintcompany.co.uk.",
          },
        ];
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Toggle */}
      <button
        type="button"
        aria-label={open ? "Close studio assistant" : "Open studio assistant"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed z-40 bottom-[5.5rem] right-6 grid h-12 w-12 place-items-center rounded-full transition-all duration-500 shadow-[0_18px_50px_-12px_rgba(15,23,42,0.25)]",
          open
            ? "bg-white border border-[color:var(--rule)] text-fg"
            : "bg-gradient-to-br from-bronze to-bronze-3 text-white hover:scale-105",
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquareText className="h-5 w-5" strokeWidth={1.75} />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-bronze/40 animate-ping opacity-50" />
        )}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed z-40 bottom-36 right-3 left-3 md:left-auto md:right-6 md:bottom-36 w-auto md:w-[400px] max-w-[440px] origin-bottom-right transition-all duration-400 ease-out",
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
        )}
      >
        <div className="flex flex-col rounded-3xl border border-[color:var(--rule)] bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)] overflow-hidden max-h-[min(82vh,640px)]">
          {/* Header */}
          <div className="relative px-5 py-4 border-b border-[color:var(--rule)] flex items-center justify-between bg-gradient-to-br from-white to-bg-2">
            <div className="flex items-center gap-3">
              <div className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-bronze to-bronze-3 text-white">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-bronze ring-2 ring-white animate-pulse" />
              </div>
              <div>
                <p className="font-display text-base text-fg leading-tight">Ask Clara</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-bronze">
                  Studio assistant · online
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-bg-2 text-muted hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} streaming={sending && i === messages.length - 1 && m.role === "assistant"} />
            ))}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-[12px] rounded-full border border-[color:var(--rule)] text-fg-2 px-3 py-1.5 hover:border-teal hover:text-bronze transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-[color:var(--rule)] p-3 flex items-end gap-2 bg-bg-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Type your question…"
              className="flex-1 resize-none bg-white border border-[color:var(--rule)] rounded-2xl px-4 py-3 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-teal max-h-32"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="grid h-11 w-11 place-items-center rounded-full bg-bronze text-white disabled:opacity-40 hover:bg-bronze-2 transition-colors shrink-0"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
          <p className="px-5 pb-3 text-[10px] text-muted text-center">
            Powered by DeepSeek · trained on the Window Tint Company® studio knowledge base
          </p>
        </div>
      </div>
    </>
  );
}

function Bubble({ role, content, streaming }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="grid h-7 w-7 place-items-center rounded-full bg-cream-2 border border-bronze-2 shrink-0">
          <Sparkles className="h-3 w-3 text-bronze" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "bg-bronze text-white rounded-br-sm"
            : "bg-bg-2 border border-[color:var(--rule)] text-fg-2 rounded-bl-sm",
        )}
      >
        {content}
        {streaming && (
          <span className="ml-1 inline-block h-3.5 w-1 bg-bronze align-baseline animate-pulse" />
        )}
      </div>
    </div>
  );
}
