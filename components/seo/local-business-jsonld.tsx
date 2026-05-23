import type { SiteSettings } from "@/lib/settings";

export function LocalBusinessJsonLd({ settings }: { settings: SiteSettings }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://windowtintcompany.co.uk/#business",
    name: settings.siteName,
    description:
      "Specialist window film installation across Scotland — solar control, privacy, anti-glare, safety and decorative films.",
    url: "https://windowtintcompany.co.uk",
    telephone: settings.phone,
    email: settings.email,
    image: "https://windowtintcompany.co.uk/og.jpg",
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "48 Craigston Park",
      addressLocality: "Dunfermline",
      addressRegion: "Fife",
      postalCode: "KY12 0XZ",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 56.0719,
      longitude: -3.4393,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Scotland" },
      { "@type": "City", name: "Edinburgh" },
      { "@type": "City", name: "Glasgow" },
      { "@type": "City", name: "Dunfermline" },
      { "@type": "City", name: "Stirling" },
      { "@type": "City", name: "Perth" },
      { "@type": "City", name: "Aberdeen" },
      { "@type": "City", name: "Dundee" },
      { "@type": "AdministrativeArea", name: "Fife" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: [settings.googleMapsUrl, `https://instagram.com/${settings.instagram.replace("@", "")}`],
    knowsAbout: [
      "Solar Control Window Film",
      "Privacy Window Film",
      "Anti-Glare Window Film",
      "Safety and Security Window Film",
      "Decorative Window Film",
      "Frosted Manifestation",
      "Heat Reduction Film",
      "UV Protection Film",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
