import SearchData from "./SearchData";

export default async function Page({ params }: { params: { searchParam: string } }) {

  return (
    <main className="w-full py-5 px-6 xl:px-0">
      <SearchData searchParam={decodeURIComponent(params.searchParam)} />
    </main>
  )
}
