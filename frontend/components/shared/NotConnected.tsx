import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NotConnected = () => {
  return (
    <div className="w-full grid lg:grid-cols-2 h-screen ">
      <div className="flex justify-center item-center hidden  lg:flex bg-[#16b3a5] ">
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
            <div className="text-3xl flex justify-center mb-6">

              <Image
                src="https://ipfs.io/ipfs/QmWpKMVKmH2Que7bNu7bbhzqXF5DpzUzz1KR12vwVhLk56/"
                width={150}
                height={150}
                alt="OrdoBC"
              /></div>
            <p className=" text-muted-foreground">
              Connectez vous pour avoir accès à l'application
            </p>
          </div>
          <div className="w-full flex justify-center items-center">
            <ConnectButton
              accountStatus="address"
              label="Connecter votre portefeuille"
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