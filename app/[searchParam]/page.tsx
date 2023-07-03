import SearchData from "./SearchData";

export default function Page({ params }: { params: { searchParam: string } }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between max-w-6xl mx-auto py-24">
            <SearchData searchParam={params.searchParam} />
        </div>
    )
}