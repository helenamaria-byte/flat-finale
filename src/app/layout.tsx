import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import Skyline from "@/components/Skyline";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlatMatch: find a flat all three of you can live with",
  description: "Each flatmate fills in a private form. You get 2–3 flats with a clear view of who gets what and who gives up what.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col font-sans">
        <Skyline />
        <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
              <rect x="4" y="9" width="20" height="17" rx="2" fill="#1f5c58" />
              <path d="M2 11 L14 2 L26 11" fill="none" stroke="#c65f3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="13" width="4" height="4" rx="1" fill="#f6c56b" />
              <rect x="16" y="13" width="4" height="4" rx="1" fill="#f6c56b" />
              <rect x="12" y="20" width="4" height="6" rx="1" fill="#f6c56b" />
            </svg>
            FlatMatch
          </Link>
          <span className="hidden text-sm text-muted sm:block">Three people, one flat, no surprises</span>
        </header>
        <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-48 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
