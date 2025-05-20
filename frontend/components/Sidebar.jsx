"use client";

import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Receipt,
  ChartNoAxesCombined,
  UserRoundCog,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./DarkMode";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/redux/auth-slice";
import Swal from "sweetalert2";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        router.push("/");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    });
  };

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
    {
      href: "/",
      icon: <LogOut size={30} />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <aside className="border-r w-full min-h-[70vh]">
      <div className="flex flex-col items-center justify-center w-full">
        <ul className="w-full">
          <li className="flex p-3 lg:p-6 lg:hidden items-center text-black dark:text-white text-center hover:bg-green-700 transition-colors">
            <ModeToggle />
          </li>
          {links.map(({ href, icon, label, onClick }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={(e) => {
                  if (onClick) {
                    e.preventDefault(); // prevent normal navigation
                    onClick();
                  }
                }}
                className={`flex gap-2 text-xl font-bold p-2 md:p-3 lg:p-6 mt-5 lg:mt-3 mb-3 items-center text-black dark:text-white text-center hover:bg-green-700 transition-colors ${
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
