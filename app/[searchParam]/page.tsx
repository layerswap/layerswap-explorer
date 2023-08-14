import { SettingsProvider } from "@/context/settings";
import SearchData from "./SearchData";

export default async function Page({ params }: { params: { searchParam: string } }) {

  return (
    <SettingsProvider>
      <main className="w-full py-5 px-6 xl:px-0">
        <SearchData searchParam={params.searchParam} />
      </main>
    </SettingsProvider>
  )
}
