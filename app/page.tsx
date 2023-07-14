import Search from "@/components/Search";
import DataTable from "./DataTable";
import LayerSwapApiClient from '../lib/layerSwapApiClient';
import { mapNetworkCurrencies } from "../helpers/settingsHelper";
import { SettingsProvider } from "@/context/settings";

export default async function Home() {

  const settingsData = await getServerSideProps();
  const settings = settingsData?.props?.settings || undefined;

  return (
    <SettingsProvider data={settings}>
      <main className="w-full py-5 px-6 xl:px-0 h-full flex flex-col flex-1">
        <Search />
        <DataTable />
      </main>
    </SettingsProvider>
  )
}


async function getServerSideProps() {
  try {
    const fetcher = (url: string) => fetch(url).then(r => r.json())
    const version = process.env.NEXT_PUBLIC_API_VERSION
    const settingsResult = await fetcher(`${LayerSwapApiClient.apiBaseEndpoint}/api/settings?version=${version}`)
    const settings = settingsResult?.data || undefined;

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