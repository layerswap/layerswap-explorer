"use client"
import { shortenAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/ApiResponse";
import CopyButton from "../../components/buttons/copyButton";
import { ExternalLink } from 'lucide-react';
import useSWR from "swr";
import StatusIcon from '../../components/SwapHistory/StatusIcons';
import Link from "next/link";
import Image from "next/image";
import { useSettingsState } from "@/context/settings";
import LoadingBlocks from "@/components/LoadingBlocks";
import { SwapStatus } from "@/models/SwapStatus";
import AppSettings from "@/lib/AppSettings";

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
    const { data, error, isLoading } = useSWR<ApiResponse<Swap[]>>(`${AppSettings.LayerswapApiUri}/api/explorer/${searchParam}`, fetcher, { dedupingInterval: 60000 });
    const swap = data?.data?.[0];
    const settings = useSettingsState();
    const swapSourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());
    const swapDestinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());

    if (error) return <div>failed to load</div>
    if (isLoading) return <LoadingBlocks />

    return (Number(data?.data?.length) > 1 ?
        <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="mt-8 flow-root w-full">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 overflow-y-scroll h-full max-h-[70vh] dataTable">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <h1 className="h5 mb-2 text-white">
                            <span className="font-bold text-primary-text">Address: </span>
                            <span className="break-all">
                                {swap?.destination_address}
                                <CopyButton toCopy={swap?.destination_address || ''} iconHeight={16} iconClassName="order-2" iconWidth={16} className="inline-flex items-center ml-1 align-middle" />
                            </span>
                        </h1>
                    </div>
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-white ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-secondary-500 relative">
                                <thead className="bg-secondary-800 sticky top-0 z-10">
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
                                <tbody className="divide-y divide-secondary-400 bg-secondary">
                                    {data?.data?.filter(s => s?.input_transaction)?.map((swap, index) => {
                                        const sourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase());
                                        const destinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase());

                                        return (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-white flex flex-col">
                                                    <Link href={`/${swap?.input_transaction?.transaction_id}`} className="hover:text-gray-300 inline-flex items-center w-fit">
                                                        {shortenAddress(swap?.input_transaction?.transaction_id)}
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
                                                                        <span className="mx-0.5 text-white">{swap?.source_network_asset}</span>
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
                                                                            <Image alt={`Destination token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full" />
                                                                        </span>
                                                                    </div>
                                                                    {
                                                                        swap?.output_transaction?.amount ?
                                                                            <div className="mx-0.5">
                                                                                <span className="text-white mx-0.5">{swap?.output_transaction?.amount}</span>
                                                                                <span className="text-white">{swap?.destination_network_asset}</span>
                                                                            </div>
                                                                            :
                                                                            <div className="ml-1">
                                                                                -
                                                                            </div>
                                                                    }
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
        :
        <div className="px-6 lg:px-8 w-full">
            <div className="bg-secondary-700 shadow-xl sm:rounded-lg border border-secondary-500 w-full lg:px-4">
                {swap && <div className="py-4 lg:py-10 pt-4 px-3">
                    <div className="flex items-stretch md:ml-0 md:mb-6 flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="flex flex-row ml-2 mb-4 sm:mb-0">
                            <div className="text-sm md:text-base text-[#475467] dark:text-white">
                                <div className="flex mx-2 items-center text-base mb-0.5 text-white">
                                    <div className="mr-2 font-medium text-lg">
                                        <span><StatusIcon swap={swap.status} /></span>
                                    </div>
                                </div>
                                <div className="flex mx-2 font-normal text-normal text-socket-secondary text-white">
                                    <div className="mr-1">{new Date(swap.created_date).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch md:border-[1px] border-tx-page border-slate-700 rounded-md p-2 text-primary-text">
                        <div className="border-[1px] border-dashed border-slate-700 rounded-md border-tx-page w-full m-4 p-4 grid gap-y-3 lg:max-w-[50%]">
                            <div className="flex items-center text-white">
                                <div className="mr-2 uppercase text-socket-table text-normal font-medium">Source Transaction</div>
                                <div className="flex flex-row items-center text-btn-success bg-btn-success p-1 rounded">
                                    <span className={`${swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ? "text-green-200 bg-green-100/20 !border-green-200/50" : ""} border border-transparent p-1 rounded-md mx-1.5 font-medium uppercase md:text-sm text-xs`}>{swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ? "COMPLETED" : "PENDING"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Source Tx Hash</div>
                                <div className="flex items-center">
                                    <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                        <div className="flex items-center text-white">
                                            <a href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center">
                                                <span className="break-all w-11/12">{swap?.input_transaction?.transaction_id}</span>
                                                <ExternalLink width={16} height={16} className="mx-1" />
                                            </a>
                                            <CopyButton toCopy={swap?.input_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="lg:-ml-3" />
                                        </div>
                                    </div>
                                    <div className="cursor-pointer"></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-base font-normal text-socket-secondary">
                                    Confirmations
                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white ml-1">
                                        {swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ? swap?.input_transaction?.max_confirmations : swap?.input_transaction?.confirmations}/{swap?.input_transaction?.max_confirmations}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-around">
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">Token Sent</div>
                                    <div className="flex items-center">
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white flex items-center">
                                            <Image alt="Source token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full mr-0.5" />
                                            {swap?.input_transaction?.amount} {swap?.source_network_asset}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">{swap?.source_exchange ? 'Exchange' : 'Network'}</div>
                                    <div className="flex items-center">
                                        <Image alt="Source chain icon" src={settings?.resolveImgSrc(swapSourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full mr-0.5" />
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapSourceLayer?.display_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Sender Address</div>
                                <div className="flex items-center text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center text-white">
                                        <a href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center break-all">
                                            <span className="w-11/12">{swap?.input_transaction?.from}</span>
                                            <ExternalLink width={16} height={16} className="mx-1" />
                                        </a>
                                        <CopyButton toCopy={swap?.input_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Timestamp</div>
                                <div className="flex items-center text-sm lg:text-base font-medium text-tx-base text-white">{new Date(swap?.input_transaction?.created_date)?.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="rotate-90 lg:rotate-0 self-center"><svg width="18" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M11 .342c-.256 0-.512.1-.707.295l-.086.086a.999.999 0 0 0 0 1.414L14.07 6H1a1 1 0 0 0 0 2h13.07l-3.863 3.863a.999.999 0 0 0 0 1.414l.086.086a.999.999 0 0 0 1.414 0l5.656-5.656a.999.999 0 0 0 0-1.414L11.707.637A.998.998 0 0 0 11 .342Z" fill="#667085"></path></svg></div>
                        <div className="border-[1px] border-dashed border-slate-700	border-tx-page rounded-md w-full m-4 p-4 grid gap-y-3 text-primary-text">
                            <div className="flex items-center text-white">
                                <div className="mr-2 uppercase text-socket-table text-normal font-medium">Destination Transaction</div>
                                <div className="flex flex-row items-center text-btn-success bg-btn-success p-1 rounded">
                                    {DestTxStatus(swap)}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Destination Tx Hash</div>
                                <div className="flex items-center">
                                    <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                        {swap?.output_transaction?.transaction_id ?
                                            <div className="flex items-center text-white">
                                                <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center">
                                                    <span className="break-all w-11/12">{swap?.output_transaction?.transaction_id}</span>
                                                    <ExternalLink width={16} height={16} className="px-1" />
                                                </a>
                                                <CopyButton toCopy={swap?.output_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="lg:-ml-3" />
                                            </div>
                                            :
                                            <span>-</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-around">
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">Token Received</div>
                                    <div className="flex items-center">
                                        {swap?.output_transaction?.amount ?
                                            <div className="flex items-center">
                                                <Image alt="Destination token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full" />
                                                <span className="text-sm lg:text-base font-medium text-socket-table text-white ml-0.5">{swap?.output_transaction?.amount} {swap?.destination_network_asset}</span>
                                            </div>
                                            :
                                            <span>-</span>
                                        }
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">{swap?.destination_exchange ? 'Exchange' : 'Network'}</div>
                                    <div className="flex items-center">
                                        <Image alt="Destination chain icon" src={settings?.resolveImgSrc(swapDestinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-full mr-0.5" />
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapDestinationLayer?.display_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Receiver Address</div>
                                <div className="flex items-center text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center text-white">
                                        <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center break-all">
                                            <span className="w-11/12">{swap?.destination_address}</span>
                                            <ExternalLink width={16} height={16} className="mx-1" />
                                        </a>
                                        <CopyButton toCopy={swap?.destination_address} iconHeight={16} iconClassName="order-2" iconWidth={16} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Timestamp</div>
                                {swap?.output_transaction?.created_date ?
                                    <div className="flex items-center text-sm lg:text-base font-medium text-tx-base text-white">{new Date(swap?.output_transaction?.created_date)?.toLocaleString()}</div>
                                    :
                                    <span>-</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}


function DestTxStatus(swap: Swap) {
    const swapStatus = swap?.status;
    if (swapStatus == SwapStatus.LsTransferPending) {
        return <span className="mx-1.5 font-medium uppercase md:text-sm text-xs border p-1 rounded-md text-yellow-200 bg-yellow-100/20 !border-yellow-200/50">Pending</span>
    } else if (swapStatus == SwapStatus.Failed && swap?.input_transaction) {
        return <span className="mx-1.5 font-medium uppercase md:text-sm text-xs border p-1 rounded-md text-red-200 bg-red-100/20 !border-red-200/50">Failed</span>
    } else if (swapStatus == SwapStatus.Completed) {
        return <span className="mx-1.5 font-medium uppercase md:text-sm text-xs border p-1 rounded-md text-green-200 bg-green-100/20 !border-green-200/50">Completed</span>
    }
}