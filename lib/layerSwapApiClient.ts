import { ApiResponse, EmptyApiResponse } from "@/models/ApiResponse";
import AppSettings from "./AppSettings";
import axios, { Method } from "axios";
import { AuthRefreshFailedError } from "./Errors/AuthRefreshFailedError";
import { SwapData } from "@/models/Swap";

export default class LayerSwapApiClient {
    static apiBaseEndpoint: string | undefined = AppSettings.LayerswapApiUri;
    static apiVersion: string | undefined = AppSettings.ApiVersion
    fetcher = (url: string) => this.UnauthenticatedRequest<ApiResponse<any>>("GET", url)

    async GetExplorerDataAsync(): Promise<ApiResponse<SwapData[]>> {
        return await this.UnauthenticatedRequest<ApiResponse<SwapData[]>>("GET", `/explorer?version=${LayerSwapApiClient.apiVersion}&statuses=1&statuses=4`);
    }

    private async UnauthenticatedRequest<T extends EmptyApiResponse>(method: Method, endpoint: string, data?: any, header?: {}): Promise<T> {
        let uri = LayerSwapApiClient.apiBaseEndpoint + "/api/v2" + endpoint;
        return await axios.get(uri, { method: method, data: data, headers: { 'Access-Control-Allow-Origin': '*', ...(header ? header : {}) } })
            .then(res => {
                return res?.data;
            })
            .catch(async reason => {
                if (reason instanceof AuthRefreshFailedError) {
                    return Promise.resolve(new EmptyApiResponse());
                }
                else {
                    return Promise.reject(reason);
                }
            });
    }
}