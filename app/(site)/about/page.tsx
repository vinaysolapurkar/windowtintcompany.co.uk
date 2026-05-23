import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stats } from "@/components/site/editorial";

export const metadata: Metadata = {
  title: "About — A small studio, an exact craft",
  description:
    "Window Tint Company® — Scotland-based specialist installer of architectural and decorative window film. Dunfermline · Edinburgh · Glasgow.",
};

export default function AboutPage() {
  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— 01 / About</div>
            <h1 className="page-hero__title">
              A small studio.<br />
              An <em>exact</em> craft.
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">
              Window Tint Company® is a Scotland-based specialist installer of architectural and decorative window film. We work quietly, with care, on residential and commercial projects from Dunfermline to Edinburgh to Glasgow — and across the country.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <div className="split__img" style={{ backgroundImage: `url(/photos/job-5.jpg)` }} />
          <div className="split__body">
            <div className="sec-head__label" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="sec-head__num">02 — Who we are</span>
            </div>
            <h2 className="t-h2">
              We are <em>installers</em>,<br />not salespeople.
            </h2>
            <p className="t-body">
              Every quote starts with a site visit. We measure, we look at light, we ask what you actually want the room to feel like. Then we specify a film and we install it — usually in a single day, always with the same standards we&rsquo;d apply to our own homes.
            </p>
            <p className="t-body">
              Films can do remarkable things. Block 99% of UV. Reject up to 79% of solar heat. Provide one-way privacy without changing the daylight quality. The specification matters. We treat it like a discipline.
            </p>
            <div style={{ marginTop: 16 }}>
              <Link href="/services" className="btn">Our services <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">03 — Principles</span>
          </div>
          <h2 className="t-h2">What we work to.</h2>
        </div>
        <div className="values">
          {[
            { n: "01", t: "Expertise", b: "Trained on the films we install. Decades of combined experience across residential and commercial glazing." },
            { n: "02", t: "Detail", b: "Edges. Seams. Dust. The things you don't see are the things we get right." },
            { n: "03", t: "Customer focus", b: "We say what's actually needed, not what makes the largest invoice. Repeat work and referrals are the test." },
            { n: "04", t: "Reliability", b: "Quoted timelines met. Tidy installs. Manufacturer-backed warranties — up to 15 years." },
          ].map((v) => (
            <div className="value reveal" key={v.n}>
              <div className="value__num">— {v.n}</div>
              <h3 className="value__title">{v.t}</h3>
              <p className="value__body">{v.b}</p>
            </div>
          ))}
        </div>
      </section>

      <Stats />

      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">
              Visit our <em>showcase</em>,<br />or just call.
            </h2>
            <div className="cta__side">
              <p className="t-lede">A look at recent installs across Scotland. Or skip the browsing — pick up the phone.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/showcase" className="btn">Showcase <span className="arr" /></Link>
                <Link href="tel:+447395009701" className="btn btn--ghost">+44 73 9500 9701</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
