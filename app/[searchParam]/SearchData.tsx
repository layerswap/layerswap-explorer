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
    const { data, error, isLoading } = useSWR<ApiResponse<Swap[]>>(`https://bridge-api-dev.layerswap.cloud/api/explorer/${searchParam}`, fetcher, { dedupingInterval: 60000 })
    const swap = data?.data?.[0];
    const settings = useSettingsState();

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    return (Number(data?.data?.length) > 1 ?
        <div className="px-4 sm:px-6 lg:px-8 w-full">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-white ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-secondary-500">
                                <thead className="bg-secondary-800">
                                    <tr>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            To Address
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Source
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Destination
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-400 bg-secondary">
                                    {data?.data?.map((swap, index) => {
                                        const sourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase())
                                        const destinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase())

                                        return (
                                            <tr key={index}>
                                                <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-white flex flex-col">
                                                    <Link href={`/${swap.destination_address}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
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
                                                                <span className="ml-1 text-white">{sourceLayer?.display_name}</span>
                                                                <div className="mx-0.5">
                                                                    <Link href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
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
                                                                <span className="ml-1 text-white">{destinationLayer?.display_name}</span>
                                                                <div className="mx-0.5">
                                                                    <Link href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
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
        <div className="overflow-hidden bg-secondary-700 shadow-xl sm:rounded-lg border border-secondary-500 w-full max-w-6xl">
            <div className="px-4 py-6 sm:px-6 bg-secondary-800">
                <h3 className="text-base font-semibold leading-7 text-white">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
            </div>
            {swap && <div className="py-10 pt-4 px-3">
                <div className="flex items-start md:ml-0 md:mb-6 flex-col sm:flex-row sm:justify-between sm:items-start">
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
                <div className="flex flex-col lg:flex-row items-center md:border-[1px] border-tx-page border-slate-700 p-2 text-primary-text">
                    <div className="border-[1px] border-dashed border-slate-700 border-tx-page w-full m-4 p-4 grid gap-y-3 lg:max-w-[50%]">
                        <div className="flex items-center text-white">
                            <div className="mr-2 uppercase text-socket-table text-normal font-medium">Source Transaction</div>
                            <div className="flex flex-row items-center text-btn-success bg-btn-success p-1 rounded">
                                <span className={`${swap.status == 'completed' ? "text-green-200" : ""} mx-1.5 font-medium uppercase md:text-sm text-xs`}>{swap.status}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-normal text-socket-secondary ">Source Tx Hash</div>
                            <div className="flex items-center">
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center hover:text-gray-300 text-white">
                                        <CopyButton toCopy={swap?.input_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16}>
                                            {shortenAddress(swap?.input_transaction?.from)}
                                        </CopyButton>
                                        <a href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center ml-1">
                                            <ExternalLink width={16} height={16} />
                                        </a>
                                    </div>
                                </div>
                                <div className="cursor-pointer"></div>
                            </div>
                        </div>
                        <div className="flex justify-around">
                            <div className="flex-1">
                                <div className="text-base font-normal text-socket-secondary">Token Sent</div>
                                <div className="flex items-center">
                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swap?.input_transaction?.amount} {swap?.source_network_asset}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-base font-normal text-socket-secondary">Chain</div>
                                <div className="flex items-center">
                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white">Arbitrum</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-normal text-socket-secondary">Sender Address</div>
                            <div className="flex items-center text-sm lg:text-base font-medium text-tx-base w-fit">
                                <div className="flex items-center hover:text-gray-300 text-white">
                                    <CopyButton toCopy={swap?.output_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16}>
                                        {shortenAddress(swap?.input_transaction?.from)}
                                    </CopyButton>
                                    <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center ml-1">
                                        <ExternalLink width={16} height={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-normal text-socket-secondary">Timestamp</div>
                            <div className="flex items-center text-sm lg:text-base font-medium text-tx-base text-white">{new Date(swap.created_date).toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="rotate-90 lg:rotate-0"><svg width="18" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M11 .342c-.256 0-.512.1-.707.295l-.086.086a.999.999 0 0 0 0 1.414L14.07 6H1a1 1 0 0 0 0 2h13.07l-3.863 3.863a.999.999 0 0 0 0 1.414l.086.086a.999.999 0 0 0 1.414 0l5.656-5.656a.999.999 0 0 0 0-1.414L11.707.637A.998.998 0 0 0 11 .342Z" fill="#667085"></path></svg></div>
                    <div className="border-[1px] border-dashed border-slate-700	border-tx-page w-full m-4 p-4 grid gap-y-3 text-primary-text">
                        <div className="flex items-center text-white">
                            <div className="mr-2 uppercase text-socket-table text-normal font-medium">Destination Transaction</div>
                            <div className="flex flex-row items-center text-btn-success bg-btn-success p-1 rounded">
                                <span className={`${swap.status == 'completed' ? "text-green-200" : ""} mx-1.5 font-medium uppercase md:text-sm text-xs`}>{swap?.status}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-normal text-socket-secondary">Destination Tx Hash</div>
                            <div className="flex items-center">
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center hover:text-gray-300 text-white">
                                        <CopyButton toCopy={swap?.output_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16}>
                                            {shortenAddress(swap?.input_transaction?.from)}
                                        </CopyButton>
                                        <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center ml-1">
                                            <ExternalLink width={16} height={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-around">
                            <div className="flex-1">
                                <div className="text-base font-normal text-socket-secondary">Token Received</div>
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swap?.output_transaction?.amount} {swap?.destination_network_asset}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-base font-normal text-socket-secondary">Chain</div>
                                <div className="flex items-center">
                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white">Arbitrum</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-normal text-socket-secondary">Receiver Address</div>
                            <div className="flex items-center text-sm lg:text-base font-medium text-tx-base w-fit">
                                <div className="flex items-center hover:text-gray-300 text-white">
                                    <CopyButton toCopy={swap?.output_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16}>
                                        {shortenAddress(swap?.input_transaction?.from)}
                                    </CopyButton>
                                    <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit inline-flex items-center ml-1">
                                        <ExternalLink width={16} height={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-base font-normal text-socket-secondary">Timestamp</div>
                            <div className="flex items-center text-sm lg:text-base font-medium text-tx-base text-white">{new Date(swap.created_date).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
