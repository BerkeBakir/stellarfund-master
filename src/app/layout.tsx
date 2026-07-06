import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { I18nProvider } from "@/i18n/I18nProvider";
import FeedbackForm from "@/components/FeedbackForm";
import WalletRestore from "@/components/WalletRestore";
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
  title: "StellarFund — cross-border crowdfunding on Stellar",
  description:
    "Fund anyone, anywhere. XLM milestone escrow on Stellar mainnet — refunds enforced by code.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <WalletRestore />
          {children}
          <FeedbackForm />
        </I18nProvider>
        <Toaster theme="dark" position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
