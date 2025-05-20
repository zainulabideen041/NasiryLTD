"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { checkAuth } from "@/redux/auth-slice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const publicRoutes = ["/", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // ✅ Dispatch auth check on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Handle redirects based on auth status
  useEffect(() => {
    if (!isLoading && isClient) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/");
      } else if (isAuthenticated && isPublicRoute) {
        router.push("/dashboard");
      } else {
        setShouldRender(true);
      }
    }
  }, [isAuthenticated, isLoading, isClient, isPublicRoute, router]);

  // ✅ Show loading overlay while checking auth
  if (!isClient || isLoading) {
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
