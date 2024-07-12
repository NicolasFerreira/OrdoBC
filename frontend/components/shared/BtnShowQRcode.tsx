import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

interface BtnShowQRcodeProps {
    id:number;
  }

export function BtnShowQRcode({ id }: BtnShowQRcodeProps) {
    const [value, setValue] = useState("");

    useEffect(() => {
        console.log(id)
        setValue("/prescription/"+id+"?fromscan=true")
    },[])

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button  >Afficher le QRcode</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white p-16">
            <AlertDialogTitle className="flex justify-center items-center pb-4">QRcode à présenter au pharmacien</AlertDialogTitle>
                <AlertDialogHeader>
                    
                    <AlertDialogDescription>
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 250, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "250px", width: "250px" }}
                                value={value}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!justify-center items-center pt-8">
                    <AlertDialogCancel>Retour</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
