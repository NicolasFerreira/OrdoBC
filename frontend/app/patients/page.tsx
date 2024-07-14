"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { useGetRole, decryptApi } from "@/hooks/useContract";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLogs } from "@/utils/logs";

export default function Page() {
  const { isDoctor, loadingRole } = useGetRole();
  const [bodyTable, setBodyTable] = useState([]);
  const datas = {
    headerTable: [
      { label: "Nom", className: "" },
      { label: "Genre", className: "" },
      { label: "Num sécurité social", className: "" },
      { label: "Date de naissance", className: "" },
      { label: "Address", className: "" },
    ],
  };

  /**
   * Récupère les logs des patients et décrypte les données.
   */
  const getLogsPatients = async () => {
    getLogs("UserRegistered", "Patient").then(async (datas: any) => {
      let arr: any = [];
      for (const data of datas) {
        var decrypted = await decryptApi(data.encryptedDatas);
        data.encryptedDatas = decrypted;
        arr.push({
          sexe: data.encryptedDatas.sexe,
          name: data.encryptedDatas.name,
          dateNaissance: data.encryptedDatas.dateNaissance,
          numSecu: data.encryptedDatas.numSecu,
          address: data.user,
        });
      }
      setBodyTable(arr);
    });
  };

  useEffect(() => {
    if (isDoctor) {
      getLogsPatients();
    }
  }, [isDoctor]);

  if (loadingRole) {
    return <Spinner />;
  }

  if (isDoctor) {
    return (
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Liste des patients
          </h1>
        </div>
        <div className="grid gap-4  max-w-[59rem] lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle>Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <TablePatients
                  headerTable={datas.headerTable}
                  bodyTable={bodyTable}
                />
              </CardContent>
              <CardFooter className="justify-center border-t p-4"></CardFooter>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8"></div>
        </div>
      </div>
    );
  }

  return <p>Vous n'avez pas accès au contenu de cette page </p>;
}

export interface BodyTable {
  name: string;
  sexe: any;
  numSecu: string;
  dateNaissance: string;
  address: string;
}

export interface HeaderTable {
  label: string;
  className: string;
}

interface TablePatientsProps {
  headerTable: HeaderTable[];
  bodyTable: BodyTable[];
}

/**
 * Composant pour afficher la table des patients.
 */
function TablePatients({ headerTable, bodyTable }: TablePatientsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headerTable.map((row) => (
            <TableHead key={row.label} className={row.className}>
              {row.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bodyTable.map((row) => (
          <TableRow key={crypto.randomUUID()} className="cursor-pointer">
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.sexe.substring(0, 1)}</TableCell>
            <TableCell>{row.numSecu}</TableCell>
            <TableCell>{moment(row.dateNaissance).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{row.address}</TableCell>
          </TableRow>
        ))}
        {bodyTable.length === 0 && (
          <TableRow>
            <TableCell colSpan={4}>Aucun patient pour le moment</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
