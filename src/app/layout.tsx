'use client';

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const hideLayout = pathname === '/' || pathname === '/login' || pathname === '/register';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="spark-theme"
        >
          {hideLayout ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <div className="min-h-screen bg-background">
              <Header toggleSidebar={() => setIsOpen(!isOpen)} isSidebarOpen={isOpen} />
              <div className="flex">
                <Sidebar isOpen={isOpen} />
                <motion.main
                  className={`flex-1 p-4 md:p-6 pt-4 transition-all duration-300 ${isOpen ? 'md:ml-64' : ''
                    }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.main>
                <Toaster />
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
