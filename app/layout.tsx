import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Window Tint Company® — Specialist Window Film across Scotland | Edinburgh · Glasgow · Fife",
    template: "%s · Window Tint Company® Scotland",
  },
  description:
    "Scotland's specialist window film installer. Based in Dunfermline, covering Edinburgh, Glasgow, Fife, Stirling, Perth and across Scotland. Solar control, privacy, anti-glare, safety and decorative films. Surveyed on site. Installed for life.",
  keywords: [
    "window tinting Scotland",
    "window film Edinburgh",
    "window tinting Glasgow",
    "window film Dunfermline",
    "window film Fife",
    "solar control film Scotland",
    "privacy film Edinburgh",
    "anti-glare film Glasgow",
    "safety film Scotland",
    "home window tinting Scotland",
    "commercial window film Scotland",
    "frosted window film Edinburgh",
  ],
  metadataBase: new URL("https://windowtintcompany.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Window Tint Company® — Specialist Window Film across Scotland",
    description:
      "Solar, privacy, security and decorative window films installed across Scotland. Dunfermline-based. Edinburgh · Glasgow · Fife · Stirling · Perth.",
    url: "https://windowtintcompany.co.uk",
    siteName: "Window Tint Company®",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Window Tint Company® — Specialist Window Film across Scotland",
    description:
      "Solar, privacy, security and decorative window films installed across Scotland from our Dunfermline studio.",
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32" },
      { url: "/brand/favicon-192.png", sizes: "192x192" },
    ],
    apple: [{ url: "/brand/favicon-180.png", sizes: "180x180" }],
  },
  other: {
    "geo.region": "GB-SCT",
    "geo.placename": "Dunfermline, Fife, Scotland",
    "geo.position": "56.0719;-3.4393",
    ICBM: "56.0719, -3.4393",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${instrumentSerif.variable} ${hanken.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          theme="light"
          richColors
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FBF8F2",
              border: "1px solid rgba(14,20,17,0.12)",
              color: "#0E1411",
            },
          }}
        />
      </body>
    </html>
  );
}
