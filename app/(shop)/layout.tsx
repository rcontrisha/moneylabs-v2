// app/(shop)/layout.tsx
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import AdminFab from "@/components/shared/admin-fab";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar cuma bakal nampil di area toko jualan wir */}
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>

      {/* Footer juga cuma nampil di sini */}
      <Footer />
      
      {/* Tombol sakti admin cuma muncul di area shop */}
      <AdminFab />
    </div>
  );
}