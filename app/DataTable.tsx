"use client"
import { shortenAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/ApiResponse";
import useSWR from "swr"
import StatusIcon from '../components/SwapHistory/StatusIcons';
import { ExternalLink } from "lucide-react";
import { useSettingsState } from "@/context/settings";
import Image from "next/image";
import Link from "next/link";
import LoadingBlocks from "@/components/LoadingBlocks";

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

export default function DataTable() {
    const fetcher = (url: string) => fetch(url).then(r => r.json())
    const { data, error, isLoading } = useSWR<ApiResponse<Swap[]>>('https://bridge-api-dev.layerswap.cloud/api/explorer?statuses=1&statuses=4', fetcher, { dedupingInterval: 60000 });
    const swapsData = data?.data;
    const settings = useSettingsState();

    if (error) return <div>failed to load</div>
    if (isLoading) return <LoadingBlocks />

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-full max-h-[60vh] dataTable">
                    <div className="inline-block h-screen min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-white ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-secondary-500 relative">
                                <thead className="bg-secondary-800 sticky -top-1 z-10">
                                    <tr>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            To Address
                                        </th>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Source
                                        </th>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Destination
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-400 bg-secondary overflow-y-scroll">
                                    {swapsData?.map((swap, index) => {
                                        const sourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase())
                                        const destinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase())

                                        return (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-white flex flex-col">
                                                    <Link href={`/${swap.destination_address}`} className="hover:text-gray-300 inline-flex items-center w-fit">
                                                        {shortenAddress(swap.destination_address)}
                                                    </Link>
                                                    <StatusIcon swap={swap.status} />
                                                    <span className="text-primary-text">{new Date(swap.created_date).toLocaleString()}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-end ">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end">{swap?.source_exchange ? 'Exchange' : 'Network'}:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row">
                                                                <div className="flex flex-row items-center ml-1">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <span></span>
                                                                            <Image alt={`Source token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="mx-1">
                                                                        <span className="text-white">{swap?.input_transaction?.amount}</span>
                                                                        <span className="mx-1 text-white">{swap?.source_network_asset}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center ml-1">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <span></span>
                                                                        <Image alt={`Source chain icon ${index}`} src={settings?.resolveImgSrc(sourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-0.5 text-white">
                                                                    <Link href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                                                        <span className="mx-0.5 hover:text-gray-300">{sourceLayer?.display_name}</span>
                                                                        <ExternalLink width={16} height={16} />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-end ">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end">{swap?.destination_exchange ? 'Exchange' : 'Network'}:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row">
                                                                <div className="flex flex-row items-center ml-1">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <span></span>
                                                                            <Image alt={`Destination token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="mx-1">
                                                                        <span className="text-white">{swap?.output_transaction?.amount}</span>
                                                                        <span className="mx-1 text-white">{swap?.destination_network_asset}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center ml-1">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <span></span>
                                                                        <Image alt={`Destination chain icon ${index}`} src={settings?.resolveImgSrc(destinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-0.5 text-white">
                                                                    <Link href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className={`${!swap?.output_transaction ? "disabled" : ""} hover:text-gray-300 inline-flex items-center w-fit`}>
                                                                        <span className="mx-0.5 hover:text-gray-300">{destinationLayer?.display_name}</span>
                                                                        <ExternalLink width={16} height={16} />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}