'use client'
import { useState, useEffect, useContext , use} from "react";
import { redirect } from 'next/navigation';
import Link from "next/link"
import { useGetRole , useMintPrescription , encryptApi} from "@/hooks/useContract";
import { Prescription } from "@/types/ordoTypes";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"




export default  function Page() {
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
    console.log('data to encrypt',jsondata)
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
      <div>
        <Input id="address"
                    type="search"
                    value={addressPatient}
                    onChange={(e) => setAddressPatient(e.target.value)}
                    placeholder="x0..."/>
        <Button onClick={handleMint}>Nouvelle Ordonnance</Button>
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
