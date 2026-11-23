import type { MetadataRoute } from "next";
import { assetUrl } from "../game/assetUrl";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: assetUrl("/"),
    name: "Dune Relay",
    short_name: "Dune Relay",
    description: "A RaidGuild match-three adventure across the kingdom.",
    start_url: assetUrl("/"),
    scope: assetUrl("/"),
    display: "standalone",
    orientation: "landscape",
    background_color: "#0b2732",
    theme_color: "#0b2732",
    icons: [
      { src: assetUrl("/icons/dune-relay-192.png"), sizes: "192x192", type: "image/png" },
      { src: assetUrl("/icons/dune-relay-512.png"), sizes: "512x512", type: "image/png" },
      { src: assetUrl("/icons/dune-relay-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
