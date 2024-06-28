"use client"
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAccount } from "wagmi";

// Définir une interface pour les propriétés du composant
interface LayoutProps {
  children: ReactNode;
}

// Utiliser l'interface pour typer le composant
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isConnected } = useAccount();
  return (
    <>
     <Header/>
      <main className='main'>
        {isConnected ? children : <div>Disconnected</div>}
      </main>
      <Footer/>
    </>
  );
}

export default Layout;
