import { ConnectButton } from "@rainbow-me/rainbowkit";

import React from "react";

const Header = () => {
  return (
    <nav className="navbar">
      <div className="grow text-2xl font-semibold">OrdoBC</div>
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
