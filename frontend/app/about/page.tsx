import type { Metadata } from "next";
import AboutModal from "@/components/about/AboutModal";

export const metadata: Metadata = {
  title: "About — Jnana AI | Sacred Dialogue with Sri Krishna",
  description:
    "Discover the philosophy, origin, and commitment behind Jnana AI: a sacred dialogue with Sri Krishna for your modern Kurukshetra, grounded in 701 canonical Gita verses with zero hallucination.",
};


export default function AboutPage() {
  return <AboutModal isPage={true} />;
}
