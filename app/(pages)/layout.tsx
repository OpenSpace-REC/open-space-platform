'use client'
import Navbar from '@/components/ui/nav-bar';
import { useSession } from 'next-auth/react';
import React from 'react';

const CommonLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="flex flex-col min-h-screen"> 

            
            <Navbar/>
            <main className="flex-1 p-8"> 
                {children}
            </main>
        </div>
    );
};

export default CommonLayout;
