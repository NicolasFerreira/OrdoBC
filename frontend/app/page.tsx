'use client'
import { useState, useEffect } from "react";
import { useGetRole } from "@/hooks/useContract";

export default function Home() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { role, loadingRole, refetchRole } = useGetRole();

  const test = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:3000/api');
    const dataFromApi = await response.json();
    setData(dataFromApi);
    setLoading(false);
  }

  useEffect(() => {
  
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) { // Vérifie si data n'est pas vide
      console.log('Updated data:', data); // Log les données mises à jour
    }
  }, [data]);


  return (
    <main>
      <button onClick={test} className=" font-bold">Test api btn {role}</button>
    </main>
  );
}
