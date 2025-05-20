"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading"; // Create a Loading component if you don't have one

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Set isClient to true once component mounts
    setIsClient(true);
  }, []);

  // Only run auth check on client-side
  if (!isClient) {
    return children; // Return children immediately during SSR
  }

  // If it's a public route, render it without authentication check
  if (isPublicRoute) {
    return children;
  }

  // During authentication check, show a loading state
  // but keep the layout structure intact
  if (isLoading) {
    return (
      <>
        {/* Return a skeleton version of your UI */}
        {children}
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Loading />
        </div>
      </>
    );
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    router.push("/");
    // Return loading while redirecting, but keep layout intact
    return (
      <>
        {children}
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Loading />
        </div>
      </>
    );
  }

  // If authenticated or public route, render normally
  return children;
};

export default ProtectedRoute;
