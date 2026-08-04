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
  title: "Hielos & Bebidas Z² | Delivery 24/7 de Hielos Gourmet & Licores",
  description: "Hielo gourmet en esferas de cristal, cubos purificados, whiskies de colección, vinos reservas y licores finos con delivery express 24 horas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-brand-950 text-brand-50 transition-colors duration-300 relative">
        {children}
      </body>
    </html>
  );
}
