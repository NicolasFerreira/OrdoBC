import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

// Définir une interface pour les propriétés du composant
interface LayoutProps {
  children: ReactNode;
}

// Utiliser l'interface pour typer le composant
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
     <Header/>
      <main className='main'>
        {children}
      </main>
      <Footer/>
    </>
  );
}

export default Layout;
