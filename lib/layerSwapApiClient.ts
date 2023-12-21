import { ApiResponse } from "@/models/ApiResponse";
import AppSettings from "./AppSettings";
import axios from "axios";
import { Exchange } from "@/models/Exchange";
import { CryptoNetwork } from "@/models/CryptoNetwork";

export default class LayerSwapApiClient {
    static apiBaseEndpoint: string | undefined = AppSettings.LayerswapApiUri;
    static apiVersion: string = AppSettings.ApiVersion;

    async GetExchangesAsync(): Promise<ApiResponse<Exchange[]>> {
        return await axios.get(`${LayerSwapApiClient.apiBaseEndpoint}/api/exchanges?version=${LayerSwapApiClient.apiVersion}`).then(res => res.data);
    }

    async GetLSNetworksAsync(): Promise<ApiResponse<CryptoNetwork[]>> {
        return await axios.get(`${LayerSwapApiClient.apiBaseEndpoint}/api/networks?version=${LayerSwapApiClient.apiVersion}`).then(res => res.data);
    }
}