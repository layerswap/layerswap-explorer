import { ApiResponse, EmptyApiResponse } from "@/models/ApiResponse";
import AppSettings from "./AppSettings";
import { AxiosInstance, Method } from "axios";
import { InitializeUnauthInstance } from "./axiosInterceptor"
import { AuthRefreshFailedError } from "./Errors/AuthRefreshFailedError";
import { SwapData } from "@/models/Swap";

export default class LayerSwapApiClient {
    static apiBaseEndpoint: string | undefined = AppSettings.LayerswapApiUri;
    _unauthInterceptor: AxiosInstance

    constructor() {
        this._unauthInterceptor = InitializeUnauthInstance(LayerSwapApiClient.apiBaseEndpoint)
    }
    fetcher = (url: string) => this.UnauthenticatedRequest<ApiResponse<any>>("GET", url)

    async GetExplorerDataAsync(): Promise<ApiResponse<SwapData[]>> {
        return await this.UnauthenticatedRequest<ApiResponse<SwapData[]>>("GET", `/v2-alpha/explorer/`);
    }

    private async UnauthenticatedRequest<T extends EmptyApiResponse>(method: Method, endpoint: string, data?: any, header?: {}): Promise<T> {
        let uri = LayerSwapApiClient.apiBaseEndpoint + "/api/v2-alpha" + endpoint;
        return await this._unauthInterceptor(uri, { method: method, data: data, headers: { 'Access-Control-Allow-Origin': '*', ...(header ? header : {}) } })
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