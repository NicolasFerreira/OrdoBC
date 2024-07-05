import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React from "react";

const DashboardHeader = () => {
  return (
    <nav className="navbar grid grid-cols-[200px_1fr] w-full max-w-[59rem] mx-auto">
      {/* <Link href={"/"} className="grow text-2xl font-semibold">OrdoBC</Link> */}
      <div></div>
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

export default DashboardHeader;
