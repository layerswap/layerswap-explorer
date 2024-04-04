'use client'

import AppSettings from '@/lib/AppSettings';
import { ApiResponse } from '@/models/ApiResponse';
import { LayerSwapAppSettings } from '@/models/LayerSwapAppSettings';
import { SwapData } from '@/models/Swap';
import React, { FC, ReactNode } from 'react'
import useSWR from 'swr';

const SettingsStateContext = React.createContext<LayerSwapAppSettings | null>(null);

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const version = process.env.NEXT_PUBLIC_API_VERSION;

  const { data: explorerData } = useSWR<ApiResponse<SwapData[]>>(`${AppSettings.LayerswapApiUri}api/v2-alpha/explorer?version=${version}`, fetcher, { dedupingInterval: 60000 })

  const settings = {
    data: explorerData?.data,
  }

  let appSettings = new LayerSwapAppSettings(settings);

  return (
    <SettingsStateContext.Provider value={appSettings}>
      {children}
    </SettingsStateContext.Provider>
  );
}

export function useSettingsState() {
  const data = React.useContext(SettingsStateContext);

  if (data === undefined) {
    throw new Error('useSettingsState must be used within a SettingsProvider');
  }

  return data;
}