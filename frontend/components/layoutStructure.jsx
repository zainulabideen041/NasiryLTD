"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./footer";
import { usePathname } from "next/navigation";

const LayoutStructure = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 bg-[var(--background)] z-2">
        <Navbar />
      </nav>
      <div
        className={`flex z-1 flex-row ${
          pathname === "/" ? "justify-center" : ""
        }`}
      >
        {pathname === "/" ? (
          <></>
        ) : (
          <div className="w-[15%] min-h-[75vh]">
            <div className="w-full sticky top-60 lg:top-50 bg-[var(--background)]">
              <Sidebar />
            </div>
          </div>
        )}
        <div className="overflow-hidden w-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default LayoutStructure;
