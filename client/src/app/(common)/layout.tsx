import Footer from "@/Components/HomeComponents/Footer/footer";
import Navbar from "@/Components/HomeComponents/Navbar/Navbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
