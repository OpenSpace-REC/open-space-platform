'use client'
export const dynamic = 'force-dynamic';
import { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type User = {
  role: string;
  id: string;
  name: string;
  bio: string | null;
  email: string;
  githubAvatarUrl?: string;
  rank?: string;
  githubProfileUrl?: string;
  githubUsername?: string;
  joinDate?: string;
  points?: number;
  projectsPosted?: number;
  projectsContributed?: number;
  techStack?: string[];
  projects?: {
    role: string;
    project: {
      id: string;
      name: string;
      description: string | null;
      githubUrl: string;
      techStack: string[];
      imageUrl: string | null;
    };
  }[];
} | null;

export interface UserContextType {
  user: User | null;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
  isLoading: true
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch('/api/user');
          const data = await response.json();
          if (!data.error) {
            setUser(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setIsLoading(false);
    };

    if (status === 'loading') {
      setIsLoading(true);
    } else {
      fetchUser();
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
