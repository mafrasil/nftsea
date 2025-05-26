import type { Metadata } from "next";
import { Cinzel, Open_Sans } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import QueryProvider from "@/components/providers/query-provider";
import { GradientBackground } from "@/components/ui/gradient-background";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../wagmi";
import { Providers } from "./providers";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFT Sea - Create and Explore NFTs",
  description: "Mint and explore NFTs on the blockchain",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );

  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${cinzel.variable} dark antialiased min-h-screen relative`}
      >
        <QueryProvider>
          <GradientBackground />
          <Providers initialState={initialState}>
            <Header />
            <main className="relative z-10">{children}</main>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
