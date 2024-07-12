"use client"
import { useGetPrescription, useMarkAsTreated } from "@/hooks/useContract";
import moment from "moment";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useAccount } from "wagmi";
import { useGetRole } from "@/hooks/useContract";
import {BtnShowQRcode} from "@/components/shared/BtnShowQRcode";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import{ Prescription } from "@/types/ordoTypes"


export default function Page({ params }: { params: { id: number } }) {
    const { dataPrescription, refetchPrescription } = useGetPrescription(params.id);
    const { writeMarkAsTreated, isConfirmedMark, errorConfirmationMark, errorMark , fetchedDataMark} = useMarkAsTreated();
    const [ordo, setOrdo] = useState<any>()
    const { address } = useAccount();
    const {  isPatient , isPharmacist} = useGetRole();
    const [isTreated, setIsTreated] = useState(false)

    useEffect(() => {
        if(dataPrescription !== null){
            let res:any = dataPrescription.encryptedDetails;
            
            setOrdo(res)
            setIsTreated(dataPrescription.treated)
            console.log(ordo)
        }
    },[dataPrescription]);

    const handleMarkAsTreated = async () => {
      await writeMarkAsTreated(params.id)
    }

    const refetchPage = async () => {
      const res = await refetchPrescription()
      console.log("refetchPage - res - ", res)
      if(res.status === "success" && res.data){
        const prescriptionData = res.data as Prescription; 
        setIsTreated(prescriptionData.treated)
        console.log("avant",prescriptionData.treated)
        console.log("isTreated - ", isTreated)
      }
    }
  
    useEffect(() => {
      if(isConfirmedMark){

        refetchPage()
      }
      if(errorConfirmationMark){
        console.error("Une erreur est survenue lors de la mise à jour de la prescription - errorConfirmationMark - ", errorConfirmationMark)
      }
      if(errorMark){
        console.error("Une erreur est survenue lors de la récupération de la prescription - errorMark - ", errorMark)
      }
    },[isConfirmedMark,errorConfirmationMark,errorMark, fetchedDataMark])

    if(isPatient && address !== ordo?.patient.address){
      return (
        <div>Cette prescription ne vous appartient pas.</div>
      )
    }

    if(dataPrescription && ordo) {
        return (
            <>
              <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
      
                <div className="flex items-center gap-4 relative">
                  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Ordonnance N°: {params.id} {isTreated && <Badge className="ml-4">Traitée</Badge>}
                  </h1>

                  {isPatient &&
                  <div className="absolute right-0">
                    <BtnShowQRcode id={params.id}/>
                  </div>
                   
                  }

                 
      
                </div>
               
                <div className="grid grid-cols-2 gap-6">
                  <Card >
                    <CardContent>
                      <div className="grid gap-3 py-4">
                        <div className="font-semibold">{ordo.doctor.name}</div>
                        <dl className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Spécialité</dt>
                            <dd>{ordo.doctor.specialite}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">N° RPPS</dt>
                            <dd>{ordo.doctor.name}</dd>
                          </div>
      
                        </dl>
                      </div>
      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <div className="font-semibold">Addresse</div>
                          <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>{ordo.doctor.lieu}</span>
      
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
                              <dd>{ordo.patient.name}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">Date de naissance</dt>
                              <dd>{moment(ordo.patient.dateNaissance).format('DD/MM/YYYY')}</dd>
                            </div>
                          </dl>
                          
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
      
                      {ordo.medicaments.map((medic:any, index:number) => {
                        return (
                          <div key={index}>
                            <div className="flex flex-col relative">
                              <Label className="text-base font-semibold">
                                {medic.name}
                              </Label>
                              <Label className="text-sm">
                                {medic.posology}
                              </Label>
      
                             
                            </div>
                            <Separator className="my-4" />
                          </div>
      
                        )
                      })}
      
                    </CardContent>
                
                  </Card>
                </div>

                {isPharmacist && 
                  <div className="flex justify-end mb-8">
                    <Button onClick={handleMarkAsTreated} disabled={isTreated}>Marquer l'ordonnance "traitée"</Button>
                  </div>
                }
                
      
                
              </div>
      
      
      
            </>
          )
    }
}

