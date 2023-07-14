"use client"
import { shortenAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/ApiResponse";
import CopyButton from "../../components/buttons/copyButton";
import { ArrowRight, ChevronRight } from 'lucide-react';
import useSWR from "swr";
import StatusIcon from '../../components/SwapHistory/StatusIcons';
import Link from "next/link";
import Image from "next/image";
import { useSettingsState } from "@/context/settings";
import LoadingBlocks from "@/components/LoadingBlocks";
import { SwapStatus } from "@/models/SwapStatus";
import AppSettings from "@/lib/AppSettings";
import NotFound from "@/components/notFound";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { useRouter } from "next/navigation";
import BackBtn from "@/helpers/BackButton";
import { usePathname } from 'next/navigation'
import Error500 from "@/components/Error500";

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
    const settings = useSettingsState();
    const router = useRouter();
    const pathname = usePathname();
    const fetcher = (url: string) => fetch(url).then(r => r.json())
    const { data, error, isLoading } = useSWR<ApiResponse<Swap[]>>(`${AppSettings.LayerswapApiUri}/api/explorer/${searchParam}`, fetcher, { dedupingInterval: 60000 });
    const swap = data?.data?.[0];

    const swapSourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());
    const swapDestinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());
    const sourceNetwork = settings?.networks?.find(n => n.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());
    const destinationNetwork = settings?.networks?.find(n => n.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());

    // const elapsedTimeInMiliseconds = new Date(swap?.output_transaction?.created_date || '')?.getTime() - new Date(swap?.input_transaction?.created_date || '')?.getTime();
    // const timeElapsed = millisToMinutesAndSeconds(elapsedTimeInMiliseconds);

    const filteredData = data?.data?.filter(s => s?.input_transaction);
    if (error) return <Error500 />
    if (isLoading) return <LoadingBlocks />
    if (data?.error) return <NotFound />

    return (Number(data?.data?.length) > 1 ?
        <div className="px-4 sm:px-6 lg:px-8 w-full">
            {pathname !== '/' && <div className='hidden xl:block w-fit mb-1 hover:bg-secondary-600 hover:text-accent-foreground rounded ring-offset-background transition-colors -ml-5'>
                <BackBtn />
            </div>}
            <div className="flow-root w-full">
                <div className="inline-block min-w-full align-middle">
                    <h1 className="h5 mb-4 text-white flex gap-1">
                        <span className="font-bold text-primary-text">Address: </span>
                        <span className="break-all">
                            {swap?.destination_address}
                            <CopyButton toCopy={swap?.destination_address || ''} iconHeight={16} iconClassName="order-2" iconWidth={16} className="inline-flex items-center ml-1 align-middle" />
                        </span>
                    </h1>
                </div>
                <div className={`${Number(filteredData?.length) > 5 ? "overflow-y-scroll h-full max-h-[55vh] 2xl:max-h-[65vh] dataTable" : "overflow-hidden"} -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8`}>
                    <div className="inline-block min-w-full pb-2 align-middle sm:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-white ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-secondary-500 relative">
                                <thead className="bg-secondary-800 sticky -top-1 z-10 sm:rounded-lg">
                                    <tr>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white sm:rounded-tl-lg">
                                            Source Tx Hash
                                        </th>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white">
                                            Source
                                        </th>
                                        <th scope="col" className="sticky top-0 px-3 py-3.5 text-left text-sm font-semibold text-white rouned-tr-lg">
                                            Destination
                                        </th>
                                        <th scope="col" className="sticky top-0 px-4 py-3.5 text-left text-sm font-semibold text-white rounded-tr-lg">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-400 bg-secondary">
                                    {filteredData?.map((swap, index) => {
                                        const sourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase());
                                        const destinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase());

                                        return (
                                            <tr key={index} onClick={() => router.push(`/${swap?.input_transaction?.transaction_id}`)} className="hover:bg-secondary-600 hover:cursor-pointer">
                                                <td className="whitespace-nowrap py-2 px-3 text-sm font-medium text-white flex flex-col">
                                                    <Link href={`/${swap?.input_transaction?.transaction_id}`} onClick={(e) => e.stopPropagation()} className="hover:text-gray-300 inline-flex items-center w-fit">
                                                        {shortenAddress(swap?.input_transaction?.transaction_id)}
                                                    </Link>
                                                    <StatusIcon swap={swap.status} />
                                                    <span className="text-primary-text">{new Date(swap.created_date).toLocaleString()}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-end ">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end mb-2">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end">{swap?.source_exchange ? 'Exchange' : 'Network'}:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row mb-2">
                                                                <div className="flex flex-row items-center ml-4">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <span></span>
                                                                            <Image alt={`Source token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="mx-2.5">
                                                                        <span className="text-white">{swap?.input_transaction?.amount}</span>
                                                                        <span className="mx-1 text-white">{swap?.source_network_asset}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center ml-4">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <span></span>
                                                                        <Image alt={`Source chain icon ${index}`} src={settings?.resolveImgSrc(sourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-2 text-white">
                                                                    <Link href={`${swap?.input_transaction?.explorer_url}`} onClick={(e) => e.stopPropagation()} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                                                        <span className="mx-0.5 hover:text-gray-300 underline">{sourceLayer?.display_name}</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-end ">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end mb-2">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end">{swap?.destination_exchange ? 'Exchange' : 'Network'}:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row">
                                                                <div className="flex flex-row items-center ml-4 mb-2">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <Image alt={`Destination token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    {
                                                                        swap?.output_transaction?.amount ?
                                                                            <div className="mx-2.5">
                                                                                <span className="text-white mx-0.5">{swap?.output_transaction?.amount}</span>
                                                                                <span className="text-white">{swap?.destination_network_asset}</span>
                                                                            </div>
                                                                            :
                                                                            <span className="ml-2.5">-</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="text-sm md:text-base flex flex-row items-center ml-4">
                                                                <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                    <span>
                                                                        <span></span>
                                                                        <Image alt={`Destination chain icon ${index}`} src={settings?.resolveImgSrc(destinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-2 text-white">
                                                                    <Link href={`${swap?.output_transaction?.explorer_url}`} onClick={(e) => e.stopPropagation()} target="_blank" className={`${!swap?.output_transaction ? "disabled" : ""} hover:text-gray-300 inline-flex items-center w-fit`}>
                                                                        <span className={`${swap?.output_transaction?.explorer_url ? "underline" : ""} mx-0.5 hover:text-gray-300`}>{destinationLayer?.display_name}</span>
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
        :
        <div className="w-full">
            <div className="sm:rounded-lg w-full">
                {swap && <div className="py-2 lg:py-10 pt-4 sm:px-6 lg:px-8">
                    {pathname !== '/' && <div className='hidden xl:block w-fit mb-1 hover:bg-secondary-600 hover:text-accent-foreground rounded ring-offset-background transition-colors -ml-5'>
                        <BackBtn />
                    </div>}
                    <div className="md:ml-0 md:mb-6 flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="mb-4 sm:mb-0">
                            <div className="text-sm md:text-base text-[#475467] dark:text-white sm:flex justify-between w-full">
                                <div className="items-center text-base mb-0.5 text-white">
                                    <div className="mr-2 font-medium text-xl">
                                        <span className="flex"><StatusIcon swap={swap.status} /></span>
                                        <div className="text-sm mt-1 text-primary-text">
                                            <span className="mr-1 text-primary-text-muted">Created at:</span>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className="cursor-default">{new Date(swap.created_date).toLocaleString()}</TooltipTrigger>
                                                    <TooltipContent>
                                                        {new Date(swap.created_date).toUTCString()}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch rounded-md text-primary-text gap-4">
                        <div className="rounded-md w-full p-6 grid gap-y-3 lg:max-w-[50%] bg-secondary-900 rounded-t-lg border-secondary-500 border-t-4 shadow-lg">
                            <div className="flex items-center text-white">
                                <div className="mr-2 uppercase text-socket-table text-normal font-medium">Source Transaction</div>
                                <div className="flex flex-row items-center text-btn-success bg-btn-success p-1 rounded">
                                    <span className={`${swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ? "text-green-200 bg-green-100/20 !border-green-200/50" : ""} border border-transparent p-1 rounded-md mx-1.5 font-medium uppercase md:text-sm text-xs`}>{swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ? "COMPLETED" : "PENDING"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Hash</div>
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center text-white">
                                        <a href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center second-link">
                                            <span className="break-all link link-underline link-underline-black">{swap?.input_transaction?.transaction_id}</span>
                                        </a>
                                        <CopyButton toCopy={swap?.input_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                            {swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ?
                                null
                                :
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">
                                        Confirmations
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white ml-1">
                                            {swap?.input_transaction?.confirmations >= swap?.input_transaction?.max_confirmations ? swap?.input_transaction?.max_confirmations : swap?.input_transaction?.confirmations}/{swap?.input_transaction?.max_confirmations}
                                        </span>
                                    </div>
                                </div>
                            }
                            <div className="flex justify-around">
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">Token Sent</div>
                                    <div className="flex items-center">
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white flex items-center">
                                            <Image alt="Source token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                            {swap?.input_transaction?.amount} {swap?.source_network_asset}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">{swap?.source_exchange ? 'Exchange' : 'Network'}</div>
                                    <div className="flex items-center">
                                        <Image alt="Source chain icon" src={settings?.resolveImgSrc(swapSourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapSourceLayer?.display_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Sender Address</div>
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center text-white">
                                        <a href={`${sourceNetwork?.account_explorer_template?.replace('{0}', swap?.input_transaction?.from)}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                            <span className="break-all link link-underline link-underline-black">{swap?.input_transaction?.from}</span>
                                        </a>
                                        <CopyButton toCopy={swap?.input_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rotate-90 lg:rotate-0 self-center"><ArrowRight className="text-white w-6 h-auto" /></div>
                        <div className="rounded-md w-full p-6 grid gap-y-3 text-primary-text bg-secondary-900 border-secondary-500 border-t-4 shadow-lg relative">
                            {swap.status == SwapStatus.LsTransferPending || swap.status == SwapStatus.UserTransferPending ? <span className="pendingAnim"></span> : null}
                            <div className="flex items-center text-white">
                                <div className="mr-2 uppercase text-socket-table text-normal font-medium">Destination Transaction</div>
                                <div className="flex flex-row items-center text-btn-success bg-btn-success p-1 rounded">
                                    {DestTxStatus(swap)}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Hash</div>
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    {swap?.output_transaction?.transaction_id ?
                                        <div className="flex items-center text-white">
                                            <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                <span className="break-all link link-underline link-underline-black">{swap?.output_transaction?.transaction_id}</span>
                                            </a>
                                            <CopyButton toCopy={swap?.output_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                        </div>
                                        :
                                        <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="flex justify-around">
                                <div className="flex-1">
                                    <div className="text-base font-normal text-socket-secondary">Token Received</div>
                                    <div className="flex items-center">
                                        {swap?.output_transaction?.amount ?
                                            <div className="flex items-center">
                                                <Image alt="Destination token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
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
                                        <Image alt="Destination chain icon" src={settings?.resolveImgSrc(swapDestinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapDestinationLayer?.display_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-normal text-socket-secondary">Receiver Address</div>
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    {swap?.output_transaction?.to ?
                                        <div className="flex items-center text-white">
                                            <a href={`${destinationNetwork?.account_explorer_template?.replace("{0}", swap?.output_transaction?.to)}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                <span className="break-all link link-underline link-underline-black">{swap?.output_transaction?.to}</span>
                                            </a>
                                            <CopyButton toCopy={swap?.destination_address} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                        </div>
                                        :
                                        <span className="ml-1">-</span>
                                    }
                                </div>
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
    if (swapStatus == SwapStatus.Completed) {
        return <span className="mx-1.5 font-medium md:text-sm text-xs border p-1 rounded-md text-green-200 bg-green-100/20 !border-green-200/50">Completed</span>
    } else if (swapStatus == SwapStatus.LsTransferPending || swapStatus == SwapStatus.UserTransferPending) {
        return <span className="mx-1.5 font-medium md:text-sm text-xs border p-1 rounded-md text-yellow-200 bg-yellow-100/20 !border-yellow-200/50">Pending</span>
    } else if (swapStatus == SwapStatus.Failed && swap?.input_transaction) {
        return <span className="mx-1.5 font-medium md:text-sm text-xs border p-1 rounded-md text-red-200 bg-red-100/20 !border-red-200/50">Failed</span>
    }
}
