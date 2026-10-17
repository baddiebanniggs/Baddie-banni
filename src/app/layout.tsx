import type { Metadata } from "next";
import { Syne, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Syne({ subsets: ["latin"], weight: ["800"], variable: "--f-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--f-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "BADDIE BANNI", template: "%s | BADDIE BANNI" },
  description: "BADDIE BANNI clothing.",
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="bar">
          <a className="logo" href="/">BADDIE BANNI</a>
          <nav aria-label="Main"><a href="/shop">Shop</a><a href="/account">Account</a><a href="/cart">Bag</a></nav>
        </header>
        {children}
        <footer className="foot">Contact, policies and legal details are set in the admin settings before launch.</footer>
      </body>
    </html>
  );
}
