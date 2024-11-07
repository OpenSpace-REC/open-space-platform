'use client'
export const dynamic = 'force-dynamic';
import { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useSession } from 'next-auth/react';


type User = {
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
  user: {
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
  updateUser: (user: User) => void;
  setUser: Dispatch<SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const { data: session, status } = useSession();

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser(data);
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
