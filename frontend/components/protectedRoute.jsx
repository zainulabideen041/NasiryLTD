"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const publicRoutes = ["/", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/");
      } else {
        setShouldRender(true);
      }
    }
  }, [isAuthenticated, isLoading, isClient, isPublicRoute, router]);

  if (!isClient || isLoading || (!isAuthenticated && !isPublicRoute)) {
    return (
      <>
        {children}
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Loading />
        </div>
      </>
    );
  }

  return shouldRender ? children : null;
};

export default ProtectedRoute;
