import { Navbar } from "./_components/navbar";


const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <body className="bg-background min-h-screen">
      <div className="h-full dark:bg-[#1F1F1F]">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    </body>
   );
}
 
export default MarketingLayout;