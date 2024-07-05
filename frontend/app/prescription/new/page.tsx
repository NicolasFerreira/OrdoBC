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

} from "lucide-react"
import { Label } from "@/components/ui/label";



export default function Page() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addressPatient, setAddressPatient] = useState("0x90F79bf6EB2c4f870365E785982E1f101E93b906");
  const { loadingRole, isRegistered, isDoctor, isPatient, isPharmacist } = useGetRole();
  const { writeMintPrescription } = useMintPrescription()

  const handleMint = async () => {
    let jsondata = {
      "prescriptionId": "RX123456789",
      "patientId": "PAT67890",
      "doctorId": "DOC12345",
      "pharmacistId": "PHAR12345",
      "dateIssued": "2024-06-12",
      "medications": [
        {
          "name": "Metformin",
          "dosage": "500 mg",
          "frequency": "Twice daily",
          "duration": "30 days"
        },
        {
          "name": "Lisinopril",
          "dosage": "20 mg",
          "frequency": "Once daily",
          "duration": "30 days"
        }
      ],
      "notes": "Take medications with food.",
      "refill": {
        "allowed": true,
        "quantity": 1
      }
    }
    console.log('data to encrypt', jsondata)
    const result = await encryptApi(jsondata);
    await writeMintPrescription(addressPatient, result.encryptedData)
  }

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
                <Separator className="mb-4"/>
                <div className="flex flex-col">
                  <Label className="text-base font-semibold">
                    DOLIPRANE 1000 mg, comprimé
                  </Label>
                  <Label className="text-sm">
                    1 comprimé le matin pendant 1 semaine
                  </Label>
                </div>
                <Separator className="my-4"/>
                <div className="flex flex-col">
                  <Label className="text-base font-semibold">
                    DOLIPRANE 1000 mg, comprimé
                  </Label>
                  <Label className="text-sm">
                    1 comprimé le matin pendant 1 semaine
                  </Label>
                </div>
                <Separator className="my-4"/>
                <div className="flex flex-col">
                  <Label className="text-base font-semibold">
                    DOLIPRANE 1000 mg, comprimé
                  </Label>
                  <Label className="text-sm">
                    1 comprimé le matin pendant 1 semaine
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button size="sm" variant="ghost" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Ajouter un médicament
                </Button>
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
