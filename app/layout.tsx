import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iron Throne | MMO-RP Westeros",
  description: "Rejoignez la lutte pour le Trône de Fer. Trahison, guerre et diplomatie en temps réel.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased selection:bg-noble-gold/30`}
      >
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}

