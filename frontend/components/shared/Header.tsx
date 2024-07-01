import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="navbar">
      <Link href={"/"} className="grow text-2xl font-semibold">OrdoBC</Link>
      <div>
        <ConnectButton 
          accountStatus="address"
          label="Se connecter"
          chainStatus="icon"
          showBalance={false}
         />
      </div>
    </nav>
  );
};

export default Header;
