'use client'; // Needed for framer-motion and potentially hooks if added back

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - branding */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-yellow-400 dark:bg-yellow-600 flex-col justify-center items-center p-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto text-center">
          <Sparkles className="h-20 w-20 mx-auto mb-6 text-white" />
          <h1 className="text-4xl font-bold text-white mb-4">Spark</h1>
          <p className="text-xl text-white/90">Ignite your learning journey with our intelligent test-taking platform.</p>
        </div>
      </motion.div>
      
      {/* Right side - auth forms */}
      <motion.div 
        className="w-full md:w-1/2 flex justify-center items-center p-6 relative" // Added relative positioning for ModeToggle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="w-full max-w-md">
          {children} {/* Replaced Outlet with children */}
        </div>
      </motion.div>
    </div>
  );
}
