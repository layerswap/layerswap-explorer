"use client"

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Search = () => {
    const [searchParam, setSearchParam] = useState('');
    const router = useRouter();

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    function getLastPart(url: string) {
        const parts = url.split('/');
        return parts.at(-1);
    }

    const handleSearch = () => {
        const url = getLastPart(searchParam)
        router.push(`/${url}`)
    }

    return (
        <div className="w-full">
            <div className=" sm:px-6 lg:px-8">
                <div className="relative flex items-center pl-2 bg-secondary-700 rounded-md">
                    <input
                        type="text"
                        name="searchParam"
                        id="searchParam"
                        value={searchParam}
                        onChange={(v) => setSearchParam(v.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search by Address / Source Tx / Destination Tx"
                        className="block w-full rounded-md py-1 pl-3 pr-4 border-2 border-transparent placeholder:text-base placeholder:leading-3 focus:border-secondary-500 duration-200 transition-all outline-none text-white bg-secondary-700 shadow-sm placeholder:text-primary-text "
                    />
                    <div className="flex p-2">
                        <button
                            onClick={handleSearch}
                            className="inline-flex items-center rounded-lg bg-primary-500 shadow-lg p-2 hover:bg-primary-700 hover:text-primary-text active:scale-90 duration-200 transition-all font-sans text-xs text-white"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;