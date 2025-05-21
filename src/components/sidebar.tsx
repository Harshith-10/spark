'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Book, 
  MessageSquare, 
  Settings,
  ChevronRight,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, path, isActive }: SidebarItemProps) => {
  return (
    <motion.li
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={path}
        className={cn(
          "flex items-center gap-x-3 py-3 px-3 rounded-md text-sm transition-colors",
          isActive 
            ? "bg-yellow-500/10 text-yellow-500 font-medium" 
            : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-3">
            {icon}
            <span>{label}</span>
          </div>
          {isActive && (
            <ChevronRight className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </Link>
    </motion.li>
  );
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: "Tests",
      path: "/tests",
    },
    {
      icon: <Code className="h-5 w-5" />,
      label: "Playground",
      path: "/playground",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Spark AI",
      path: "/chat",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="fixed left-0 top-0 bottom-0 z-30 w-64 border-r bg-background pt-16"
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <div className="flex h-full flex-col px-3 py-5">
            <nav className="space-y-1 mt-5">
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={pathname === item.path}
                  />
                ))}
              </ul>
            </nav>
            
            <div className="mt-auto pt-4 border-t">
              <div className="rounded-md bg-yellow-500/10 p-4">
                <h3 className="font-medium text-yellow-500">Pro Tip</h3>
                <p className="text-sm mt-1 text-muted-foreground">
                  Use Spark AI to get help with difficult concepts!
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;