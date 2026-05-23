import type { Metadata } from "next";
import { db } from "@/lib/db";
import { EstimateForm } from "./estimate-form";
import { getNextAvailableSlots } from "@/lib/availability";
import { Reveal } from "@/components/site/editorial";

export const metadata: Metadata = {
  title: "Instant AI Estimate — Window Film across Scotland",
  description:
    "Get a fast, AI-generated window film estimate. Tell us the film, the window size and your postcode — we'll give you a ballpark plus the next available survey slot.",
  alternates: { canonical: "/estimate" },
};

export default async function EstimatePage() {
  const [services, slots] = await Promise.all([
    db.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { slug: true, name: true, tagline: true, icon: true },
    }),
    getNextAvailableSlots(4),
  ]);

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— AI estimate · ballpark</div>
            <h1 className="page-hero__title">
              30 seconds to a<br /><em>ballpark</em>.
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">
              Pick the film, drop in the window size, tap a date. We&rsquo;ll return an AI-written estimate using Scotland-standard labour rates — plus the next available survey slot.
            </p>
            <div className="values" style={{ marginTop: 32, gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[
                { t: "Free 45-min survey", b: "Anywhere in Scotland from Dunfermline." },
                { t: "Lifetime warranty", b: "On all residential film installations." },
                { t: "Turn-key in-house", b: "Same team specifies and installs." },
              ].map((c) => (
                <div key={c.t} className="value">
                  <h3 className="value__title">{c.t}</h3>
                  <p className="value__body">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <EstimateForm services={services} slots={slots} />
      </section>
    </>
  );
}
