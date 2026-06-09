import React from "react";
import ThemeProvider from "@/components/theme-provider";
import "./globals.css";
import "@/styles/theme.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
