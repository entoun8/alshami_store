import Footer from "@/components/layout/root_layout/Footer";
import Header from "@/components/layout/root_layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
