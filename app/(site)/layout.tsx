import { Nav } from "@/components/site/nav";
import { EditorialFooter } from "@/components/site/editorial-footer";
import { WhatsAppFloater } from "@/components/site/whatsapp-floater";
import { ChatWidget } from "@/components/site/chat-widget";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";
import { getSiteSettings } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <div className="shell">
      <LocalBusinessJsonLd settings={settings} />
      <Nav phone={settings.phone} />
      <main>{children}</main>
      <EditorialFooter settings={settings} />
      <WhatsAppFloater number={settings.whatsapp} />
      <ChatWidget />
    </div>
  );
}
