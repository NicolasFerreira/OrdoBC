"use client"
import { useGetPrescription } from "@/hooks/useContract";
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

export default function Page({ params }: { params: { id: number } }) {
    const { dataPrescription } = useGetPrescription(params.id);

    const [ordo, setOrdo] = useState<any>()

    useEffect(() => {
        if(dataPrescription !== null){
            let res:any = dataPrescription.encryptedDetails;
            setOrdo(res)
        }
            
        
    },[dataPrescription]);

    // return (
    //     <>

    //         {dataPrescription && <pre className="text-wrap break-all">{JSON.stringify(dataPrescription.encryptedDetails)}</pre>}
    //     </>



    // )

    if(dataPrescription && ordo) {
        return (
            <>
              <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
      
                <div className="flex items-center gap-4">
                  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Prescription N°: {params.id}
                  </h1>
      
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
      
                
              </div>
      
      
      
            </>
          )
    }

   
}

