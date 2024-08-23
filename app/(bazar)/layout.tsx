import { Navbar } from "../(marketing)/_components/navbar";
import { Footer } from "@/app/(marketing)/_components/footer";


const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer/>
    </div>
   );
}
 
export default MarketingLayout;