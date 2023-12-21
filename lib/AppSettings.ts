export default class AppSettings {
    static LayerswapApiUri: string | undefined = process.env.NEXT_PUBLIC_LS_BRIDGE_API;
    static ApiVersion: string = process.env.NEXT_PUBLIC_API_VERSION || 'mainnet';
}