import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { assetUrl } from "../game/assetUrl";
import "./style.css";

const production = "https://portal-artifacts-production.up.railway.app/dune-relay/";
const title = "Dune Relay — A RaidGuild Match-Three Adventure";
const description = "Restore the waterway and travel across the kingdom in a RaidGuild match-three adventure.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(production),
  manifest: assetUrl("/manifest.webmanifest"),
  icons: {
    icon: [{ url: assetUrl("/icons/dune-relay-192.png"), sizes: "192x192", type: "image/png" }, { url: assetUrl("/icons/dune-relay-512.png"), sizes: "512x512", type: "image/png" }],
    apple: [{ url: assetUrl("/icons/dune-relay-apple-180.png"), sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: "Dune Relay", statusBarStyle: "black-translucent" },
  alternates: { canonical: production },
  openGraph: {
    type: "website", siteName: "RaidGuild Portal Artifacts", url: production,
    title, description,
    images: [{ url: `${production}dune-relay-social-v1.png`, width: 1200, height: 630, alt: "Dune Relay illustrated title screen with the desert oasis" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${production}dune-relay-social-v1.png`] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0b2732" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const artwork = {
    "--oasis-image": `url('${assetUrl("/oasis.webp")}')`,
    "--caravan-image": `url('${assetUrl("/caravan.webp")}')`,
    "--gatehouse-image": `url('${assetUrl("/gatehouse.webp")}')`,
    "--farmland-image": `url('${assetUrl("/farmland.webp")}')`,
    "--town-image": `url('${assetUrl("/town.webp")}')`,
    "--castle-image": `url('${assetUrl("/castle.webp")}')`,
    "--river-image": `url('${assetUrl("/river-boat.webp")}')`,
    "--collection-image": `url('${assetUrl("/collection-station.webp")}')`,
    "--sluice-image": `url('${assetUrl("/sluice.webp")}')`,
  } as CSSProperties;
  return <html lang="en"><body style={artwork}>{children}</body></html>;
}
