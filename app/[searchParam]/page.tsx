'use client';
import Header from "../../components/Header";
import SearchData from "./SearchData";

export default function Page({ params }: { params: { searchParam: string } }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between max-w-6xl mx-auto pb-24">
            <Header />
            <SearchData searchParam={params.searchParam} />
        </div>
    )
}