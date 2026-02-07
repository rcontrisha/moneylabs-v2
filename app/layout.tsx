import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 👇 Import komponen yang baru kita bikin tadi
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

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
        <div className="flex min-h-screen flex-col">
          {/* 1. Navbar nempel di atas */}
          <Navbar />
          
          {/* 2. Konten halaman (Page.tsx) bakal ngerender di sini */}
          <main className="flex-1">
            {children}
          </main>

          {/* 3. Footer nempel di bawah */}
          <Footer />
        </div>
      </body>
    </html>
  );
}