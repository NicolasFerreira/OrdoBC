"use client"
import { SearchInDatas } from "@/components/shared/SearhInDatas"
import medicamentsFromJson from "@/data/medicaments.json"
import { useEffect, useState } from "react"


import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SBtnModalMedicProps {
    onClose: (name:string,posology:string) => void;
  }

export function BtnModalMedic({ onClose }: SBtnModalMedicProps) {

    const [datas, setDatas] = useState([]);
    const [medic, setMedic] = useState("");

    const [prendreQty, setPrendreQty] = useState("1");
    const [prendreMode, setPrendreMode] = useState("cp");
    const [prendreFreq, setPrendreFreq] = useState("par jour");
    const [pendantQty, setPendantQty] = useState("1");
    const [pendantFreq, setPendantFreq] = useState("jours");

    const [open, setOpen] = useState(false);
    


    const handleSelect = (value: string) => {
        console.log('Selected:', value);
        setMedic(value)
        console.log(medic)
    };


    const getDatas = () => {
        let json: any = []
        if (medicamentsFromJson instanceof Array) {
            json = medicamentsFromJson.map((medicament) => ({ name: medicament.name }))
        }

        return json;
    }

    const triggerAddMedic = () => {
        let posologie =  `${prendreQty} ${prendreMode} ${prendreFreq}, pendant ${pendantQty} ${pendantFreq}`
        onClose(medic, posologie);
        setOpen(false);
    }

    useEffect(() => {
        setDatas(getDatas());
    }, [])

    useEffect(() => {
        if (open) {
            setMedic("");
            setPrendreQty("1");
            setPrendreMode("cp");
            setPrendreFreq("par jour");
            setPendantQty("1");
            setPendantFreq("jours");
        }
    }, [open])

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} >
                <SheetTrigger asChild>
                    <div className="btn-container">
                        <Button size="sm" variant="ghost" className="gap-1" >
                            <PlusCircle className="h-3.5 w-3.5" />
                            Ajouter un médicament
                        </Button>
                    </div>

                </SheetTrigger>
                <SheetContent className="bg-white w-1/2 max-w-none" >
                    <SheetHeader>
                        <SheetTitle>Rechercher un médicament</SheetTitle>
                        <SheetDescription>
                            <p>Recherchez et selectionnez le médicament que vous souhaitez ajouter</p>

                            <SearchInDatas
                                data={datas}
                                valueKey="name"
                                textKey="name"
                                onSelect={handleSelect}
                            />

                            <div className="medication-details">
                                <h2>{medic}</h2>
                                <div className="details-section grid grid-cols-2 gap-6 p-4">
                                    <div className="section prendre flex flex-col py-4 ">
                                        <Label className="mb-4">Prendre</Label>
                                        <div className="controls grid grid-cols-3 gap-3">
                                            <div>

                                                <Input type="number" value={prendreQty} onChange={(e) => setPrendreQty(e.target.value)} className="input-quantity" />

                                            </div>


                                            <Select  value={prendreMode} onValueChange={(e)=> setPrendreMode(e)} >
                                                <SelectTrigger className="" >
                                                    <SelectValue placeholder="cp" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="cp">cp</SelectItem>
                                                        <SelectItem value="mg">mg</SelectItem>
                                                        <SelectItem value="ml">ml</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>


                                            <Select value={prendreFreq} onValueChange={(e) => setPrendreFreq(e)}>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="par jour" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="par jour">par jour</SelectItem>
                                                        <SelectItem value="par semaine">par semaine</SelectItem>
                                                        <SelectItem value="par mois">par mois</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>

                                    <div className="section pendant flex flex-col py-4" >
                                        <Label className="mb-3">Pendant</Label>
                                        <div className="controls grid grid-cols-2 gap-3">

                                            <Input type="number" value={pendantQty} onChange={(e) => setPendantQty(e.target.value)} className="input-duration" />


                                            <Select value={pendantFreq} onValueChange={(e) => setPendantFreq(e)}>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="par jour" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="jours">jours</SelectItem>
                                                        <SelectItem value="semaines">semaines</SelectItem>
                                                        <SelectItem value="mois">mois</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button onClick={triggerAddMedic}>Ajouter à l'ordonnance</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>

            </Sheet>
        </>
    )
}



