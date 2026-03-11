// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyLabs | Premium Sneakers",
  description: "Authentic sneakers marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Root Layout cuma ngerender children tanpa embel-embel wir! */}
        {children}
      </body>
    </html>
  );
}