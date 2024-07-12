"use client"
import { ROLES, Role } from '@/hooks/useContract';
import React, { ReactNode } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip"
import OngletNav from './OngletNav';
import { Cross } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';


interface DashboardAsideProps {
    role: Role;
}

const DashboardAside:React.FC<DashboardAsideProps> = ({role})=> {
    
    const [nav, setNav] = useState([
        {link: "/", icons: "ScrollText", textTooltip:"Ordonnances"},
        {link: "/profile", icons: "UserRound", textTooltip:"Profil"},
    ])

    
  
    useEffect(()=>{
       if (role?.toString() ==="0"){
        setNav([])
       }

       
       switch (role?.toString()) {
         case "0":
           setNav([])
           break;
         case "1":
           setNav([
            {link: "/", icons: "ScrollText", textTooltip:"Ordonnances"},
            {link: "/patients", icons: "UsersRound", textTooltip:"Patients"},
            {link: "/profile", icons: "UserRound", textTooltip:"Profil Docteur"},
           ])
           break;
         case "2":
           setNav([
            {link: "/", icons: "ScrollText", textTooltip:"Ordonnances"},
            {link: "/profile", icons: "UserRound", textTooltip:"Profil Pharma"},
           ])
           break;
         case "3":
           setNav([
            {link: "/", icons: "ScrollText", textTooltip:"Mes ordonnances"},
            {link: "/profile", icons: "UserRound", textTooltip:"Profil Patient"},
           ])
           break;
         default:
           console.log(`Role "${role}" not recognized.`)
           break;
       }
    }, [role])

    
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex bg-white w-52">
    <div className="flex flex-col items-center justify-center  gap-4 px-4 py-4">
        <div className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'>
            OrdoBC
        </div>
    </div>
    <Separator/>
    <nav className="flex flex-col gap-4 px-2 py-4">
      <TooltipProvider>
        {nav.map((item)=> <OngletNav key={crypto.randomUUID()} link={item.link} icons={item.icons} textTooltip={item.textTooltip}/>)}
      </TooltipProvider>
      
    </nav>
  </aside>

  )
}

export default DashboardAside