"use client"
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAccount } from "wagmi";
import { useEffect, useContext } from "react";
import { redirect, usePathname } from 'next/navigation';
import { useGetRole } from '@/hooks/useContract';

// Définir une interface pour les propriétés du composant
interface LayoutProps {
  children: ReactNode;
}

// Utiliser l'interface pour typer le composant
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isConnected, address, isReconnecting } = useAccount();
  const { isRegistered, refetchRole, role } = useGetRole();
  const pathname = usePathname()
  // useEffect(() => {
  //   console.log({ address: address, isConnected: isConnected, isRegistered: isRegistered })
  //   console.log(pathname)
  //   if (!isConnected) {
  //     if (pathname !== '/') {
  //       redirect('/')
  //     }
  //   } 

  // }, [address]);
  // useEffect(() => {
  //   if (!isRegistered && pathname !== '/') {
  //     console.log("redirecting")
  //     redirect('/')
  //   }
  // }, [role]);
  return (
    <>
      <Header />
      <main className='main'>
        {isConnected ? children : <div>Disconnected</div>}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
