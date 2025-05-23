"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

const LayoutStructure = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 bg-[var(--background)]">
        <Navbar />
      </nav>
      <div
        className={`flex flex-row ${pathname === "/" ? "justify-center" : ""}`}
      >
        {pathname === "/" ? (
          <></>
        ) : (
          <div className="w-[15%]">
            <div className="w-full sticky top-60 lg:top-50 bg-[var(--background)]">
              <Sidebar />
            </div>
          </div>
        )}
        <div className="overflow-hidden w-full">{children}</div>
      </div>
    </div>
  );
};

export default LayoutStructure;
