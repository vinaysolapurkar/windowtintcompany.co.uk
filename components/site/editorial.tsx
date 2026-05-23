"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ============== ARROW ICON ==============
export const ArrowRight = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const Star = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
    <path d="M6 0l1.55 4.15L12 4.5l-3.6 2.85L9.7 12 6 9.5 2.3 12l1.3-4.65L0 4.5l4.45-.35z" />
  </svg>
);

// ============== COUNTER ==============
export function Counter({ to, suffix = "+", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(to * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ============== BEFORE / AFTER ==============
export function BeforeAfter({
  before,
  after,
  leftLabel = "Untinted",
  rightLabel = "Tinted",
}: {
  before: string;
  after: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement | null>(null);
  const drag = useRef(false);

  const onMove = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => drag.current && onMove(e.clientX);
    const mu = () => (drag.current = false);
    const tm = (e: TouchEvent) => drag.current && onMove(e.touches[0].clientX);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm);
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", mu);
    };
  }, [onMove]);

  return (
    <div>
      <div
        className="ba"
        ref={ref}
        onMouseDown={(e) => { drag.current = true; onMove(e.clientX); }}
        onTouchStart={(e) => { drag.current = true; onMove(e.touches[0].clientX); }}
      >
        <div className="ba__layer" style={{ backgroundImage: `url(${before})` }} />
        <div className="ba__after-wrap" style={{ "--p": `${pos}%` } as React.CSSProperties}>
          <div className="ba__layer" style={{ backgroundImage: `url(${after})`, filter: "brightness(0.7) saturate(1.05) contrast(1.05)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,20,17,0.18) 0%, rgba(14,20,17,0.42) 100%)" }} />
        </div>
        <div className="ba__tag ba__tag--left">— {leftLabel}</div>
        <div className="ba__tag ba__tag--right">{rightLabel} —</div>
        <div className="ba__handle" style={{ "--p": `${pos}%` } as React.CSSProperties}>
          <div className="ba__knob" />
        </div>
      </div>
      <div className="ba__caption">
        <div className="ba__caption-item">
          <div className="dot" />
          <div>
            <h4>{leftLabel}</h4>
            <p>Direct sunlight. Glare. UV exposure. Unfiltered view.</p>
          </div>
        </div>
        <div className="ba__caption-item">
          <div className="dot" />
          <div>
            <h4>{rightLabel}</h4>
            <p>Privacy preserved. 99% UV blocked. Heat reduced by up to 79%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== SCROLL REVEAL ==============
export function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-in)");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
  return null;
}

// ============== MARQUEE ==============
export function Marquee({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <div className="marquee">
      <div className="marquee__track">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="marquee__item">
            {it} <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ============== STATS BAR ==============
export function Stats() {
  const data = [
    { num: 4200, label: "Windows tinted" },
    { num: 1850, label: "Satisfied clients" },
    { num: 720, label: "Residential homes" },
    { num: 240, label: "Offices & showrooms" },
  ];
  return (
    <section className="container section section--tight">
      <div className="stats">
        {data.map((d, i) => (
          <div className="stat" key={i}>
            <div className="stat__num"><Counter to={d.num} suffix="+" /></div>
            <div className="stat__label">{d.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============== TESTIMONIALS ==============
export function Testimonials() {
  const items = [
    {
      q: "Our home stays noticeably cooler in summer, the glare is gone, and the films are completely invisible from the inside. Impeccable craft.",
      name: "Ayesha Rahman",
      role: "Residential — Edinburgh",
    },
    {
      q: "They specified the right film for a south-facing office wall and installed it in a single day with zero disruption. Our team can actually see their screens now.",
      name: "Kanesha Patel",
      role: "Commercial — Glasgow",
    },
    {
      q: "Spotless installation across the whole property. The privacy during the day is a huge bonus and the daylight quality is, somehow, better than before.",
      name: "Dharmin Shah",
      role: "Residential — Stirling",
    },
  ];
  return (
    <section className="testimonials">
      <div className="container">
        <div className="sec-head reveal">
          <div>
            <div className="sec-head__label"><span className="sec-head__num">04 — Testimonials</span></div>
          </div>
          <h2 className="t-h2" style={{ color: "var(--paper)" }}>
            Spoken for by the <em>people</em> we work with.
          </h2>
        </div>
        {items.map((t, i) => (
          <div className="testimonial reveal" key={i}>
            <p className="testimonial__quote">{t.q}</p>
            <div className="testimonial__meta">
              <div className="testimonial__stars">
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} />)}
              </div>
              <div className="testimonial__name">— {t.name}</div>
              <div className="testimonial__role">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
