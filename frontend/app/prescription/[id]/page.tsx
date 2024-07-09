"use client"
import { useGetPrescription } from "@/hooks/useContract";

export default function Page({ params }: { params: { id: number } }) {
    const { dataPrescription } = useGetPrescription(params.id);

    return (
        <>
            <p>Prescription N°: {params.id}</p>

            {dataPrescription && <pre className="text-wrap break-all">{JSON.stringify(dataPrescription.encryptedDetails)}</pre>}
        </>

    )
}

