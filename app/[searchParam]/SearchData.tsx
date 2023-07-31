"use client"
import { shortenAddress, shortenHash } from "@/lib/utils";
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
import { getTimeDifferenceFromNow } from "@/components/utils/CalcTime";
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
    timestamp: string,
    transaction_id: string,
    explorer_url: string,
    confirmations: number,
    max_confirmations: number,
    amount: number,
    usd_price: number,
    usd_value: number,
    type: string
}

const options = {
    month: 'short' as const,
    day: 'numeric' as const,
    hour: 'numeric' as const,
    minute: 'numeric' as const,
};

export default function SearchData({ searchParam }: { searchParam: string }) {
    const settings = useSettingsState();
    const router = useRouter();
    const pathname = usePathname();
    const basePath = process.env.NEXT_PUBLIC_APP_BASE_PATH
    const fetcher = (url: string) => fetch(url).then(r => r.json())
    const { data, error, isLoading } = useSWR<ApiResponse<Swap[]>>(`${AppSettings.LayerswapApiUri}/api/explorer/${searchParam}`, fetcher, { dedupingInterval: 60000 });
    const swap = data?.data?.[0];

    const input_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Input);
    const output_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Output);
    const refuel_transaction = swap?.transactions?.find(t => t?.type == TransactionType.Refuel);
    const swapSourceLayer = swap?.source_exchange ? settings?.exchanges?.find(l => l.internal_name?.toLowerCase() === swap.source_exchange?.toLowerCase()) : settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());

    const swapSourceExchange = swap?.source_exchange && settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.source_network?.toLowerCase());
    const swapDestExchange = swap?.destination_exchange && settings?.networks?.find(l => l.internal_name?.toLowerCase() === swap.destination_network?.toLowerCase());

    const swapDestinationLayer = swap?.destination_exchange ? settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap.destination_exchange?.toLowerCase()) : settings?.layers?.find(l => l.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());
    const sourceNetwork = settings?.networks?.find(n => n.internal_name?.toLowerCase() === swap?.source_network?.toLowerCase());
    const destinationNetwork = settings?.networks?.find(n => n.internal_name?.toLowerCase() === swap?.destination_network?.toLowerCase());

    const cost = Number(input_transaction?.amount) - Number(output_transaction?.amount);
    const precision = Number(settings?.currencies?.find(c => c?.asset == swap?.destination_network_asset)?.precision);

    // const elapsedTimeInMiliseconds = new Date(swap?.output_transaction?.created_date || '')?.getTime() - new Date(swap?.input_transaction?.created_date || '')?.getTime();
    // const timeElapsed = millisToMinutesAndSeconds(elapsedTimeInMiliseconds);

    const filteredData = data?.data?.filter(s => s.transactions?.some(t => t?.type == TransactionType.Input));
    if (error) return <Error500 />
    if (isLoading) return <LoadingBlocks />
    if (data?.error) return <NotFound />

    return (Number(data?.data?.length) > 1 ?
        <div className="px-4 sm:px-6 lg:px-8 w-full">
            {!(pathname === '/' || pathname === basePath || pathname === `${basePath}/`) && <div className='hidden xl:block w-fit mb-1 hover:bg-secondary-600 hover:text-accent-foreground rounded ring-offset-background transition-colors -ml-5'>
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
                                        const inputTransaction = swap?.transactions?.find(t => t?.type == TransactionType.Input);
                                        const outputTransaction = swap?.transactions?.find(t => t?.type == TransactionType.Output);

                                        if (!inputTransaction)
                                            return

                                        return (
                                            <tr key={index} onClick={() => router.push(`/${input_transaction?.transaction_id}`)} className="hover:bg-secondary-600 hover:cursor-pointer">
                                                <td className="whitespace-nowrap py-2 px-3 text-sm font-medium text-white flex flex-col">
                                                    <Link href={`/${inputTransaction?.transaction_id}`} onClick={(e) => e.stopPropagation()} className="hover:text-gray-300 inline-flex items-center w-fit">
                                                        {shortenAddress(inputTransaction?.transaction_id)}
                                                    </Link>
                                                    <StatusIcon swap={swap.status} />
                                                    <span className="text-primary-text">{new Date(swap.created_date).toLocaleString()}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-start ">
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end mb-1">Token:</span>
                                                            <span className="text-sm md:text-base font-normal text-socket-ternary place-items-end min-w-[70px]">Source:</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-sm md:text-base flex flex-row mb-1">
                                                                <div className="flex flex-row items-center ml-4">
                                                                    <div className="relative h-4 w-4 md:h-5 md:w-5">
                                                                        <span>
                                                                            <span></span>
                                                                            <Image alt={`Source token icon ${index}`} src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="mx-2.5">
                                                                        <span className="text-white">{inputTransaction?.amount}</span>
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
                                                                    <Link href={`${inputTransaction?.explorer_url}`} onClick={(e) => e.stopPropagation()} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                                                        <span className="mx-0.5 hover:text-gray-300 underline">{sourceLayer?.display_name}</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2 text-sm text-primary-text">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col items-start ">
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
                                                                    {
                                                                        outputTransaction?.amount ?
                                                                            <div className="mx-2.5">
                                                                                <span className="text-white mx-0.5">{outputTransaction?.amount}</span>
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
                                                                    <Link href={`${outputTransaction?.explorer_url}`} onClick={(e) => e.stopPropagation()} target="_blank" className={`${!outputTransaction ? "disabled" : ""} hover:text-gray-300 inline-flex items-center w-fit`}>
                                                                        <span className={`${outputTransaction?.explorer_url ? "underline" : ""} mx-0.5 hover:text-gray-300`}>{destinationLayer?.display_name}</span>
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
                {swap && input_transaction && <div className="py-2 lg:py-10 pt-4 sm:px-6 lg:px-8">
                    {pathname !== '/' && <div className='hidden xl:block w-fit mb-1 hover:bg-secondary-600 hover:text-accent-foreground rounded ring-offset-background transition-colors -ml-5'>
                        <BackBtn />
                    </div>}
                    <div className="md:ml-0 md:mb-6 flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="mb-4 sm:mb-0">
                            <div className="text-sm md:text-base text-[#475467] dark:text-white sm:flex justify-between w-full">
                                <div className="items-center text-base mb-0.5 text-white">
                                    <div className="mr-2 sm:text-xl text-base">
                                        {swap.status == SwapStatus.Completed && output_transaction ?
                                            <div className="flex flex-col sm:flex-row">
                                                <div><StatusIcon swap={swap.status} />
                                                    <span className="whitespace-nowrap text-primary-text align-bottom">&nbsp;at</span>
                                                    <span className="whitespace-nowrap text-white align-bottom">&nbsp;
                                                        <TooltipProvider delayDuration={0}>
                                                            <Tooltip>
                                                                <TooltipTrigger className="cursor-default">{new Date(input_transaction?.created_date)?.toLocaleString('en-US', options)}.</TooltipTrigger>
                                                                <TooltipContent>
                                                                    {new Date(swap.created_date).toUTCString()}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </span>
                                                </div>
                                                <p className="sm:self-end">
                                                    <span className="sm:whitespace-nowrap sm:ml-0.5 text-primary-text">Took</span>
                                                    <span className="text-white">&nbsp;{getTimeDifferenceFromNow(input_transaction?.timestamp, output_transaction?.timestamp)}</span>
                                                </p>
                                                <p className="sm:self-end">
                                                    <span className="text-primary-text sm:ml-1">and cost</span>
                                                    <span className="text-white">&nbsp;{truncateDecimals(cost, precision)} {swap?.source_network_asset}</span>
                                                </p>
                                            </div>
                                            :
                                            swap.status !== SwapStatus.Completed ?
                                                <div className="flex flex-col sm:flex-row">
                                                    <div>
                                                        <StatusIcon swap={swap.status} />
                                                        <span className="whitespace-nowrap text-primary-text align-bottom">&nbsp;Published at</span>
                                                        <span className="whitespace-nowrap text-white align-bottom">&nbsp;
                                                            <TooltipProvider delayDuration={0}>
                                                                <Tooltip>
                                                                    <TooltipTrigger className="cursor-default">{new Date(input_transaction?.created_date)?.toLocaleString('en-US', options)}.</TooltipTrigger>
                                                                    <TooltipContent>
                                                                        {new Date(swap.created_date).toUTCString()}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </span>
                                                    </div>
                                                    <p className="sm:self-end">
                                                        <span className="text-primary-text">&nbsp;({getTimeDifferenceFromNow(input_transaction?.timestamp, new Date().toString())} ago)</span>
                                                    </p>
                                                </div>
                                                :
                                                <div className="flex sm:flex-row"><StatusIcon swap={swap.status} />
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-start rounded-md text-primary-text gap-4">
                        <div className="rounded-md w-full p-6 grid gap-y-3 items-baseline lg:max-w-[50%] bg-secondary-900 rounded-t-lg border-secondary-500 border-t-4 shadow-lg">
                            <div className="flex items-center text-white">
                                <div className="mr-2 text-primary-text text-2xl font-medium">From</div>
                            </div>
                            <div className="rounded-md w-full grid text-primary-text bg-secondary-700 shadow-lg relative border-secondary-600 border divide-y divide-secondary-500">
                                <div className="flex justify-around">
                                    <div className="flex-1 p-4">
                                        <div className="text-base font-normal text-socket-secondary">Asset</div>
                                        <div className="flex items-center">
                                            <span className="text-sm lg:text-base font-medium text-socket-table text-white flex items-center">
                                                <Image alt="Source token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.source_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                                {input_transaction?.amount} {swap?.source_network_asset}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 border-secondary-600 border-l">
                                        <div className="text-base font-normal text-socket-secondary">Source</div>
                                        <div className="flex items-center">
                                            <Image alt="Source chain icon" src={settings?.resolveImgSrc(swapSourceLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                            <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapSourceLayer?.display_name}</span>
                                        </div>
                                        {
                                            swap?.source_exchange && swapSourceExchange &&
                                            <div>
                                                <div className="text-base font-normal text-socket-secondary">Via</div>
                                                <div className="flex items-center">
                                                    <Image alt="Source chain icon" src={settings?.resolveImgSrc(swapSourceExchange) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapSourceExchange?.display_name}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col p-4">
                                    <div className="text-base font-normal text-socket-secondary">From Address</div>
                                    <div className="text-sm lg:text-base font-medium text-tx-base w-full">
                                        <div className="flex justify-between items-center text-white hover:text-primary-text">
                                            <Link href={`${sourceNetwork?.account_explorer_template?.replace('{0}', input_transaction?.from)}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                <span className="break-all link link-underline link-underline-black">{input_transaction?.from}</span>
                                            </Link>
                                            <CopyButton toCopy={input_transaction?.from} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col p-4">
                                    <div className="text-base font-normal text-socket-secondary">Transaction</div>
                                    <div className="text-sm lg:text-base font-medium text-tx-base w-full">
                                        <div className="flex items-center justify-between text-white hover:text-primary-text">
                                            <Link href={`${input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center second-link">
                                                <span className="break-all link link-underline link-underline-black">{shortenAddress(input_transaction?.transaction_id)}</span>
                                            </Link>
                                            <CopyButton toCopy={input_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                                {input_transaction?.confirmations >= input_transaction?.max_confirmations ?
                                    null
                                    :
                                    <div className="flex-1">
                                        <div className="text-base font-normal text-socket-secondary">
                                            Confirmations
                                            <span className="text-sm lg:text-base font-medium text-socket-table text-white ml-1">
                                                {input_transaction?.confirmations >= input_transaction?.max_confirmations ? input_transaction?.max_confirmations : input_transaction?.confirmations}/{input_transaction?.max_confirmations}
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="rotate-90 lg:rotate-0 self-center"><ArrowRight className="text-white w-6 h-auto" /></div>
                        <div className="rounded-md w-full p-6 grid gap-y-3 text-primary-text bg-secondary-900 border-secondary-500 border-t-4 shadow-lg relative">
                            {swap.status == SwapStatus.LsTransferPending || swap.status == SwapStatus.UserTransferPending ? <span className="pendingAnim"></span> : null}
                            <div className="flex items-center text-white">
                                <div className="mr-2 text-primary-text text-2xl font-medium">To</div>
                            </div>
                            <div className="rounded-md w-full grid text-primary-text bg-secondary-700 shadow-lg relative border-secondary-600 border divide-y divide-secondary-500">
                                <div className="flex justify-around">
                                    <div className="flex-1 p-4">
                                        <div className="text-base font-normal text-socket-secondary">Asset</div>
                                        <div className="flex items-center">
                                            {output_transaction?.amount ?
                                                <div className="flex items-center">
                                                    <Image alt="Destination token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === swap?.destination_network_asset)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white ml-0.5">{output_transaction?.amount} {swap?.destination_network_asset}</span>
                                                </div>
                                                :
                                                <span>-</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 border-secondary-600 border-l">
                                        <div className="text-base font-normal text-socket-secondary">Destination</div>
                                        <div className="flex items-center">
                                            <Image alt="Destination chain icon" src={settings?.resolveImgSrc(swapDestinationLayer) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                            <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapDestinationLayer?.display_name}</span>
                                        </div>
                                        {
                                            swap?.destination_exchange && swapDestExchange &&
                                            <div>
                                                <div className="text-base font-normal text-socket-secondary">Via</div>
                                                <div className="flex items-center">
                                                    <Image alt="Source chain icon" src={settings?.resolveImgSrc(swapDestExchange) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md mr-0.5" />
                                                    <span className="text-sm lg:text-base font-medium text-socket-table text-white">{swapDestExchange?.display_name}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col p-4">
                                    <div className="text-base font-normal text-socket-secondary">To Address</div>
                                    <div className="text-sm lg:text-base font-medium text-tx-base w-full">
                                        {output_transaction?.to ?
                                            <div className="flex items-center justify-between text-white hover:text-primary-text">
                                                <Link href={`${destinationNetwork?.account_explorer_template?.replace("{0}", output_transaction?.to)}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                    <span className="break-all link link-underline link-underline-black">{output_transaction?.to}</span>
                                                </Link>
                                                <CopyButton toCopy={swap?.destination_address} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                            </div>
                                            :
                                            <span className="ml-1">-</span>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col p-4">
                                    <div className="text-base font-normal text-socket-secondary">Transaction</div>
                                    <div className="text-sm lg:text-base font-medium text-tx-base w-full">
                                        {output_transaction?.transaction_id ?
                                            <div className="flex items-center justify-between text-white hover:text-primary-text">
                                                <Link href={`${output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                    <span className="break-all link link-underline link-underline-black">{shortenAddress(output_transaction?.transaction_id)}</span>
                                                </Link>
                                                <CopyButton toCopy={output_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                            </div>
                                            :
                                            <span>-</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            {swap?.has_refuel &&
                                <>
                                    <div className="flex items-center text-white">
                                        <div className="mr-2 text-primary-text text-2xl font-medium">... and for gas</div>
                                    </div>
                                    <div className="rounded-md w-full grid gap-y-3 text-primary-text bg-secondary-700 shadow-lg relative border-secondary-600 border">
                                        <div className="flex justify-around">
                                            <div className="flex-1 p-4">
                                                <div className="text-base font-normal text-socket-secondary">Native Asset</div>
                                                <div className="flex items-center">
                                                    <div className="flex items-center">
                                                        <Image alt="Destination token icon" src={settings?.resolveImgSrc(settings?.currencies?.find(c => c?.asset === destinationNetwork?.native_currency)) || ''} width={20} height={20} decoding="async" data-nimg="responsive" className="rounded-md" />
                                                        <span className="text-sm lg:text-base font-medium text-socket-table text-white ml-0.5">{truncateDecimals(refuel_transaction?.amount, settings?.currencies?.find(c => c?.asset === destinationNetwork?.native_currency)?.precision)} {destinationNetwork?.native_currency}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-4 border-secondary-600 border-l">
                                                <div className="text-base font-normal text-socket-secondary">Transaction</div>
                                                {refuel_transaction?.transaction_id ?
                                                    <div className="flex items-center justify-between text-white hover:text-primary-text">
                                                        <Link href={`${refuel_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 w-fit contents items-center">
                                                            <span className="break-all link link-underline link-underline-black">{shortenHash(refuel_transaction?.transaction_id)}</span>
                                                        </Link>
                                                        <CopyButton toCopy={refuel_transaction?.transaction_id} iconHeight={16} iconClassName="order-2" iconWidth={16} className="ml-2" />
                                                    </div>
                                                    :
                                                    <span>-</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </>

                            }
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

function truncateDecimals(value: number | undefined, decimals: number | undefined) {
    return Number(value?.toFixed(decimals));
}