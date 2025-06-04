"use client";

import React, {useState, useEffect} from "react";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/hooks/use-media-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import {motion} from "framer-motion";

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

  const hideLayout = pathname === '/' || pathname === '/login' || pathname === '/register';

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={() => setIsOpen(!isOpen)} isSidebarOpen={isOpen}/>
      <div className="flex">
        <Sidebar isOpen={isOpen}/>
        <motion.main
          className={`flex-1 p-4 md:p-6 pt-4 transition-all duration-300 ${
            isOpen ? 'md:ml-64' : ''
          }`}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 10}}
          transition={{duration: 0.2}}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}