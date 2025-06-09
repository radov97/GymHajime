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
      <h1 className="bg-">FindPalco is Live!</h1>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>{row.name}</li>
        ))}
      </ul>
      <div className="text-white p-4 bg-amber-400">Hello Tailwind!</div>
    </main>
  );
}
