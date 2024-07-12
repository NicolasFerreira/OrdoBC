"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetUserInfos, decryptApi } from "@/hooks/useContract";
import moment from "moment";

const Profil = () => {
  const { dataUser } = useGetUserInfos()
  const [user, setUser] = useState<any>()

  const getDecryptUser = async () => {
    if (dataUser) {
      const decryptedData = await decryptApi(dataUser[1])
      setUser(decryptedData)
    }

  }
  useEffect(() => {
    getDecryptUser()
    console.log(user)
  }, [dataUser])

  return (
    <>
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">

        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Mon profil
          </h1>

        </div>

        {(user && user.num_rpps) &&
          <div className="grid grid-cols-2 gap-6">
            <Card >
              <CardContent>
                <div className="grid gap-3 py-4">
                  <div className="font-semibold">{user.name}</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Spécialité</dt>
                      <dd>{user.specialite}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">N° RPPS</dt>
                      <dd>{user.num_rpps}</dd>
                    </div>

                  </dl>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Addresse</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>{user.lieu}</span>

                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>



          </div>
        }

        {(user && user.numSecu) &&

          <div className="grid grid-cols-2 gap-6">
            <Card >
              <CardContent>
                <div className="grid gap-3 py-4 relative">
                  <div className="font-semibold">Informations</div>

                  <dl className="grid gap-3">

                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Nom</dt>
                      <dd>{user.name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Genre</dt>
                      <dd>{user.sexe}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">N° sécurité social</dt>
                      <dd>{user.numSecu}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Date de naissance</dt>
                      <dd>{moment(user.dateNaissance).format('DD/MM/YYYY')}</dd>
                    </div>
                    
                    
                  </dl>
                </div>
              </CardContent>

            </Card>
          </div>

        }

        {(user && user.num_rpps_pharma) &&
            <div className="grid grid-cols-2 gap-6">
            <Card >
              <CardContent>
                <div className="grid gap-3 py-4 relative">
                  <div className="font-semibold">Informations</div>

                  <dl className="grid gap-3">

                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Pharmacie</dt>
                      <dd>{user.name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">N°RPPS</dt>
                      <dd>{user.num_rpps_pharma}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Addresse</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>{user.lieu}</span>

                    </address>
                  </div>
                </div>
                    
                  </dl>
                </div>
              </CardContent>

            </Card>
          </div>
        }



      </div>
    </>

  )
}

export default Profil