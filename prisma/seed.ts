import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@windowtintcompany.co.uk";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await db.user.upsert({
    where: { email },
    update: { passwordHash, name: "Studio Admin", role: "admin" },
    create: {
      email,
      passwordHash,
      name: "Studio Admin",
      role: "admin",
      bio: "Editor-in-chief at Window Tint Company®, Dunfermline. Writes about light, privacy, and the craft of installation across Scotland.",
    },
  });

  const services = [
    {
      slug: "solar-control-film",
      name: "Solar Control",
      tagline: "Cooler rooms. Lower bills. No compromise on view.",
      shortDesc:
        "Engineered films that reject solar heat before it enters the glass — keeping interiors cool without darkening the room.",
      description: `<p>Solar control film is a transparent, microthin laminate that bonds to existing glass and rejects the infrared and ultraviolet wavelengths responsible for heat gain and fade — while passing nearly all visible light.</p><p>We specify ceramic and spectrally selective films from suppliers including 3M, LLumar and Solar Gard. Each installation across Edinburgh, Glasgow, Fife and the rest of Scotland begins with a glass survey and an irradiance reading, so you receive a quote tied to your building, not a brochure average.</p><h3>Where it works best</h3><p>South and west elevations on Scottish residential and commercial properties; conservatories and sunrooms; glazed offices and atria; listed Georgian and Edwardian buildings in the New Town and West End where external shading is forbidden.</p>`,
      icon: "Sun",
      features: JSON.stringify([
        { title: "Heat rejection up to 78%", description: "Measured at the glass on standard 4mm float." },
        { title: "99% UV blocked", description: "Protects flooring, art, and upholstery from fade." },
        { title: "Glare reduction 30–80%", description: "Tunable to your room and use case." },
        { title: "View preserved", description: "Spectrally selective films keep daylight in." },
      ]),
      vlt: "35–70%",
      uvBlock: "99%",
      heatReject: "Up to 78%",
      order: 1,
    },
    {
      slug: "privacy-film",
      name: "Privacy Film",
      tagline: "Daylight in. Eyes out.",
      shortDesc:
        "One-way mirrored, frosted, and switchable films that put you back in control of who sees what.",
      description: `<p>From bathroom obscurity to one-way reflective films for ground-floor flats, our privacy range solves the oldest problem in glass: being seen.</p><p>We carry frosted, etched-pattern, gradient, blackout, and daylight one-way films. Each is tested on a sample of your glass before full install so you can confirm the look in your own light.</p>`,
      icon: "EyeOff",
      features: JSON.stringify([
        { title: "True 24/7 obscurity", description: "Frosted and blackout films don't reverse at night." },
        { title: "Daylight one-way option", description: "Reflective face outside, clear from inside — in daylight only." },
        { title: "Designs & gradients", description: "From minimal frost bands to bespoke etched patterns." },
        { title: "Removable & reapplyable", description: "Renters and short-let landlords love this." },
      ]),
      vlt: "0–60%",
      order: 2,
    },
    {
      slug: "decorative-film",
      name: "Decorative Film",
      tagline: "Glass as a surface, not just an opening.",
      shortDesc:
        "Etched, frosted, coloured and patterned films for partitions, doors, branding, and architectural detail.",
      description: `<p>Treat glass as a finish. Decorative film transforms partitions, balustrades, doors and feature panels into branded, patterned, or sculpted surfaces — all reversibly.</p><p>We work with architects and interior designers on bespoke gradient bands, dot-fade matrices, logo etches, and full-coverage stained-glass effects.</p>`,
      icon: "Sparkles",
      features: JSON.stringify([
        { title: "Bespoke pattern cutting", description: "CNC-cut on our own plotter to ±0.2mm." },
        { title: "Wayfinding & branding", description: "Logos, manifestation lines, and door numbers." },
        { title: "Compliant manifestation", description: "Meets Approved Document M for visibility on glass." },
        { title: "Reversible install", description: "Removable without damage to the glass." },
      ]),
      order: 3,
    },
    {
      slug: "safety-security-film",
      name: "Safety & Security",
      tagline: "Holds shattered glass in place. Buys you time.",
      shortDesc:
        "Anti-shatter and anti-intruder films that turn ordinary glass into a passive safety barrier.",
      description: `<p>A 100-micron polyester laminate that bonds glass fragments together on impact. Independently tested to EN 12600 (impact) and EN 356 (anti-bandit). We can specify all the way up to 400-micron anti-bandit assemblies for jewellers, pharmacies, and listed-building risk applications.</p>`,
      icon: "ShieldCheck",
      features: JSON.stringify([
        { title: "EN 12600 1B1 / 2B2 rated", description: "Class 1B1 with 200 micron film on toughened." },
        { title: "Smash & grab resistance", description: "Anti-bandit assemblies delay forced entry." },
        { title: "Blast mitigation option", description: "GSA-rated film + attachment systems for high-risk sites." },
        { title: "Invisible installation", description: "Optically clear — no impact on glazing aesthetic." },
      ]),
      order: 4,
    },
    {
      slug: "anti-glare-film",
      name: "Anti-Glare",
      tagline: "For screens, studios, and south-facing desks.",
      shortDesc:
        "Light-balancing films that knock back harsh sun without losing the room.",
      description: `<p>Engineered for environments where screens, monitors, or precision work meet uncontrollable daylight. We measure the glare with a photometer first, then specify the lightest film that solves it.</p>`,
      icon: "Eye",
      features: JSON.stringify([
        { title: "30–80% glare reduction", description: "Calibrated to your space and screens." },
        { title: "Neutral colour rendering", description: "No green or bronze cast." },
        { title: "Maintains daylight feel", description: "Lighter than a blackout." },
      ]),
      order: 5,
    },
    {
      slug: "frosted-manifestation",
      name: "Frosted & Manifestation",
      tagline: "Compliance, beautifully resolved.",
      shortDesc:
        "Compliant manifestation films and full-frost privacy treatments for offices and entranceways.",
      description: `<p>Document M and HSE-compliant manifestation in dot, bar, gradient or bespoke designs. Installed with optical-quality alignment by an in-house team — no overlap lines, no tape marks.</p>`,
      icon: "PanelTop",
      features: JSON.stringify([
        { title: "Compliance ready", description: "Meets Document M and HSE workplace regs." },
        { title: "Bespoke patterns", description: "From brand-tied gradients to custom dot matrices." },
        { title: "Invisible seams", description: "Optical-quality alignment on large panels." },
      ]),
      order: 6,
    },
  ];

  for (const s of services) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  const showcase = [
    {
      slug: "new-town-townhouse-solar",
      title: "Edinburgh New Town Townhouse — Solar Control without the Tint",
      client: "Private — Heriot Row",
      location: "Edinburgh EH3",
      category: "Residential",
      summary:
        "Spectrally selective film on 38 m² of single-glazed south-facing sash windows. Interior temperatures dropped 6°C at peak; original Georgian glass preserved.",
      body: `<p>The brief: cool a Heriot Row townhouse without compromising its A-listed exterior or the daylight the owners bought it for. We specified a 70% VLT spectrally selective ceramic film — invisible from the street, 62% heat rejection at the glass, and reversible.</p><h3>Numbers</h3><ul><li>38m² of single-glazed Georgian sash</li><li>2-day install, one team</li><li>6°C peak interior reduction</li><li>99% UV blocked — protecting century-old parquet</li></ul>`,
      heroImage: "/photos/job-1.jpg",
      gallery: "/photos/job-1.jpg,/photos/job-2.jpg",
      filmUsed: "3M Prestige 70",
      featured: true,
      order: 1,
    },
    {
      slug: "merchant-city-studio-privacy",
      title: "Merchant City Studio — Daylight One-Way Privacy",
      client: "Type foundry — anonymous",
      location: "Glasgow G1",
      category: "Commercial",
      summary:
        "Ground-floor design studio reclaimed its street-facing windows with a daylight reflective film. Designers see out, passersby see themselves.",
      body: `<p>The challenge with one-way film is honesty: it only works in daylight, with the inside darker than the outside. We staged a mock-up at a Merchant City studio before committing and recommended a 20% VLT silver-mirror film with a low-iron finish.</p>`,
      heroImage: "/photos/job-2.jpg",
      gallery: "/photos/job-2.jpg,/photos/job-3.jpg",
      filmUsed: "Solar Gard Silver 20",
      featured: true,
      order: 2,
    },
    {
      slug: "dunfermline-cottage-frosted",
      title: "Dunfermline Cottage — Full Frost Privacy Package",
      client: "Mr & Mrs A.",
      location: "Dunfermline, Fife",
      category: "Residential",
      summary:
        "Full perimeter privacy in dual-gradient frost on a terraced cottage near Pittencrieff Park. Reversible, installed in a single day.",
      body: `<p>A Victorian cottage with neighbours close on every side. We surveyed at dawn, dusk and noon and proposed a gradient frost — solid at chest height, fading clear above eye level — to keep the Fife sky.</p>`,
      heroImage: "/photos/job-3.jpg",
      gallery: "/photos/job-3.jpg",
      filmUsed: "LLumar NRM Gradient",
      order: 3,
    },
    {
      slug: "george-street-jeweller-security",
      title: "George Street Jeweller — Anti-Bandit Security Film",
      client: "Bespoke jeweller — Edinburgh New Town",
      location: "Edinburgh EH2",
      category: "Commercial",
      summary:
        "EN 356 P2A-rated 400-micron film + structural attachment on a fully glazed George Street shopfront. Invisible. Insurer-approved.",
      body: `<p>The brief from the insurer was specific: delay forced entry by at least three minutes against repeated hammer impact, without changing the appearance of the listed shopfront. We delivered a P2A-rated assembly with structural anchor.</p>`,
      heroImage: "/photos/job-4.jpg",
      gallery: "/photos/job-4.jpg",
      filmUsed: "LLumar Magnum 400",
      featured: true,
      order: 4,
    },
    {
      slug: "perthshire-conservatory-heat",
      title: "Perthshire Conservatory — Heat Rejection Retrofit",
      client: "Private",
      location: "Perthshire PH1",
      category: "Residential",
      summary:
        "An unusable summer room reclaimed for daily use. 75% heat rejection at the glass; the orchids survived a Perthshire June.",
      body: `<p>A single-glazed Victorian conservatory, west-facing, hitting 38°C interior on a rare hot Perthshire afternoon. We installed a high-performance ceramic film on roof and walls with a custom edge-seal for thermal-stress mitigation.</p>`,
      heroImage: "/photos/job-5.jpg",
      gallery: "/photos/job-5.jpg",
      filmUsed: "Solar Gard Quantum 38",
      order: 5,
    },
    {
      slug: "stockbridge-studio-manifestation",
      title: "Stockbridge Architects — Custom Manifestation",
      client: "Architecture practice",
      location: "Edinburgh EH3",
      category: "Commercial",
      summary:
        "Bespoke dot-matrix manifestation across 22m of internal partitions. Workplace-regulation compliant, brand-tied, beautifully aligned.",
      body: `<p>A frosted dot-matrix that fades from solid at the door height into a sparse field of dots above — referencing the practice's signature drawing style. CNC-cut and installed in two overnight sessions at their Stockbridge studio.</p>`,
      heroImage: "/photos/job-6.jpg",
      gallery: "/photos/job-6.jpg",
      filmUsed: "Bespoke cut frost",
      order: 6,
    },
  ];

  for (const p of showcase) {
    await db.showcaseProject.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  const posts = [
    {
      slug: "the-physics-of-a-cool-room",
      title: "The Physics of a Cool Room: How Solar Film Actually Works",
      excerpt:
        "Most heat from the sun isn't visible. Here's what solar film blocks, what it lets through, and why the difference matters for your electricity bill.",
      content: `<p>Solar radiation arrives at your window as roughly 53% infrared, 44% visible light, and 3% ultraviolet. The infrared portion is what you feel as heat — and crucially, it's invisible. Block it, and the room cools without darkening.</p><h2>The three things film does</h2><p>A good solar film does three jobs simultaneously: it absorbs heat at the glass, it reflects a portion of it back outside, and it passes visible light through. The trick is doing the first two without compromising the third.</p><h3>Why VLT and TSER aren't the same number</h3><p>Visible Light Transmission (VLT) is the headline spec — but Total Solar Energy Rejected (TSER) is what determines whether your room actually feels cooler. We always quote both, because a 70% VLT film can still reject 60%+ of total solar energy when it's spectrally selective.</p><h2>When film beats blinds</h2><p>Blinds intercept light inside the room, after it's already crossed the glass — meaning the heat is in the space. Film stops it at the boundary. That's why a south-facing room with film and curtains will be measurably cooler than the same room with curtains alone.</p>`,
      coverImage: "/photos/sample-1.webp",
      category: "Guide",
      tags: "solar,heat,physics",
      readingMins: 6,
      published: true,
      featured: true,
      publishedAt: new Date("2025-08-12"),
    },
    {
      slug: "privacy-film-vs-net-curtains",
      title: "Privacy Film vs Net Curtains: A Side-by-Side",
      excerpt:
        "Lace nets dim the room and dust easily. Frosted film is permanent obscurity. Here's how to choose between them — and when one-way film changes the equation.",
      content: `<p>Net curtains and privacy film solve the same problem from opposite ends of a 70-year design conversation. The right answer depends on three variables: how much daylight you'll trade, how reversible you need the change to be, and whether you care what the window looks like from outside.</p><h2>Light retention</h2><p>A bright frosted privacy film passes around 60% of visible light. A standard net curtain passes between 20 and 50% depending on weave density. In a north-facing room, this difference is decisive.</p><h2>What the neighbours see</h2><p>From outside, frosted film reads as a flat, modern, opaque surface. Nets read as fabric. Both obscure the interior — but the exterior signal is very different. In a conservation area, this is worth checking before you commit.</p>`,
      coverImage: "/photos/install-1.png",
      category: "Guide",
      tags: "privacy,frosted,curtains",
      readingMins: 4,
      published: true,
      publishedAt: new Date("2025-09-04"),
    },
    {
      slug: "anti-shatter-saved-this-shopfront",
      title: "Case Study: How Anti-Shatter Film Saved a George Street Shopfront",
      excerpt:
        "An attempted ram-raid on an Edinburgh New Town jeweller. Three minutes of attack. The glass held — because of a 400-micron film no one could see.",
      content: `<p>At 02:47 on a wet Thursday in February, a Volkswagen Touareg reversed at speed into the shopfront of an Edinburgh New Town jeweller we'd treated four years earlier. The driver and two accomplices then attacked the glass with sledgehammers and a felling axe on George Street.</p><h2>The film held for the duration of the attack</h2><p>The 400-micron security film, mechanically anchored to the listed frame via a 4-side wet-glaze attachment, kept the glass in place long enough for the silent alarm to summon a Police Scotland response. The attackers fled empty-handed.</p><h2>What the surveillance footage taught us</h2><p>Anti-bandit film doesn't make glass unbreakable — it makes it stay where it is when broken. The visual cue that there's no easy entry is, for most opportunist attackers, the end of the attempt.</p>`,
      coverImage: "/photos/before-after.png",
      category: "Case Study",
      tags: "security,case-study,commercial",
      readingMins: 5,
      published: true,
      featured: true,
      publishedAt: new Date("2025-10-18"),
    },
    {
      slug: "the-day-our-installer-met-the-king",
      title: "Behind the Scenes: A Day with a Window Tint Installer",
      excerpt:
        "A 6am van load. A Stockbridge townhouse. 22m² of single-glazed sash, two installers, one squeegee. Here's what a perfect install actually looks like.",
      content: `<p>Watch a master installer for a day and the thing you notice is silence. There is no scraping, no peeling-back-to-fix, no second attempt. The film goes on once, and it goes on right.</p><h2>The hour before</h2><p>Every install starts with the same ritual: glass cleaned three times, the room dustless, the squeegee margins padded with a fresh microfibre. Most install failures are dust failures.</p>`,
      coverImage: "/photos/install-2.png",
      category: "News",
      tags: "team,install,craft",
      readingMins: 4,
      published: true,
      publishedAt: new Date("2025-11-02"),
    },
    {
      slug: "five-films-five-rooms",
      title: "Five Films, Five Rooms: An Inspiration Tour",
      excerpt:
        "Where would you put gradient frost? Where does a dichroic film earn its price? A short tour through five domestic specifications.",
      content: `<p>Window film is not one product. It is twenty product families and a hundred SKUs. Here is how five real rooms found their match.</p><h2>1. The bathroom</h2><p>Solid frost. Always. The compromise rooms are elsewhere.</p><h2>2. The ground-floor kitchen</h2><p>Gradient frost — solid at sink height, fading clear above eye level. You keep the sky.</p><h2>3. The home office facing south</h2><p>Spectrally selective at 50–70% VLT. You keep the daylight and lose the heat.</p><h2>4. The hallway side-light</h2><p>Dichroic film. Yes, it's expensive. Yes, it changes the room three times a day.</p><h2>5. The roof lantern</h2><p>Ceramic at 35% VLT, with a thermal-stress check first. Nothing else handles the angle of incidence at noon in July.</p>`,
      coverImage: "/photos/sample-2.jpg",
      category: "Inspiration",
      tags: "ideas,rooms,specification",
      readingMins: 5,
      published: true,
      publishedAt: new Date("2025-11-22"),
    },
    {
      slug: "why-we-survey-before-we-quote",
      title: "Why We Survey Every Window Before We Quote",
      excerpt:
        "Brochure quotes are guesses. Here's what we measure on a real survey — and why a £40 visit saves five-figure mistakes.",
      content: `<p>Every quote we issue is preceded by an on-site survey. This is not a sales call. It's a 45-minute technical visit during which we measure six things — and what we find changes the specification more than half the time.</p><h2>What we measure</h2><ol><li>Glass thickness and lamination</li><li>Frame depth and edge condition</li><li>Solar irradiance at peak hour</li><li>Interior temperature differential</li><li>Aspect and overhang shading</li><li>Glass type (low-E, tinted, toughened, laminated)</li></ol><h2>Why it matters</h2><p>A spectrally selective film on a low-E coated pane can fail by thermal stress. A dark film on toughened glass over 6mm can crack the pane. A reflective film on a north-facing window is money set on fire. None of these calls can be made from a phone enquiry.</p>`,
      coverImage: "/photos/sample-3.jpg",
      category: "Guide",
      tags: "survey,process,quote",
      readingMins: 5,
      published: true,
      publishedAt: new Date("2025-12-08"),
    },
  ];

  for (const p of posts) {
    await db.post.upsert({
      where: { slug: p.slug },
      update: { ...p, authorId: admin.id },
      create: { ...p, authorId: admin.id },
    });
  }

  const settings: Array<{ key: string; value: string }> = [
    { key: "siteName", value: "Window Tint Company®" },
    { key: "siteTagline", value: "Light. Privacy. Engineered — across Scotland." },
    { key: "phone", value: "+44 73 9500 9701" },
    { key: "whatsapp", value: "447395009701" },
    { key: "email", value: "hello@windowtintcompany.co.uk" },
    { key: "address", value: "48 Craigston Park, Dunfermline KY12 0XZ" },
    { key: "addressShort", value: "Dunfermline · Edinburgh · Glasgow · all of Scotland" },
    { key: "instagram", value: "@windowtintcompany" },
    { key: "googleMapsUrl", value: "https://www.google.com/search?kgmid=/g/11y79xzn9n" },
    {
      key: "heroEyebrow",
      value: "Specialist window film · Scotland-wide · residential & commercial",
    },
    {
      key: "heroHeadline",
      value: "We don't darken your rooms. We engineer their light.",
    },
    {
      key: "heroSubhead",
      value:
        "Precision-installed window film from our Dunfermline studio — across Edinburgh, Glasgow, Fife and the whole of Scotland. Surveyed on site. Specified to the glass. Installed for life.",
    },
  ];

  for (const s of settings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Seeded. Admin email:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
