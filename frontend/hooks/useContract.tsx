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
    console.log("attribution du role : " + dataRole)
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

export function useGetPrescription(prescriptionId: number):GetPrescription {
  const { address } = useAccount();
  const [dataDecrypted, setDataDecrypted] = useState();
  const [dataPrescription, setDataPrescription] = useState<Prescription | null>(null);

  const { data: fetchedDataPrescription, error: errorPrescription, isLoading: isLoadingPrescription, refetch: refetchPrescription , isRefetchError} = useReadContract({
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
    console.log("test :", temp)
    async function getdecryptedDetails() {
      console.log('les données encryptées : ', temp.encryptedDetails)
      if (typeof temp.encryptedDetails === "string") {
        const result = await decryptApi(temp.encryptedDetails)
        console.log(result);
        if (result !== undefined) {
          temp.encryptedDetails = result;
          setDataPrescription(temp)

          console.log("final datas : ", dataPrescription)
        }


      } else {
        console.log('else : ',temp)
        setDataPrescription(temp)
      }

    }

    if (temp !== undefined) {

      console.log("fetchDecryptedDetails")
      getdecryptedDetails();


    }

    if(isRefetchError){
      console.log('isRefetchError : ', isRefetchError)
      
    }

  }, [isLoadingPrescription]);

  return { dataPrescription, errorPrescription, isLoadingPrescription, refetchPrescription }

}

export function useMintPrescription() {
  const { data: fetchedDataMint, error: errorMint, isPending: isPendingMint, writeContract: writeMint } = useWriteContract({});

  async function writeMintPrescription(addressPatient: string, dataPrescription: string) {
    console.log('write contract : ', {
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

  useEffect(() => {
    if (isConfirmedMint) {
      console.log('Prescription bien créée');
      console.log(fetchedDataMint)
    }
    if (errorConfirmationMint) {
      console.log('Une erreur est survenue lors de la création de la prescription');
    }
    if (errorMint) {
      console.log(errorMint.message);
    }
  }, [isConfirmedMint, errorConfirmationMint, errorMint])


  return { fetchedDataMint, errorMint, isPendingMint, isConfirmedMint, isConfirmingMint, errorConfirmationMint, writeMintPrescription };
}

export function useMarkAsTreated() {
  const { address } = useAccount();
  const { data: fetchedDataMark, error: errorMark, isPending: isPendingMark, writeContract: writeMark } = useWriteContract({});

  async function writeMarkAsTreated(idPrescription: number) {
    console.log(typeof Number(idPrescription))
    console.log('write contract : ', {
      address: contractAddress,
      abi: contractAbi,
      functionName: "markAsTreated",
      args: [Number(idPrescription)]
    })
    await writeMark({
      address: contractAddress,
      abi: contractAbi,
      account: address,
      functionName: "markAsTreated",
      args: [Number(idPrescription)]
    });
  }

  const {
    isLoading: isConfirmingMark,
    isSuccess: isConfirmedMark,
    error: errorConfirmationMark,
  } = useWaitForTransactionReceipt({ hash: fetchedDataMark });

  useEffect(() => {
    if (isConfirmedMark) {
      console.log('Prescription traitée');
      console.log(fetchedDataMark)
    }
    if (errorConfirmationMark) {
      console.log('Une erreur est survenue lors du markAsTreated');
    }
    if (errorMark) {
      console.log(errorMark.message);
    }
  }, [isConfirmedMark, errorConfirmationMark, errorMark])


  return { fetchedDataMark, errorMark, isPendingMark, isConfirmedMark, isConfirmingMark, errorConfirmationMark, writeMarkAsTreated };
}


export function useGetUserInfos() {
  const { address } = useAccount();
  const [dataUser, setDataUser] = useState();

  const { data: fetchedDataUser, error: errorUser, isLoading: isLoadingUser, refetch: refetchUser } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "users",
    account: address,
    query: {
      refetchOnWindowFocus: false,
    },
    args: [address]
  });

  useEffect(() => {
    setDataUser(fetchedDataUser as any);
  }, [fetchedDataUser]);

  return { dataUser, errorUser, isLoadingUser, refetchUser };
}