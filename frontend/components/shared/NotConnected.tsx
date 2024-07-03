import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NotConnected = () => {
  return (
    <div className="w-full grid lg:grid-cols-2 h-screen ">
        <div className="flex justify-center item-center hidden  lg:flex bg-[#0e76fd] ">
        {/* <Image
          src="/home_img.png"
          alt="Image"
          width="512"
          height="512"
          className="w-25% dark:brightness-[0.2] dark:grayscale object-contain"
        /> */}
      </div>
      
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className=" text-muted-foreground">
              Connecter votre wallet pour avoir accès à l'application
            </p>
          </div>
          <div className="w-full flex justify-center items-center">
           <ConnectButton
                        accountStatus="address"
                        label="Se connecter"
                        chainStatus="icon"
                        showBalance={false}
                    />
          </div>
         
        </div>
      </div>
      
    </div>
  )
}

export default NotConnected