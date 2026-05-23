import { db } from "@/lib/db";

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressShort: string;
  instagram: string;
  googleMapsUrl: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
};

const FALLBACK: SiteSettings = {
  siteName: "Window Tint Company®",
  siteTagline: "Light. Privacy. Engineered — across Scotland.",
  phone: "+44 73 9500 9701",
  whatsapp: "447395009701",
  email: "hello@windowtintcompany.co.uk",
  address: "48 Craigston Park, Dunfermline KY12 0XZ",
  addressShort: "Dunfermline · Edinburgh · Glasgow · all of Scotland",
  instagram: "@windowtintcompany",
  googleMapsUrl: "https://www.google.com/search?kgmid=/g/11y79xzn9n",
  heroEyebrow:
    "Specialist window film · Scotland-wide · residential & commercial",
  heroHeadline: "We don't darken your rooms. We engineer their light.",
  heroSubhead:
    "Precision-installed window film from our Dunfermline studio — across Edinburgh, Glasgow, Fife and the whole of Scotland. Surveyed on site. Specified to the glass. Installed for life.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...FALLBACK, ...map } as SiteSettings;
  } catch {
    return FALLBACK;
  }
}
