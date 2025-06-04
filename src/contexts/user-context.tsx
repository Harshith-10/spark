"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const value = {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
