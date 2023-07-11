import { SettingsProvider } from "@/context/settings";
import SearchData from "./SearchData";
import LayerSwapApiClient from "@/lib/layerSwapApiClient";
import { mapNetworkCurrencies } from "../../helpers/settingsHelper";
import LayerSwapAuthApiClient from "@/lib/userAuthApiClient";

export default async function Page({ params }: { params: { searchParam: string } }) {

  const settingsData = await getServerSideProps();
  const settings = settingsData?.props?.settings || undefined;

  LayerSwapAuthApiClient.identityBaseEndpoint = settings?.discovery?.identity_url || '';

  return (
    <SettingsProvider data={settings}>
      <main className="w-full py-5 px-6 xl:px-0">
        <SearchData searchParam={params.searchParam} />
      </main>
    </SettingsProvider>
  )
}

async function getServerSideProps() {
  try {
    var apiClient = new LayerSwapApiClient();
    const { data: settings } = await apiClient.GetSettingsAsync();

    if (!settings) {
      return
    }
    settings.networks = settings?.networks //.filter(n => n.status !== "inactive");
    // settings.exchanges = mapNetworkCurrencies(settings.exchanges.filter(e => e.status === 'active'), settings.networks)
    settings.exchanges = mapNetworkCurrencies(settings.exchanges || [], settings?.networks || [])

    const resource_storage_url = settings?.discovery?.resource_storage_url;
    if (resource_storage_url?.[resource_storage_url?.length - 1] === "/" && settings?.discovery?.resource_storage_url)
      settings.discovery.resource_storage_url = resource_storage_url?.slice(0, -1);

    return {
      props: {
        settings: settings,
      },
    }
  }
  catch (e) {
    console.log("error", e)
  }
}