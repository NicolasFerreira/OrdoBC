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
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { decryptApi } from "@/hooks/useContract";

export function BtnShowScan() {
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter()

    const handleInputSearch = (event:any) => {
        setValue(event.target.value);
    }

    const handleKeyDown = async (event:any) => {
        if (event.key === 'Enter') {     
            setError("")
            let result = await decryptApi(value);
          if(result.startsWith("/prescription/") && result.includes("fromScan=true")){
            console.log(result)
            router.push(result)
          } else {
            setValue("");
            setError("Une erreur est survenue, réessayez.")
            console.log(error)
          }
          
        }
      }


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>Traiter une ordonnance</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white p-16">
            <AlertDialogTitle className="flex justify-center items-center pb-4">Scannez le QRcode d'une ordonnance</AlertDialogTitle>
                <AlertDialogDescription>
                <Input id="inputScan" value={value} onChange={handleInputSearch} type="text" autoFocus onKeyDown={handleKeyDown}/>
                {error !== '' && <div className="text-red-500" >{error}</div>}
                </AlertDialogDescription>
                
                <AlertDialogFooter className="!justify-center items-center pt-8">
                    <AlertDialogCancel>Retour</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
