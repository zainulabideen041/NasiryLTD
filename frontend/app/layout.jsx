import { ThemeProvider } from "@/components/theme-provider";
import LayoutStructure from "@/components/layoutStructure";
import ProtectedRoute from "@/components/protectedRoute";
import { Providers } from "@/redux/provider";

import "./globals.css";

export const metadata = {
  title: "Nasiry Dashboard",
  description: "Nasiry LTD Dashboard.",
  keywords: [
    "nasiry.ltd",
    "nasiry ltd",
    "nasiry meat shop",
    "nasiry dashboard",
    "meat shops uk",
  ],
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
