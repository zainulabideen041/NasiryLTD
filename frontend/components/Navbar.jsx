"use client";

import { ModeToggle } from "./DarkMode";
import { Phone, MapPin } from "lucide-react";
// import { useTheme } from "next-themes";
import Image from "next/image";

const Navbar = () => {
  // const { theme } = useTheme();

  // const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-black.png";

  return (
    <nav className="flex flex-col">
      <main className="flex justify-center text-center items-center">
        <Image
          src="/hen.png"
          alt=""
          width={80}
          height={100}
          className="dark:invert ml-1"
        />
        <div className="flex flex-col items-center pt-2 pb-2 pl-1 pr-1">
          <div className="relative">
            <Image
              src="/logo-black.png"
              alt=""
              width={200}
              height={100}
              className="dark:invert w-35 lg:w-60"
            />
            <span className="absolute top-1 left-35 lg:left-60 text-[10px] text-white bg-black px-1 rounded-sm dark:bg-white dark:text-black">
              LTD
            </span>
          </div>
          <p className="text-sm sm:text-xl font-light p-2 lg:text-2xl">
            Wholesale & Retail of Fresh Quality Halal Meat & Poultry
          </p>
        </div>
        <Image
          src="/sheep.png"
          alt=""
          width={100}
          height={100}
          className="dark:invert mr-1"
        />
        <div className="hidden lg:block absolute right-15">
          <ModeToggle />
        </div>
      </main>
      <div className="border flex flex-row flex-wrap justify-around p-2">
        <p className="flex text-[var(--ring)] text-sm lg:font-semibold sm:text-md sm:font-light lg:text-lg items-center">
          <span className="mr-1">
            <Phone size={20} className="w-4 md:w-5" />
          </span>
          +44 755 455 655
        </p>
        <p className="flex text-[var(--ring)] text-sm lg:font-semibold sm:text-sm sm:font-light lg:text-lg items-center">
          <span className="mr-1">
            <Phone size={20} className="w-4 md:w-5" />
          </span>
          +44 755 455 655
        </p>
        <p className="flex text-[var(--ring)] text-sm lg:font-semibold sm:text-sm sm:font-light lg:text-lg items-center">
          <span className="mr-1">
            <MapPin size={20} className="w-4 md:w-5" />
          </span>
          UK, London
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
