import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, Plus_Jakarta_Sans, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-sanskrit",
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "jnana.ai — Walk with Krishna through your Modern Kurukshetra",
  description: "AI-Powered Wisdom Companion grounded strictly in the 701 Sacred Verses of the Bhagavad Gita.",
  icons: {
    icon: [
      { url: "/icon.png?v=4", type: "image/png" },
      { url: "/icon.svg?v=4", type: "image/svg+xml" },
      { url: "/favicon.ico?v=4" }
    ],
    apple: "/apple-icon.png?v=4"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cinzelDecorative.variable} ${plusJakartaSans.variable} ${notoSerifDevanagari.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#221F1B] font-sans selection:bg-[#E5A93C]/30 selection:text-[#FFD782]">
        {children}
      </body>
    </html>
  );
}
