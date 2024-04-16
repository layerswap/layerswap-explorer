"use client"
import { ApiResponse } from "@/models/ApiResponse";
import useSWR from "swr"
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoadingBlocks from "@/components/LoadingBlocks";
import { SwapStatus } from "@/models/SwapStatus";
import { useRouter } from "next/navigation";
import Error500 from "@/components/Error500";
import { SwapData, Swap, TransactionType } from "@/models/Swap";
import LayerSwapApiClient from "@/lib/layerSwapApiClient";

export default function DataTable() {
    const apiClient = new LayerSwapApiClient()


    const { data, error, isLoading } = useSWR<ApiResponse<SwapData[]>>("/explorer", apiClient.fetcher, { dedupingInterval: 60000 });
    const swapsData = data?.data?.map(d => d.swap);
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
                                        const input_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Input)
                                        const output_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Output)

                                        const sourceNetwork = swap?.source_network
                                        const sourceToken = swap?.source_token

                                        const sourceExchange = swap?.source_exchange
                                        const destinationExchange = swap?.destination_exchange

                                        const destinationNetwork = swap?.destination_network
                                        const destinationToken = swap?.destination_token

                                        return (
                                            <tr key={index} onClick={() => router.push(`/${input_transaction?.transaction_hash}`)} className="cursor-pointer hover:bg-secondary-600">
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
                                                                            <Image alt={`Source token icon ${index}`} src={sourceToken?.logo || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="mx-2.5">
                                                                        <span className="text-white">{input_transaction?.amount}</span>
                                                                        <span className="mx-1 text-white">{sourceToken?.symbol}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <Image alt={`Source chain icon ${index}`} src={sourceExchange ? sourceExchange?.logo : sourceNetwork?.logo || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-2 text-white">
                                                                    <Link href={`${sourceNetwork?.transaction_explorer_template?.replace('{0}', (input_transaction?.transaction_hash || ''))}`} onClick={(e) => e.stopPropagation()} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                                                        <span className="mx-0.5 hover:text-gray-300 underline hover:no-underline">{sourceExchange ? sourceExchange?.display_name : sourceNetwork?.display_name}</span>
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
                                                                            <Image alt={`Destination token icon ${index}`} src={destinationToken?.logo || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    {output_transaction?.amount ?
                                                                        <div className="mx-2.5">
                                                                            <span className="text-white">{output_transaction?.amount}</span>
                                                                            <span className="mx-1 text-white">{destinationToken?.symbol}</span>
                                                                        </div>
                                                                        :
                                                                        <span className="ml-2.5">-</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center ml-4">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <Image alt={`Destination chain icon ${index}`} src={destinationExchange ? destinationExchange?.logo : destinationNetwork?.logo || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-2 text-white">
                                                                    {
                                                                        output_transaction?.transaction_hash ?
                                                                            <Link href={`${destinationNetwork?.transaction_explorer_template?.replace('{0}', (output_transaction?.transaction_hash || ''))}`} onClick={(e) => e.stopPropagation()} target="_blank" className={`${!output_transaction ? "disabled" : ""} hover:text-gray-300 inline-flex items-center w-fit`}>
                                                                                <span className={`underline mx-0.5 hover:text-gray-300 hover:no-underline`}>{destinationExchange ? destinationExchange?.display_name : destinationNetwork?.display_name}</span>
                                                                            </Link>
                                                                            :
                                                                            <span className={`mx-0.5`}>{destinationExchange ? destinationExchange?.display_name : destinationNetwork?.display_name}</span>
                                                                    }
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