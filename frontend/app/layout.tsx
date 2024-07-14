import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/shared/Layout";
import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "OrdoBc",
  description: "Dapp d'odonnance numérique sur la blockchain Base"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="app" suppressHydrationWarning={true}>
        <RainbowKitAndWagmiProvider>
          <Layout>
            {children}
            <Toaster />
          </Layout>
        </RainbowKitAndWagmiProvider>

      </body>
    </html>
  );
}
