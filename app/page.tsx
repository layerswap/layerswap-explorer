import Search from "@/components/Search";
import DataTable from "./DataTable";
import MaintananceContent from "@/components/maintanance/maintanance";

export default async function Home() {

  if (process.env.NEXT_PUBLIC_MAINTANANCE == String(true))
    return <MaintananceContent />

  return (
    <main className="w-full py-5 px-6 xl:px-0 h-full flex flex-col flex-1">
      <Search />
      <DataTable />
    </main>
  )
}