'use client'

import LayerSwapApiClient from '@/lib/layerSwapApiClient';
import { ApiResponse } from '@/models/ApiResponse';
import { LayerSwapAppSettings } from '@/models/LayerSwapAppSettings';
import { LayerSwapSettings } from '@/models/LayerSwapSettings';
import React, { FC, ReactNode } from 'react'
import useSWR from 'swr';

const SettingsStateContext = React.createContext<LayerSwapAppSettings | null>(null);

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const version = process.env.NEXT_PUBLIC_API_VERSION;
  const { data: settings } = useSWR<ApiResponse<LayerSwapSettings>>(`${LayerSwapApiClient.apiBaseEndpoint}/api/settings?version=${version}`, fetcher, { dedupingInterval: 60000 });

  let appSettings = new LayerSwapAppSettings(settings?.data);

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
