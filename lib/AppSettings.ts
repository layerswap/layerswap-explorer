export default class AppSettings {
    static LayerswapApiUri: string | undefined = process.env.NEXT_PUBLIC_LS_API;
    static ApiVersion:string | undefined = process.env.NEXT_PUBLIC_API_VERSION
}