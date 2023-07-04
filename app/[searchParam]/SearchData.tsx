"use client"

import { shortenAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/ApiResponse";
import CopyButton from "../../components/buttons/copyButton";
import { ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/shadcn/accordion';
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
                    <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Date</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{new Date(swap?.created_date).toLocaleString()}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Status</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{swap.status}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">To Address</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{swap.destination_address}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white">Asset</dt>
                        <dd className="mt-1 text-sm leading-6 text-primary-text sm:col-span-2 sm:mt-0">{swap.destination_network_asset}</dd>
                    </div>

                    <Accordion type="single" collapsible>
                        <AccordionItem value={'item-1'}>
                            <AccordionTrigger className="items-center flex w-full relative gap-2 rounded-lg text-left text-base font-medium accordion relative">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white">Source Tx</dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <a href={`${swap?.input_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                            {swap.input_transaction.transaction_id}
                                            <ExternalLink width={16} height={16} className="ml-1" />
                                        </a>
                                    </dd>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-primary-text font-normal">
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">Amount:</span> {swap?.input_transaction?.amount}
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">Confirmations:</span> {`${swap?.input_transaction?.confirmations}/${swap?.input_transaction?.max_confirmations}`}
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">Created date:</span> {new Date(swap?.input_transaction?.created_date).toLocaleString()}
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0 flex">
                                        <span className="text-white mr-1">From:</span>
                                        <CopyButton toCopy={swap?.input_transaction?.from} iconHeight={22} iconClassName="order-2" iconWidth={22}>
                                            {shortenAddress(swap?.input_transaction?.from)}
                                        </CopyButton>
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0 flex">
                                        <span className="text-white mr-1">To:</span>
                                        <CopyButton toCopy={swap?.input_transaction?.to} iconHeight={22} iconClassName="order-2" iconWidth={22}>
                                            {swap?.input_transaction?.to}
                                        </CopyButton>
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0 flex">
                                        <span className="text-white mr-1">Transaction id:</span>
                                        <CopyButton toCopy={swap?.input_transaction?.transaction_id} iconHeight={22} iconClassName="order-2" iconWidth={22}>
                                            {shortenAddress(swap?.input_transaction?.transaction_id)}
                                        </CopyButton>
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">USD price:</span> {swap?.input_transaction?.usd_price}
                                    </dd>
                                </div>
                                <div className="px-4 pt-2 pb-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">USD value:</span> {swap?.input_transaction?.usd_value}
                                    </dd>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>


                    <Accordion type="single" collapsible>
                        <AccordionItem value={'item-1'}>
                            <AccordionTrigger className="items-center flex w-full relative gap-2 rounded-lg text-left text-base font-medium accordion relative">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white">Destination Tx</dt>
                                    <a href={`${swap?.output_transaction?.explorer_url}`} target="_blank" className="hover:text-gray-300 inline-flex items-center w-fit">
                                        {swap.output_transaction.transaction_id}
                                        <ExternalLink width={16} height={16} className="ml-1" />
                                    </a>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-primary-text font-normal">
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">Amount:</span> {swap?.output_transaction?.amount}
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">Confirmations:</span> {`${swap?.output_transaction?.confirmations}/${swap?.output_transaction?.max_confirmations}`}
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">Created date:</span> {new Date(swap?.output_transaction?.created_date).toLocaleString()}
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0 flex">
                                        <span className="text-white mr-1">From:</span>
                                        <CopyButton toCopy={swap?.output_transaction?.from} iconHeight={22} iconClassName="order-2" iconWidth={22}>
                                            {shortenAddress(swap?.output_transaction?.from)}
                                        </CopyButton>
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0 flex">
                                        <span className="text-white mr-1">To:</span>
                                        <CopyButton toCopy={swap?.output_transaction?.to} iconHeight={22} iconClassName="order-2" iconWidth={22}>
                                            {swap?.output_transaction?.to}
                                        </CopyButton>
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0 flex">
                                        <span className="text-white mr-1">Transaction id:</span>
                                        <CopyButton toCopy={swap?.output_transaction?.transaction_id} iconHeight={22} iconClassName="order-2" iconWidth={22}>
                                            {shortenAddress(swap?.output_transaction?.transaction_id)}
                                        </CopyButton>
                                    </dd>
                                </div>
                                <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">USD price:</span> {swap?.output_transaction?.usd_price}
                                    </dd>
                                </div>
                                <div className="px-4 pt-2 pb-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-white"></dt>
                                    <dd className="mt-1 text-sm leading-6 text-primary-text sm:mt-0">
                                        <span className="text-white">USD value:</span> {swap?.output_transaction?.usd_value}
                                    </dd>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                </dl>
            </div >}
        </div >
    )
}
