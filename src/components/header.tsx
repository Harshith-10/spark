'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SidebarCloseIcon, SidebarOpenIcon, BellIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignOutButton } from './sign-out-button';
import { useAuth } from '@/providers/auth-provider';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Get user metadata from Supabase user
  const userMetadata = user?.user_metadata || {};
  
  // Display name fallback logic
  const displayName = userMetadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name?.split(' ')
      .map(part => part?.[0])
      .join('')
      .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  };
  
  return (
    <motion.header
      className={`sticky top-0 z-50 py-3 px-4 md:px-6 transition-all duration-200`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <SidebarCloseIcon className="h-6 w-6" /> : <SidebarOpenIcon className="h-6 w-6" />}
          </Button>
          <Link href="/dashboard"
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold">Spark</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">New test available</span>
                  <span className="text-sm text-muted-foreground">Basic Math Skills</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Score update</span>
                  <span className="text-sm text-muted-foreground">You ranked in the top 10%</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && !loading ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={userMetadata?.avatar_url || ''} 
                      alt={displayName} 
                    />
                    <AvatarFallback>
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {displayName}
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}