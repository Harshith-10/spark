"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/user-context';
import { Mail, User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  variant?: 'card' | 'inline' | 'compact';
  showEmail?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  variant = 'inline', 
  showEmail = true, 
  className = '' 
}) => {
  const { user, isLoading } = useUser();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="space-y-1">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            {showEmail && <div className="h-3 w-32 bg-gray-200 rounded"></div>}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="text-lg">
                {user.name ? getInitials(user.name) : <UserIcon className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{user.name || "User"}</h3>
              {showEmail && user.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-xs">
            Authenticated User
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
          <AvatarFallback className="text-xs">
            {user.name ? getInitials(user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium truncate">
          {user.name || "User"}
        </span>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
        <AvatarFallback>
          {user.name ? getInitials(user.name) : <UserIcon className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {user.name || "User"}
        </p>
        {showEmail && user.email && (
          <p className="text-xs text-muted-foreground">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
