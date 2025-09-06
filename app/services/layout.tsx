import { Navbar } from "@/app/(marketing)/_components/navbar";
import { Footer } from "@/app/(marketing)/_components/footer";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div>{children}</div>
      <Footer />
    </div>
  );
} 