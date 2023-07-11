'use client'
import { LayerSwapAppSettings } from '@/models/LayerSwapAppSettings';
import { LayerSwapSettings } from '@/models/LayerSwapSettings';
import React, { FC, ReactNode } from 'react'

const SettingsStateContext = React.createContext<LayerSwapAppSettings | null>(null);

export const SettingsProvider: FC<{ data: LayerSwapSettings | undefined, children: ReactNode }> = ({ children, data }) => {
  let appSettings = new LayerSwapAppSettings(data);

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
