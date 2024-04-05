import Search from "@/components/Search";
import DataTable from "./DataTable";

export default async function Home() {

  return (
    <main className="w-full py-5 px-6 xl:px-0 h-full flex flex-col flex-1">
      <Search />
      <DataTable />
    </main>
  )
}