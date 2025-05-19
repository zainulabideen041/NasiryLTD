import { ThemeProvider } from "@/components/theme-provider";
import LayoutStructure from "@/components/layoutStructure";
import ProtectedRoute from "@/components/protectedRoute";
import { Providers } from "@/redux/provider";

import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "A modern web application built with Next.js and TailwindCSS.",
  keywords: ["Next.js", "Tailwind", "Dark Mode", "Poppins", "SEO"],
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <ProtectedRoute>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LayoutStructure>{children}</LayoutStructure>
            </ThemeProvider>
          </ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
