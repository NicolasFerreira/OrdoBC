"use client";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { contractAbi, contractAddress } from "@/constants/index";

export const ROLES = [
    "UKNOWN",
    "DOCTOR",
    "PHARMACIST",
    "PATIENT"
  ] as const;
  
  export type Roles = (typeof ROLES)[number];
  interface Role {
    role: Roles | "UKNOWN";
    errorRole: Error | null;
    loadingRole: boolean;
    refetchRole: ReturnType<typeof useReadContract>["refetch"];
  }


export function useGetRole(): Role {
    const { address } = useAccount();
    const [role, setRole] = useState<Roles>("UKNOWN");
    const { data: dataRole , error: errorRole, isLoading: loadingRole, refetch: refetchRole} = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "getRole",
      account: address,
      args: [address]
    });

    useEffect(() => {
        setRole(dataRole as Roles);
      }, [dataRole]);
  
    return { role, errorRole, loadingRole, refetchRole };
  }