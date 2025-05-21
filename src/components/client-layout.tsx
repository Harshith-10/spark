"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { motion } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const hideLayout = pathname === '/' || 
                     pathname === '/login' || 
                     pathname === '/register' || 
                     pathname === '/reset-password';

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={() => setIsOpen(!isOpen)} isSidebarOpen={isOpen}/>
      <div className="flex">
        <Sidebar isOpen={isOpen}/>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-200 ${isOpen ? "ml-64" : "ml-0"}`}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}