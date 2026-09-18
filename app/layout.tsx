import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recevia",
  description: "Luo yrityksellesi AI-vastaanottaja muutamassa minuutissa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className="font-ui min-h-screen">{children}</body>
    </html>
  );
}
