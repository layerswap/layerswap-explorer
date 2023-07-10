import { ApiResponse } from "@/models/ApiResponse";
import AppSettings from "./AppSettings";
import { LayerSwapSettings } from "@/models/LayerSwapSettings";
import axios from "axios";


export default class LayerSwapApiClient {
    static apiBaseEndpoint: string | undefined = AppSettings.LayerswapApiUri;

    async GetSettingsAsync(): Promise<ApiResponse<LayerSwapSettings>> {
        const fetcher = (url: string) => fetch(url).then(r => r.json())
        const version = process.env.NEXT_PUBLIC_API_VERSION
        return await fetcher(`${LayerSwapApiClient.apiBaseEndpoint}/api/settings?version=${version}`)
    }
}

export type CreateSwapParams = {
    amount: string,
    source: string,
    destination: string,
    asset: string,
    source_address: string,
    destination_address: string,
    app_name?: string,
    reference_id?: string,
    refuel?: boolean,
}
