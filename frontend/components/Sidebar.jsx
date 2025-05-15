"use client";

import {
  LayoutDashboard,
  Receipt,
  ChartNoAxesCombined,
  UserRoundCog,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./DarkMode";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard size={30} />,
      label: "Dashboard",
    },
    { href: "/bills", icon: <Receipt size={30} />, label: "Bills" },
    {
      href: "/analytics",
      icon: <ChartNoAxesCombined size={30} />,
      label: "Analytics",
    },
    { href: "/profile", icon: <UserRoundCog size={30} />, label: "Profile" },
    { href: "/logout", icon: <LogOut size={30} />, label: "Logout" },
  ];

  return (
    <aside className="border-r w-full min-h-[70vh]">
      <div className="flex flex-col items-center justify-center w-full">
        <ul className="w-full">
          <li className="flex p-3 lg:p-6 lg:hidden items-center text-black dark:text-white text-center hover:bg-green-700 transition-colors">
            <ModeToggle />
          </li>
          {links.map(({ href, icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex gap-3 text-xl font-bold p-3 lg:p-6 mt-5 lg:mt-3 mb-3 items-center text-black dark:text-white text-center hover:bg-green-700 transition-colors ${
                  pathname === href ? "bg-green-700 text-white" : ""
                }`}
              >
                {icon}
                <span className="hidden xl:inline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
