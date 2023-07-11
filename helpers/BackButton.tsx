"use client"

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackBtn() {
    const router = useRouter()

    return (
        <button onClick={() => router.back()} className="flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-gray-800 hover:text-accent-foreground py-2 px-4 absolute left-4 top-4 md:left-8 md:top-8">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span>Back</span>
        </button>
    )
}