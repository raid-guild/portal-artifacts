import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { assetUrl } from "../game/assetUrl";
import "./style.css";

const production = "https://portal-artifacts-production.up.railway.app/dune-relay/";
const title = "Dune Relay — A RaidGuild Match-Three Adventure";
const description = "Restore an oasis, guide the desert caravan, and open the river gatehouse in a three-chapter match-three adventure.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(production),
  alternates: { canonical: production },
  openGraph: {
    type: "website", siteName: "RaidGuild Portal Artifacts", url: production,
    title, description,
    images: [{ url: `${production}dune-relay-social-v1.png`, width: 1200, height: 630, alt: "Dune Relay illustrated title screen with the desert oasis" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${production}dune-relay-social-v1.png`] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const artwork = {
    "--oasis-image": `url('${assetUrl("/oasis.webp")}')`,
    "--caravan-image": `url('${assetUrl("/caravan.webp")}')`,
    "--gatehouse-image": `url('${assetUrl("/gatehouse.webp")}')`,
    "--sluice-image": `url('${assetUrl("/sluice.webp")}')`,
  } as CSSProperties;
  return <html lang="en"><body style={artwork}>{children}</body></html>;
}
