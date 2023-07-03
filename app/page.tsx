import Search from "@/components/Search";
import DataTable from "./DataTable";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between max-w-6xl mx-auto py-24">
      <Search />
      <DataTable />
    </main>
  )
}
