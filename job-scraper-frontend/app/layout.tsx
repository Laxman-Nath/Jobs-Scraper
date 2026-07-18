"use client";

import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Providers from "./providers";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";


const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${jakarta.variable} ${plexMono.variable} font-body bg-base text-ink flex flex-col min-h-screen`}
      >
        <Providers>
          {!isAdminRoute && <Header/>}
          <div className="flex-1">{children}</div>
          {!isAdminRoute && <Footer />}
        </Providers>
      </body>
    </html>
  );
}