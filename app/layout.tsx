import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { PasscodeLock } from "@/components/PasscodeLock";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Ospyr Jewellery OS - the operating system for jewellery businesses",
    template: "%s · Ospyr Jewellery OS",
  },
  description:
    "One calm command center for a jewellery showroom: studio photos, catalog, gold estimates, enquiry CRM, savings schemes, festive campaigns, reviews, AI content and an email concierge - built by Ospyr.",
  applicationName: "Ospyr Jewellery OS",
  authors: [{ name: "Ospyr", url: "https://www.ospyr.com" }],
  keywords: [
    "jewellery software",
    "jewellery CRM",
    "gold price calculator",
    "jewellery marketing",
    "PSG Gold",
    "Ospyr",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PasscodeLock>{children}</PasscodeLock>
      </body>
    </html>
  );
}
