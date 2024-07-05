"use client";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAbi, contractAddress } from "@/constants/index";
import { Prescription, Medication, Refill } from "@/types/ordoTypes";

export async function encryptApi(dataToEncrypt: any) {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: dataToEncrypt, action: 'encrypt' }),
      cache: 'no-store' 
    });
    const result = await response.json();
    console.log('Encrypted data:', result.encryptedData);
    return result;
  } catch (error) {
    console.error('Error encrypting data:', error);
  }
}

export async function decryptApi(encryptedData: string) {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: encryptedData, action: 'decrypt' }),
      cache: 'no-store'
    });
    const result = await response.json();
    console.log('Decrypted data:', result.decryptedData);
    return result.decryptedData;
  } catch (error) {
    console.error('Error decrypting data:', error);
  }
}

export const ROLES = [
  "UKNOWN",
  "DOCTOR",
  "PHARMACIST",
  "PATIENT"
] as const;

export type Role = (typeof ROLES)[number];

interface GetRole {
  isDoctor: boolean;
  isPharmacist: boolean;
  isPatient: boolean;
  isRegistered: boolean;
  role: Role | "UKNOWN";
  errorRole: Error | null;
  loadingRole: boolean;
  refetchRole: ReturnType<typeof useReadContract>["refetch"];
}


export function useGetRole(): GetRole {
  const { address } = useAccount();
  const [role, setRole] = useState<Role>("UKNOWN");
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { data: dataRole, error: errorRole, isLoading: loadingRole, refetch: refetchRole } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getRole",
    account: address,
    query: {
      refetchOnWindowFocus: false,
    },
    args: [address]
  });

  useEffect(() => {
    setRole(dataRole as Role);
    // check is role
    dataRole === 1 ? setIsDoctor(true) : setIsDoctor(false)
    dataRole === 2 ? setIsPharmacist(true) : setIsPharmacist(false)
    dataRole === 3 ? setIsPatient(true) : setIsPatient(false)
    dataRole !== 0 ? setIsRegistered(true) : setIsRegistered(false)

  }, [dataRole]);


  return { isDoctor, isPharmacist, isPatient, isRegistered, role, errorRole, loadingRole, refetchRole };
}

interface GetPrescription {
  dataPrescription: Prescription | null;
  errorPrescription: Error | null;
  isLoadingPrescription: boolean;
  refetchPrescription: ReturnType<typeof useReadContract>["refetch"];
}

export function useGetPrescription(prescriptionId: number) {
  const { address } = useAccount();
  const [dataPrescription, setDataPrescription] = useState<Prescription | null>(null);

  const { data: fetchedDataPrescription, error: errorPrescription, isLoading: isLoadingPrescription, refetch: refetchPrescription } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPrescription",
    account: address,
    query: {
      refetchOnWindowFocus: false,
    },
    args: [prescriptionId]
  });

  useEffect(() => {
    console.log(fetchedDataPrescription)
    const temp: Prescription = fetchedDataPrescription as Prescription;
    async function getdecryptedDetails() {
      console.log('les données encryptées : ',temp.encryptedDetails)
      const result = await decryptApi(temp.encryptedDetails)
      console.log(result);
      if (result !== undefined) {
        temp.encryptedDetails = result;
      }
      return result
    }

    if (!isLoadingPrescription) {
      getdecryptedDetails();
      setDataPrescription(temp);
    }

  }, [isLoadingPrescription]);

  return { dataPrescription, errorPrescription, isLoadingPrescription, refetchPrescription }

}

export function useMintPrescription() {
  const { data: fetchedDataMint, error: errorMint, isPending: isPendingMint, writeContract: writeMint} = useWriteContract({});

  async function writeMintPrescription(addressPatient: string, dataPrescription: string){
    console.log('write contract : ',{
      address: contractAddress,
      abi: contractAbi,
      functionName: "mintPrescription",
      args: [addressPatient, dataPrescription]
    })
    await writeMint({
      address: contractAddress,
      abi: contractAbi,
      functionName: "mintPrescription",
      args: [addressPatient, dataPrescription]
    });
  }
  
  const {
    isLoading: isConfirmingMint,
    isSuccess: isConfirmedMint,
    error: errorConfirmationMint,
  } = useWaitForTransactionReceipt({ hash: fetchedDataMint });

  useEffect(() =>{
    if(isConfirmedMint){
      console.log('Prescription bien créée');
    }
    if(errorConfirmationMint){
      console.log('Une erreur est survenue lors de la création de la prescription');
    }
    if(errorMint) {
      console.log(errorMint.message);
    }
  },[isConfirmedMint,errorConfirmationMint, errorMint])


  return { fetchedDataMint, errorMint, isPendingMint, isConfirmedMint, isConfirmingMint, errorConfirmationMint, writeMintPrescription };
}