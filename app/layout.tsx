import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Recevia",
  description: "AI-vastaanottaja, joka muuttaa viestit ajanvarauksiksi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className={`${sans.variable} font-sans min-h-screen`}>{children}</body>
    </html>
  );
}
