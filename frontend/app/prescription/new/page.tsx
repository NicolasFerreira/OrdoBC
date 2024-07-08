'use client'
import { useState, useEffect, useContext, use } from "react";
import { redirect } from 'next/navigation';
import Link from "next/link"
import { useGetRole, useMintPrescription, encryptApi } from "@/hooks/useContract";
import { Prescription } from "@/types/ordoTypes";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import {

  PlusCircle,
  Trash
} from "lucide-react"
import { Label } from "@/components/ui/label";
import { BtnModalMedic } from "@/components/shared/BtnModalMedic";
import { publicClient } from "@/utils/client";
import { contractAddress } from "@/constants";

interface Medicament {
  name: string;
  posology: string;
}

export default function Page() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addressPatient, setAddressPatient] = useState("0x90F79bf6EB2c4f870365E785982E1f101E93b906");
  const { loadingRole, isRegistered, isDoctor, isPatient, isPharmacist } = useGetRole();
  const { writeMintPrescription, isConfirmedMint } = useMintPrescription();

  const [medicaments, setMedicaments] = useState<Medicament[]>([])

  const handleAddMedicament = (name: string, posology: string) => {
    const newMedicament = { name: name, posology: posology }
    setMedicaments([...medicaments, newMedicament])
  }

  const handleRemoveMedicament = (index: number) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  }

  const getDoctorInfos = () => {

  }

  const handleMint = async () => {
    let jsondata = {
      "patient": {
        name:"",
        address: "",
        date_naissance:"01/10/1990"
      },
      "doctor": {
      },
      "medications": medicaments,
      "notes": "",
      "refill": {
        "allowed": true,
        "quantity": 1
      }
    }
    console.log('data to encrypt', jsondata)
    const result = await encryptApi(jsondata);
    await writeMintPrescription(addressPatient, result.encryptedData)
  }

  useEffect(() => {
    if(isConfirmedMint){
      redirect("/")
    }
  },[isConfirmedMint])

  if (loadingRole) {
    return <p>Chargement...</p>
  }

  if (!isRegistered) {
    return <p>Vous n'etes pas enregistré</p>
  }

  if (isDoctor) {
    return (
      <>
        <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">

          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Délivrer une ordonnance
            </h1>

          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card >
              <CardContent>
                <div className="grid gap-3 py-4">
                  <div className="font-semibold">Docteur John Doe</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Spécialité</dt>
                      <dd>Médecine générale</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">N° RPPS</dt>
                      <dd>123456780</dd>
                    </div>

                  </dl>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Addresse</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>

                </div>


              </CardContent>

            </Card>

            <Card >
              <CardContent>
                <div className="grid gap-3 py-4">
                  <div className="font-semibold">Patient</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Nom</dt>
                      <dd>Jean Moulin</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Date de naissance</dt>
                      <dd>28/12/1989</dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3 ">
                  <div className="font-semibold">Informations ordonnances</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Fait à </dt>
                      <dd>Cahors</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Le </dt>
                      <dd>04/07/2024</dd>
                    </div>
                  </dl>
                </div>


              </CardContent>

            </Card>

          </div>
          <div className="flex w-full items-center gap-4">

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Médicaments</CardTitle>
                <CardDescription>
                  Ajouter un médicament à la liste et choisissez la posologie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />

                {medicaments.map((medic, index) => {
                  return (
                    <div key={index}>
                      <div className="flex flex-col relative">
                        <Label className="text-base font-semibold">
                          {medic.name}
                        </Label>
                        <Label className="text-sm">
                          {medic.posology}
                        </Label>

                        <Trash className="cursor-pointer absolute right-0 top-2" onClick={() => handleRemoveMedicament(index)} />
                      </div>
                      <Separator className="my-4" />
                    </div>

                  )
                })}

              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <BtnModalMedic onClose={handleAddMedicament} />
              </CardFooter>
            </Card>
          </div>

          <div>
            <Input id="address"
              type="search"
              value={addressPatient}
              onChange={(e) => setAddressPatient(e.target.value)}
              placeholder="x0..." />
            <Button onClick={handleMint}>Nouvelle Ordonnance</Button>
          </div>
        </div>



      </>
    )
  }

  if (isPatient) {
    return (
      <>
        <div>Page Profil Patient</div>
      </>
    )
  }

  if (isPharmacist) {
    return (
      <>
        <div>Page Profil Pharmacien</div>
      </>
    )
  }


}
