"use client"
import { ApiResponse } from "@/models/ApiResponse";
import useSWR from "swr"
import { ChevronRight } from "lucide-react";
import { useSettingsState } from "@/context/settings";
import Image from "next/image";
import Link from "next/link";
import LoadingBlocks from "@/components/LoadingBlocks";
import { SwapStatus } from "@/models/SwapStatus";
import { useRouter } from "next/navigation";
import AppSettings from "@/lib/AppSettings";
import Error500 from "@/components/Error500";
import { TransactionType } from "@/models/TransactionTypes";

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
    transactions: Transaction[]
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
    usd_value: number,
    type: string
}

export default function DataTable() {
    const fetcher = (url: string) => fetch(url).then(r => r.json())
    const { data, error, isLoading } = useSWR<ApiResponse<Swap[]>>(`${AppSettings.LayerswapApiUri}/api/explorer/?statuses=1&statuses=4`, fetcher, { dedupingInterval: 60000 });
    const swapsData = data?.data;
    const settings = useSettingsState();
    const router = useRouter();

    if (error) return <Error500 />
    if (isLoading) return <LoadingBlocks />

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-full max-h-[55vh] 2xl:max-h-[65vh] dataTable">
                    <div className="inline-block h-screen min-w-full pb-2 align-middle sm:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-white ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-secondary-500 relative">
                                <thead className="bg-secondary-800 sticky -top-1 z-10 sm:rounded-lg">
                                    <tr>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white rounded-tl-lg">
                                            Status
                                        </th>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Source
                                        </th>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white rounded-tr-lg">
                                            Destination
                                        </th>
                                        <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white rounded-tr-lg">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-400 bg-secondary overflow-y-scroll">
                                    {swapsData?.filter(s => s.transactions?.some(t => t?.type == TransactionType.Input))?.map((swap, index) => {
                                        const sourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase())
                                        const destinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase())
                                        const input_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Input);
                                        const output_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Output);

                                        return (
                                            <tr key={index} onClick={() => router.push(`/${input_transaction?.transaction_id}`)} className="cursor-pointer hover:bg-secondary-600">
                                                <td className="whitespace-nowrap py-2 px-3 text-sm font-medium text-white flex flex-col">
                                                    <div className="flex flex-row items-center text-btn-success bg-btn-success py-1 rounded">
                                                        {DestTxStatus(swap)}
                                                    </div>
                                                    <span className="text-primary-text">{new Date(swap.created_date).toLocaleString()}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-start mr-4">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end mb-1">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end min-w-[70px]">Source:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row mb-1">
                                                                <div className="flex flex-row items-center">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <Image alt={`Source token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="mx-2.5">
                                                                        <span className="text-white">{input_transaction?.amount}</span>
                                                                        <span className="mx-1 text-white">{swap?.source_network_asset}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <Image alt={`Source chain icon ${index}`} src={settings?.resolveImgSrc(sourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-2 text-white">
                                                                    <Link href={`${input_transaction?.explorer_url}`} onClick={(e) => e.stopPropagation()} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                                                        <span className="mx-0.5 hover:text-gray-300 underline hover:no-underline">{sourceLayer?.display_name}</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end mb-1">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end min-w-[70px]">Destination:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row">
                                                                <div className="flex flex-row items-center ml-4 mb-1">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <Image alt={`Destination token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    {output_transaction?.amount ?
                                                                        <div className="mx-2.5">
                                                                            <span className="text-white">{output_transaction?.amount}</span>
                                                                            <span className="mx-1 text-white">{swap?.destination_network_asset}</span>
                                                                        </div>
                                                                        :
                                                                        <span className="ml-2.5">-</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center ml-4">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <Image alt={`Destination chain icon ${index}`} src={settings?.resolveImgSrc(destinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-2 text-white">
                                                                    <Link href={`${output_transaction?.explorer_url}`} onClick={(e) => e.stopPropagation()} target="_blank" className={`${!output_transaction ? "disabled" : ""} hover:text-gray-300 inline-flex items-center w-fit`}>
                                                                        <span className={`${output_transaction?.explorer_url ? "underline" : ""} mx-0.5 hover:text-gray-300 hover:no-underline`}>{destinationLayer?.display_name}</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap text-sm mr-4 text-primary-text">
                                                    <ChevronRight />
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


function DestTxStatus(swap: Swap) {
    const swapStatus = swap?.status;
    const input_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Input);
    if (swapStatus == SwapStatus.LsTransferPending) {
        return <span className="font-medium md:text-sm text-xs border p-1 rounded-md text-yellow-200 bg-yellow-100/20 !border-yellow-200/50">Pending</span>
    } else if (swapStatus == SwapStatus.Failed && input_transaction) {
        return <span className="font-medium md:text-sm text-xs border p-1 rounded-md text-red-200 bg-red-100/20 !border-red-200/50">Failed</span>
    } else if (swapStatus == SwapStatus.Completed) {
        return <span className="font-medium md:text-sm text-xs border p-1 rounded-md text-green-200 bg-green-100/20 !border-green-200/50">Completed</span>
    }
}