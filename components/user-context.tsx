'use client'
import { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useSession } from 'next-auth/react';


type User = {
  id: string;
  name: string;
  bio: string;
  email: string;
  githubAvatarUrl?: string;
  rank?: string;
  githubProfileUrl?: string;
  githubUsername?: string;
  joinDate?: string;
} | null;

type UserContextType = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const { data: session, status } = useSession(); 

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
    <UserContext.Provider value={{ user, setUser }}>
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
