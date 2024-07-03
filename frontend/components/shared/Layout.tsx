"use client"
import React, { ReactNode, useState } from 'react';
import { useAccount } from "wagmi";
import { useEffect, useContext } from "react";
import { redirect, usePathname } from 'next/navigation';
import { useGetRole } from '@/hooks/useContract';
import Dashboard from './Dashboard';
import NotConnected from './NotConnected';
import Spinner from '@/components/ui/spinner';

// Définir une interface pour les propriétés du composant
interface LayoutProps {
  children: ReactNode;
}

// Utiliser l'interface pour typer le composant
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isConnected, address, isReconnecting, isConnecting } = useAccount();
  const { isRegistered, refetchRole, role } = useGetRole();
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  // useEffect(() => {
  //   if (!isConnected) {
  //     if (pathname !== '/') {
  //       redirect('/')
  //     }
  //   } 

  // }, [address]);

  useEffect(() => {
    
      setLoading(false);
    
  },[])


  // Si une connextion est établie 
  if(isConnected) {
    return (
        <Dashboard role={role}>
          {children}
        </Dashboard>
    )
  }
  // Si une connextion est en cours
  // if(isConnecting || isReconnecting) {
  //   return (
  //     <Spinner/>
  //   )
  // }
  // Si aucune connexion n'est établie, renvoyer le composant NotConnected
  return (
    loading ? <Spinner/> : <NotConnected/>
  );
}

export default Layout;
