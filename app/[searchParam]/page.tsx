'use client';
import { SettingsProvider } from "@/context/settings";
import SearchData from "./SearchData";
import LayerSwapApiClient from "@/lib/layerSwapApiClient";
import { mapNetworkCurrencies } from "../helpers/settingsHelper";
import { LayerSwapAppSettings } from "@/models/LayerSwapAppSettings";
import LayerSwapAuthApiClient from "@/lib/userAuthApiClient";
import Search from "@/components/Search";
import Header from "@/components/Header";
import BackBtn from "../helpers/BackButton";

export default async function Page({ params }: { params: { searchParam: string } }) {

  const settingsData = await getServerSideProps();
  const settings = settingsData?.props?.settings || undefined;

  LayerSwapAuthApiClient.identityBaseEndpoint = settings?.discovery?.identity_url || '';
  let appSettings = new LayerSwapAppSettings(settings);

  return (
    <SettingsProvider data={appSettings}>
      <div className="flex min-h-screen flex-col items-center max-w-6xl mx-auto py-24">
        <Header />
        <BackBtn />
        <Search />
        <SearchData searchParam={params.searchParam} />
      </div>
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