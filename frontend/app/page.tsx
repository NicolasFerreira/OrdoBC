'use client'
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
import { useRouter } from 'next/navigation'

import { getLogs } from "@/utils/logs"
import { useEffect, useState } from "react"
import { decryptApi } from "@/hooks/useContract"
import moment from 'moment';
import { useAccount } from "wagmi";
import { useGetRole } from "@/hooks/useContract"
import {BtnShowScan} from "@/components/shared/BtnShowScan"


export default function Home() {
  const [bodyTable, setbodyTable] = useState([])
  const { address } = useAccount();
  const { role,isDoctor, isPatient, isPharmacist , loadingRole} = useGetRole();


  const datas = {
    "headerTable": [
      { "label": "N°", "className": "" },
      { "label": "Date de prescription", "className": "" },
      { "label": "Nom Patient", "className": "" },
      { "label": "Ajouté par", "className": "" }
    ]
  }

  const fetchLogs = async ()=> {
    await getLogs("PrescriptionMinted").then(async (data: any) => {
      console.log(data)
      if (address) {
        console.log(address)
        // Conditions du filter
        let arrayFiltered:any = [];
        console.log('isDoctor ', isDoctor);
        if(isDoctor) {
          arrayFiltered = data.filter((row: any) => row.doctor === address);
        }
        if(isPatient) {
          arrayFiltered = data.filter((row: any) => row.patient === address);
        }
         
        console.log(arrayFiltered)

        //
        let arr: any = []
        if(arrayFiltered.length > 0) {
          arrayFiltered.map(async (item: any) => {
            let response = await decryptApi(item.encryptedDetails)
            console.log(response)
            arr.push(response);
  
            item.encryptedDetails = response;
  
            // arr rempli 
            if (arr.length === arrayFiltered.length) {
  
              console.log('final array filtered : ',arrayFiltered)
  
              const sortedArray = arrayFiltered.sort((a: any, b: any) => Number(a.date_created) - Number(b.date_created)).reverse();
              console.log(sortedArray)
              setbodyTable(sortedArray);
            }
          })
        } else {
          console.log('aucune prescription trouvée pour cet utilisateur')
          setbodyTable([])
        }
        
        console.log(bodyTable);
      }
    });
  }

  useEffect(()=>{
    console.log(address)
    if(address && !loadingRole) {
      fetchLogs()
      //console.log("fectch from address changed")
    }
  }, [address,role])

  return (
    <>
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {isPatient ? "Mes ordonnances" : "Liste des ordonnances"}
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">

            {isDoctor &&
              <Button size="sm">
                <Link href="/prescription/new">Nouvelle ordonnance</Link>
              </Button>
            }

            {isPharmacist &&
              <BtnShowScan />
            }

          </div>
        </div>
        <div className="grid gap-4  max-w-[59rem] lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">

            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Ordonnances</CardTitle>
                <CardDescription>
                  Cliquez sur une ordonnance de la liste pour voir le détails de celle ci.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TablePrescriptions
                  headerTable={datas.headerTable}
                  bodyTable={bodyTable}
                />
              </CardContent>
              <CardFooter className="justify-center border-t p-4">

              </CardFooter>
            </Card>

          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">

          </div>
        </div>

      </div>
    </>
  )


}


export interface BodyTable {
  tokenId: string;
  encryptedDetails: any;
  date_created: string;
}

export interface HeaderTable {
  label: string;
  className: string;
}

interface TablePrescriptionsProps {
  headerTable: HeaderTable[];
  bodyTable: BodyTable[];
}
function TablePrescriptions({ headerTable, bodyTable }: TablePrescriptionsProps) {
  const router = useRouter()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headerTable.map((row) => {
            return <TableHead key={row.label} className={row.className}>{row.label}</TableHead>
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bodyTable.map((row) => {
          return <TableRow key={crypto.randomUUID()} className="cursor-pointer" onClick={() => router.push('/prescription/' + row.tokenId)}>
            <TableCell>{row.tokenId.toString()}</TableCell>
            <TableCell>{moment.unix(Number(row.date_created)).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{row.encryptedDetails?.patient?.name}</TableCell>
            <TableCell>{row.encryptedDetails?.doctor?.name}</TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  )
}
