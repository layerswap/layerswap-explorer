'use client';
import { SettingsProvider } from "@/context/settings";
import Header from "../../components/Header";
import SearchData from "./SearchData";
import LayerSwapApiClient from "@/lib/layerSwapApiClient";
import { mapNetworkCurrencies } from "../helpers/settingsHelper";
import { LayerSwapAppSettings } from "@/models/LayerSwapAppSettings";
import LayerSwapAuthApiClient from "@/lib/userAuthApiClient";

export default async function Page({ params }: { params: { searchParam: string } }) {

    const settingsData = await getServerSideProps();
    const settings = settingsData?.props?.settings || undefined;
    
    LayerSwapAuthApiClient.identityBaseEndpoint = settings?.discovery?.identity_url || '';
    let appSettings = new LayerSwapAppSettings(settings);

    
    return (
        <SettingsProvider data={appSettings}>
            <div className="flex min-h-screen flex-col items-center justify-between max-w-6xl mx-auto py-24">
                <div>
                    <a className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-gray-800 hover:text-accent-foreground h-10 py-2 px-4 absolute left-4 top-4 md:left-8 md:top-8" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Back
                    </a>
                </div>
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