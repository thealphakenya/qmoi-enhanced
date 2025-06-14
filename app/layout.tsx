import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingAQ } from "@/components/FloatingAQ"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alpha-Q AI - Enhanced AI Development Platform",
  description: "Create games, animations, movies, music, and architecture with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FloatingAQ />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
