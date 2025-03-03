'use client'
import { useState, useEffect, useContext, use } from "react";
import { redirect } from 'next/navigation';
import { useGetRole, useMintPrescription, encryptApi, decryptApi, useGetUserInfos } from "@/hooks/useContract";
import { ReloadIcon } from "@radix-ui/react-icons"
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

  PlusCircle,
  Trash
} from "lucide-react"
import { Label } from "@/components/ui/label";
import { BtnModalMedic } from "@/components/shared/BtnModalMedic";
import moment from "moment";
import { SearchInDatas } from "@/components/shared/SearhInDatas";
import { Pencil2Icon } from '@radix-ui/react-icons'
import { getLogs } from "@/utils/logs"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

interface Medicament {
  name: string;
  posology: string;
}

export default function Page() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addressPatient, setAddressPatient] = useState("");
  const { loadingRole, isRegistered, isDoctor, isPatient, isPharmacist } = useGetRole();
  const { writeMintPrescription, isConfirmedMint, isPendingMint, errorConfirmationMint, errorMint } = useMintPrescription();
  const { dataUser } = useGetUserInfos();
  const [doctor, setDoctor] = useState({
    lieu: "",
    name: "",
    num_rpps: "",
    specialite: ""
  })
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState({
    sexe: "",
    name: "",
    dateNaissance: "",
    numSecu: "",
    address: ""
  })
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const { toast } = useToast();
  const router = useRouter()

  const handleAddMedicament = (name: string, posology: string) => {
    const newMedicament = { name: name, posology: posology }
    setMedicaments([...medicaments, newMedicament])
  }

  const handleRemoveMedicament = (index: number) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  }

  const getDoctorInfos = async () => {
    if (dataUser) {
      const res = await decryptApi(dataUser[1])
      setDoctor(res)
    }
  }

  const handleSelectPatient = (value: any) => {
    console.log('Selected:', value);
    setPatient(value)
    // ici ajouter code pour recup addressPatient avec un filter sur data log 
    setAddressPatient(value.address)
  }

  const handleMint = async () => {
    if (patient.name !== "") {
      let jsondata = {
        "patient": patient,
        "doctor": doctor,
        "medicaments": medicaments,
        "notes": ""
      }
      const result = await encryptApi(jsondata);
      await writeMintPrescription(addressPatient, result.encryptedData)
    } else {
      console.error("Aucun patient n'a été selectionné")
    }

  }

  const getLogsPatients = async () => {

    getLogs("UserRegistered", "Patient").then(async (datas: any) => {
      let arr: any = []
      for (const data of datas) {
        console.log(data)
        var decrypted = await decryptApi(data.encryptedDatas)
        data.encryptedDatas = decrypted
        arr.push({
          "sexe": data.encryptedDatas.sexe,
          "name":  data.encryptedDatas.name,
          "dateNaissance": data.encryptedDatas.dateNaissance,
          "numSecu": data.encryptedDatas.numSecu,
          "address": data.user
        });
      }
      setPatients(arr);
      console.log(arr)
    });
  }

  useEffect(() => {
    if (isConfirmedMint) {
      toast({
        description: "Ordonnance créée avec succès !",
      })
      router.push("/")
    }
    if (errorConfirmationMint) {
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la création de l'ordonnance",
      })
    }
    if (errorMint) {
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la récupération de l'ordonnance",
      })
    }
  }, [isConfirmedMint,errorConfirmationMint, errorMint])

  useEffect(() => {
    if (dataUser) {
      getDoctorInfos()
      getLogsPatients()
    }

  }, [dataUser])

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
                  <div className="font-semibold">{doctor.name}</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Spécialité</dt>
                      <dd>{doctor.specialite}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">N° RPPS</dt>
                      <dd>{doctor.num_rpps}</dd>
                    </div>

                  </dl>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Addresse</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>{doctor.lieu}</span>

                    </address>
                  </div>

                </div>


              </CardContent>

            </Card>

            <Card >
              <CardContent>
                <div className="grid gap-3 py-4 relative">
                  <div className="font-semibold">Patient</div>

                  {patient.name !== "" ?
                    <dl className="grid gap-3">
                      <Pencil2Icon
                        className="w-[40px] h-[40px] cursor-pointer absolute top-4 right-0 p-2"
                        onClick={() => setPatient({
                          sexe: "",
                          name: "",
                          dateNaissance: "",
                          numSecu: "",
                          address: ""
                        })}
                      />
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Nom</dt>
                        <dd>{patient.name}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Date de naissance</dt>
                        <dd>{moment(patient.dateNaissance).format('DD/MM/YYYY')}</dd>
                      </div>
                    </dl>
                    :
                    <dl className="grid gap-3">

                      <SearchInDatas
                        data={patients}
                        valueKey="name"
                        textKey="name"
                        mode="patient"
                        onSelect={handleSelectPatient}
                      />

                    </dl>
                  }



                </div>
                <Separator className="my-4" />
                <div className="grid gap-3 ">
                  <div className="font-semibold">Informations ordonnances</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Le </dt>
                      <dd>{moment().format('DD/MM/YYYY')}</dd>
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

          <div className="flex justify-end mb-8">
            <Button onClick={handleMint} disabled={patient.name === "" || isPendingMint}>
              {isPendingMint &&
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              }
              Générer l'ordonnance
            </Button>
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
