
"use client"
import { Role } from '@/hooks/useContract';
import React, { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardAside from './DashboardAside';

interface DashboardProps {
    children: ReactNode;
    role: Role;
}

const Dashboard: React.FC<DashboardProps> = ({ children, role}) => {
    return (
        <div className='grid grid-cols-[200px_1fr] h-full w-full gap-4'>
            <DashboardAside role={role} />
            <div className='grid grid-row-2 col-start-2 gap-4'>
                <DashboardHeader />
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
                    {role?.toString() !=="0" ? children
                    : <p>Votre addresse de wallet n'est pas enregistré dans le système </p>}
                </main>
            </div>
            
        </div>
    )
}

export default Dashboard