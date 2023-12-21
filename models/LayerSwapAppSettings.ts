import { CryptoNetwork, NetworkCurrency } from "./CryptoNetwork";
import { Exchange } from "./Exchange";
import { Layer } from "./Layer";
import { LayerSwapSettings } from "./LayerSwapSettings";

export class LayerSwapAppSettings {
    constructor(settings: LayerSwapSettings | any) {
        this.layers = LayerSwapAppSettings.ResolveLayers(settings.networks);
        this.exchanges = settings.exchanges
    }

    exchanges: Exchange[]
    layers: Layer[] 

    resolveImgSrc = (item: Layer | NetworkCurrency | Pick<Layer, 'internal_name'> | { asset: string } | undefined) => {

        if (!item) {
            return "/images/logo_placeholder.png";
        }

        const resource_storage_url = process.env.NEXT_PUBLIC_RESOURCE_STORAGE_URL
        if (!resource_storage_url)
            throw new Error("NEXT_PUBLIC_RESOURCE_STORAGE_URL is not set up in env vars")

        const basePath = new URL(resource_storage_url);

        // Shitty way to check for partner
        if ((item as any)?.internal_name != undefined) {
            basePath.pathname = `/layerswap/networks/${(item as any)?.internal_name?.toLowerCase()}.png`;
        }
        else if ((item as any)?.asset != undefined) {
            basePath.pathname = `/layerswap/currencies/${(item as any)?.asset?.toLowerCase()}.png`;
        }

        return basePath.href;
    }

    static ResolveLayers(networks: any[]): Layer[] {
        const resource_storage_url = process.env.NEXT_PUBLIC_RESOURCE_STORAGE_URL
        if (!resource_storage_url)
            throw new Error("NEXT_PUBLIC_RESOURCE_STORAGE_URL is not set up in env vars")

        const basePath = new URL(resource_storage_url);

        const networkLayers: Layer[] = networks?.map((n): Layer =>
        ({
            isExchange: false,
            assets: LayerSwapAppSettings.ResolveNetworkL2Assets(n),
            img_url: `${basePath}layerswap/networks/${n?.internal_name?.toLowerCase()}.png`,
            ...n,
        }))
        return networkLayers
    }

    static ResolveNetworkL2Assets(network: CryptoNetwork): NetworkCurrency[] {
        return network?.currencies?.map(c => ({
            asset: c.asset,
            status: c.status,
            contract_address: c.contract_address,
            decimals: c.decimals,
            precision: c.precision,
            usd_price: c.usd_price,
            is_native: c.is_native,
            is_refuel_enabled: c.is_refuel_enabled,
        }))
    }
}