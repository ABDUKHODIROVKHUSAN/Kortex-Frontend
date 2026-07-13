import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import { getServerLocale } from "@/lib/preferences/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Kortex — Ask your documents anything",
  description: "AI Document Intelligence Platform powered by RAG",
  icons: { icon: "/kortex-icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getServerLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
