"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "@/redux/auth-slice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/") {
        router.replace("/");
      }

      if (isAuthenticated && pathname === "/") {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) return null;

  return children;
};

export default ProtectedRoute;
