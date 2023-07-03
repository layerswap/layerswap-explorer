"use client"

import { shortenAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/ApiResponse";
import useSWR from "swr"

type Swap = {
    created_date: string,
    status: string;
    destination_address: string,
    source_network_asset: string,
    source_network: string,
    source_exchange: string,
    destination_network_asset: string,
    destination_network: string,
    destination_exchange: string,
    has_refuel: boolean,
    input_transaction: Transaction,
    output_transaction: Transaction,
    refuel_transaction: Transaction
}

type Transaction = {
    from: string,
    to: string,
    created_date: string,
    transaction_id: string,
    explorer_url: string,
    confirmations: number,
    max_confirmations: number,
    amount: number,
    usd_price: number,
    usd_value: number
}

export default function SearchData({ searchParam }: { searchParam: string }) {
    const fetcher = (url: string) => fetch(url).then(r => r.json())
    const { data, error, isLoading } = useSWR<ApiResponse<Swap>>(`https://bridge-api-dev.layerswap.cloud/api/explorer/${searchParam}`, fetcher, { dedupingInterval: 60000 })
    const swap = data?.data

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    return (
        <div className="overflow-hidden bg-secondary-700 shadow-xl sm:rounded-lg border border-secondary-500 w-full max-w-6xl">
            <div className="px-4 py-6 sm:px-6 bg-secondary-800">
                <h3 className="text-base font-semibold leading-7 text-white">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
            </div>
            {swap && <div className="border-t border-secondary-500">
                <dl className="divide-y divide-secondary-400">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Date</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{new Date(swap?.created_date).toLocaleString()}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Status</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{swap.status}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">To Address</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{swap.destination_address}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Asset</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{swap.destination_network_asset}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Source Tx</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">
                            {swap.input_transaction.transaction_id}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Destination Tx</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">
                            {swap.output_transaction.transaction_id}
                        </dd>
                    </div>
                </dl>
            </div>}
        </div>
    )
}
