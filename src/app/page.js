"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Home() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase.from("test_table").select("*");
      if (error) {
        console.error(error);
      } else {
        setRows(data); // ✅ store in state
      }
    }

    loadData();
  }, []);

  return (
    <main>
      <h1>FindPalco is Live!</h1>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>{row.name}</li>
        ))}
      </ul>
    </main>
  );
}
