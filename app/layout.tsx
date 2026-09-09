import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unlimitedenergysystems.com"),
  title: "Unlimited Energy Systems | Solar & Clean Energy",
  description: "Engineered solar, battery storage and hybrid power systems for Nigerian homes and businesses.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "Unlimited Energy Systems",
    title: "Unlimited Energy Systems | Solar & Clean Energy",
    description: "Engineered solar, battery storage and hybrid power systems for Nigerian homes and businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlimited Energy Systems | Solar & Clean Energy",
    description: "Engineered solar, battery storage and hybrid power systems for Nigerian homes and businesses.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
