'use client';
import Search from "@/components/Search";
import DataTable from "./DataTable";
import LayerSwapApiClient from '../lib/layerSwapApiClient';
import { mapNetworkCurrencies } from "./helpers/settingsHelper";
import { SettingsProvider } from "@/context/settings";
import LayerSwapAuthApiClient from "@/lib/userAuthApiClient";
import { LayerSwapAppSettings } from "@/models/LayerSwapAppSettings";


export default async function Home() {

  const settingsData = await getServerSideProps();
  const settings = settingsData?.props?.settings || undefined;
  
  LayerSwapAuthApiClient.identityBaseEndpoint = settings?.discovery?.identity_url || '';
  let appSettings = new LayerSwapAppSettings(settings);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between max-w-6xl mx-auto py-24">
      <SettingsProvider data={appSettings}>
        <Search />
        <DataTable />
      </SettingsProvider>
    </main>
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