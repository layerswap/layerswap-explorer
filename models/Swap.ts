export type Swap = {
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

export type Transaction = {
    from: string,
    to: string,
    created_date: string,
    transaction_id: string,
    confirmations: number,
    timestamp: string
    max_confirmations: number,
    amount: number,
    usd_price: number,
    usd_value: number,
    type: string
}