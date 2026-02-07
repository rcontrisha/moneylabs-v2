export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
       {/* Nanti di sini Navbar/Sidebar */}
      {children}
    </section>
  );
}