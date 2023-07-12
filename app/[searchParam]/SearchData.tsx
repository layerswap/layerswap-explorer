"use client"
import { shortenAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/ApiResponse";
import CopyButton from "../../components/buttons/copyButton";
import { ExternalLink, ServerOff } from 'lucide-react';
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
    const router = useRouter()

    const swapSourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());
    const swapDestinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());
    const sourceNetwork = settings?.networks?.find(n => n.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());
    const destinationNetwork = settings?.networks?.find(n => n.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());

    // const elapsedTimeInMiliseconds = new Date(swap?.output_transaction?.created_date || '')?.getTime() - new Date(swap?.input_transaction?.created_date || '')?.getTime();
    // const timeElapsed = millisToMinutesAndSeconds(elapsedTimeInMiliseconds);

    const filteredData = data?.data?.filter(s => s?.input_transaction);
    if (error) return <div className="flex h-full items-center justify-center p-5 w-full flex-1">
        <div className="text-center">
            <div className="inline-flex rounded-full relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="116" height="116" viewBox="0 0 116 116" fill="none">
                    <circle cx="58" cy="58" r="58" fill="#E43636" fillOpacity="0.1" />
                    <circle cx="58" cy="58" r="45" fill="#E43636" fillOpacity="0.5" />
                    <circle cx="58" cy="58" r="30" fill="#E43636" />
                </svg>
                <ServerOff className="text-white absolute top-[calc(50%-16px)] right-[calc(50%-16px)] h-8 w-auto" />
            </div>
            <h1 className="mt-5 text-[36px] font-bold text-white lg:text-[50px]">500 - Server error</h1>
            <p className="text-primary-text mt-5 lg:text-lg">Oops something went wrong. Try to refresh this page or <br /> feel free to contact us if the problem presists.</p>
        </div>
    </div>
    if (isLoading) return <LoadingBlocks />
    if (data?.error) return <NotFound />

    return (Number(data?.data?.length) > 1 ?
        <div className="px-4 sm:px-6 lg:px-8 w-full">
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
                <div className={`${Number(filteredData?.length) > 5 ? "overflow-y-scroll h-full max-h-[60vh] 2xl:max-h-[75vh] dataTable" : "overflow-hidden"} -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8`}>
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
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-400 bg-secondary">
                                    {filteredData?.map((swap, index) => {
                                        const sourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase());
                                        const destinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase());

                                        return (
                                            <tr key={index} onClick={() => router.push(`/${swap?.input_transaction?.transaction_id}`)} className="hover:bg-secondary-600 hover:cursor-pointer">
                                                <td className="whitespace-nowrap py-2 px-3 text-sm font-medium text-white flex flex-col">
                                                    <Link href={`/${swap?.input_transaction?.transaction_id}`} className="hover:text-gray-300 inline-flex items-center w-fit">
                                                        {shortenAddress(swap?.input_transaction?.transaction_id)}
                                                    </Link>
                                                    <StatusIcon swap={swap.status} />
                                                    <span className="text-primary-text">{new Date(swap.created_date).toLocaleString()}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
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
                                                                            <Image alt={`Source token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
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
                                                                        <Image alt={`Source chain icon ${index}`} src={settings?.resolveImgSrc(sourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-0.5 text-white">
                                                                    <Link href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                                                        <span className="mx-0.5 hover:text-gray-300">{sourceLayer?.display_name}</span>
                                                                        {swap?.input_transaction?.explorer_url && <ExternalLink width={16} height={16} />}
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
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
                                                                            <Image alt={`Destination token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
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
                                                                        <Image alt={`Destination chain icon ${index}`} src={settings?.resolveImgSrc(destinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                    </span>
                                                                </div>
                                                                <div className="mx-0.5 text-white">
                                                                    <Link href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className={`${!swap?.output_transaction ? "disabled" : ""} hover:text-gray-300 inline-flex items-center w-fit`}>
                                                                        <span className="mx-0.5 hover:text-gray-300">{destinationLayer?.display_name}</span>
                                                                        {swap?.output_transaction?.explorer_url && <ExternalLink width={16} height={16} />}
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
                {swap && <div className="py-2 lg:py-10 pt-4 px-3">
                    <div className="md:ml-0 md:mb-6 flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="ml-2 mb-4 sm:mb-0">
                            <div className="text-sm md:text-base text-[#475467] dark:text-white sm:flex justify-between w-full">
                                <div className="items-center text-base mb-0.5 text-white">
                                    <div className="mr-2 font-medium text-lg">
                                        <span className="flex"><StatusIcon swap={swap.status} /></span>
                                    </div>
                                </div>
                                <div className="mx-2 font-normal text-normal text-socket-secondary text-primary-text">
                                    <div>
                                        <span className="mr-1">Created at:</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-default text-white">{new Date(swap.created_date).toLocaleString()}</TooltipTrigger>
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
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    <div className="flex items-center text-white">
                                        <a href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                            <span className="break-all w-11/12">{swap?.input_transaction?.transaction_id}</span>
                                            <ExternalLink width={16} height={16} className="mx-1" />
                                        </a>
                                        <CopyButton toCopy={swap?.input_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} />
                                    </div>
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
                                            <span className="break-all w-11/12">{swap?.input_transaction?.from}</span>
                                            <ExternalLink width={16} height={16} className="mx-1" />
                                        </a>
                                        <CopyButton toCopy={swap?.input_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16} />
                                    </div>
                                </div>
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
                                <div className="text-sm lg:text-base font-medium text-tx-base w-fit">
                                    {swap?.output_transaction?.transaction_id ?
                                        <div className="flex items-center text-white">
                                            <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                <span className="break-all w-11/12">{swap?.output_transaction?.transaction_id}</span>
                                                <ExternalLink width={16} height={16} className="mx-1" />
                                            </a>
                                            <CopyButton toCopy={swap?.output_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} />
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
                                    {swap?.output_transaction ?
                                        <div className="flex items-center text-white">
                                            <a href={`${destinationNetwork?.account_explorer_template?.replace("{0}", swap?.output_transaction?.to)}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                <span className="break-all w-11/12">{swap?.output_transaction?.to}</span>
                                                <ExternalLink width={16} height={16} className="mx-1" />
                                            </a>
                                            <CopyButton toCopy={swap?.destination_address} iconHeight={16} iconClassName="order-2" iconWidth={16} />
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
    if (swapStatus == SwapStatus.LsTransferPending || SwapStatus.UserTransferPending) {
        return <span className="mx-1.5 font-medium uppercase md:text-sm text-xs border p-1 rounded-md text-yellow-200 bg-yellow-100/20 !border-yellow-200/50">Pending</span>
    } else if (swapStatus == SwapStatus.Failed && swap?.input_transaction) {
        return <span className="mx-1.5 font-medium uppercase md:text-sm text-xs border p-1 rounded-md text-red-200 bg-red-100/20 !border-red-200/50">Failed</span>
    } else if (swapStatus == SwapStatus.Completed) {
        return <span className="mx-1.5 font-medium uppercase md:text-sm text-xs border p-1 rounded-md text-green-200 bg-green-100/20 !border-green-200/50">Completed</span>
    }
}
