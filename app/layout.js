import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Adjudicator's Utility Tool",
  description: "A utility tool for adjudicators in debating competitions.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  shrinkToFit: 'no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className="main-nav">
          <div className="nav-container">
            <Link href="/" className="nav-brand">Timer</Link>
            <div className="nav-links">
              <Link href="/transcribe" className="nav-link">Transcribe</Link>
              <Link href="/share" className="nav-link">Share</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
