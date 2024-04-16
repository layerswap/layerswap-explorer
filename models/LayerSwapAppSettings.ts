import { LayerSwapSettings } from "./LayerSwapSettings";
import { SwapData } from "./Swap";

export class LayerSwapAppSettings {
    constructor(settings: LayerSwapSettings | any) {
        this.data = settings.data
    }

    data: SwapData[]
}