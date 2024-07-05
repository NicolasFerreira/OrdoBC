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
import { useEffect,useState } from "react"
import { decryptApi } from "@/hooks/useContract"



export default function Home() {
  const [bodyTable, setbodyTable ] = useState([])

  const datas = {
    "headerTable":[
    {"label":"N°", "className":""},
    {"label":"Nom Patient", "className":""},
    {"label":"Date de prescription", "className":""}
  ],
    "bodyTable":[{
      "id":"1",
      "patient":"John Doe",
      "date":"2022-05-15",
      "status":"En cours"
    },{
      "id":"2",
      "patient":"Jane Doe",
      "date":"2022-05-16",
      "status":"Terminée"
    },{
      "id":"3",
      "patient":"Mary Doe",
      "date":"2022-05-17",
      "status":"En attente"
    }
  ]
   }

   useEffect(() => {
    getLogs("PrescriptionMinted").then((data)=>{

      // let arr:any = []
      // data.map(async (item:any)=>{
      //    let response = await decryptApi(item.encryptedDetails)
      //    console.log(response)
      //    arr.push(response);

      //    // arr rempli 
      //    if(arr.length === data.length){
      //     console.log(arr)

      //    }
      // })

      
      
      // setbodyTable(data.map(async (prescri: { tokenId: number; patient: string; date_created: number, encryptedDetails: any }) => {
      //   let p = await decryptApi(prescri.encryptedDetails)
      //   return {
      //     id:Number(p.prescriptionId),
      //     patient:p.patientId,
      //     date:Number(p.dateIssued)
      //   };
      // }));
      // console.log(bodyTable);

    });

    
    
   },[])

  return (
    <>
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Liste des ordonnances
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">

            <Button size="sm">
              <Link href="/prescription/new">Nouvelle ordonnance</Link>
            </Button>
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
                bodyTable={datas.bodyTable}
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
  id:      string;
  patient: string;
  date:    string;
  status:  string;
}

export interface HeaderTable {
  label:     string;
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
          {headerTable.map((row) =>{
            return <TableHead key={row.label} className={row.className}>{row.label}</TableHead>
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bodyTable.map((row) =>{
          return <TableRow key={crypto.randomUUID()}className="cursor-pointer" onClick={() => router.push('/prescription/' + row.id)}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.patient}</TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>
  )
}
