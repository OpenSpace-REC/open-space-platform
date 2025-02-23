'use client'
import Navbar from '@/components/ui/nav-bar';

import React from 'react';

const CommonLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="flex flex-col min-h-screen"> 

            
            <Navbar/>
            {/* Fixes overflow in mobile screens */}
            <main className="flex-1 p-4"> 
                {children}
            </main>
        </div>
    );
};

export default CommonLayout;
