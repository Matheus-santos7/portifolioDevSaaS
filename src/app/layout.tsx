import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getCanonicalSiteUrlObject } from "@/core/utils/site/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getCanonicalSiteUrlObject(),
  applicationName: "Portifolio DEV SaaS",
  title: {
    default: "Portifolio DEV SaaS",
    template: "%s · Portifolio DEV SaaS",
  },
  description:
    "Portifolio DEV SaaS e a plataforma para criar, editar e publicar portfolios de desenvolvedores em um link publico com dashboard proprio.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Portifolio DEV SaaS",
    description:
      "Crie e publique seu portfolio de desenvolvedor com projetos, habilidades, certificados e dashboard proprio.",
    siteName: "Portifolio DEV SaaS",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
