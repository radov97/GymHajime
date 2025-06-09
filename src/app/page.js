"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";

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
      <header className="bg-[var(--color-palco)] px-6 py-4 shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <Image
            src="/palco-logo.png"
            alt="Palco logo"
            width={120}
            height={120}
            className="h-20 w-auto rounded-md shadow-lg bg-[var(--color-palco-light)]"
            priority
          />
          <div className="text-[var(--color-palco-soft)]">
            <h1 className="text-2xl font-bold leading-tight">FindPalco</h1>
            <p className="text-sm font-medium text-[var(--color-palco-accent)]">
              Connect Beyond Travel
            </p>
          </div>
        </div>
      </header>
    </main>
  );
}
