'use client';
import Search from "@/components/Search";
import DataTable from "./DataTable";
import Header from "@/components/Header";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between max-w-6xl mx-auto pb-24">
      <Header />
      <Search />
      <DataTable />
    </main>
  )
}
