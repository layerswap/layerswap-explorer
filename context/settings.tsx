import { LayerSwapAppSettings } from '@/models/LayerSwapAppSettings';
import React, { FC, ReactNode } from 'react'

const SettingsStateContext = React.createContext<LayerSwapAppSettings | null>(null);

export const SettingsProvider: FC<{data:LayerSwapAppSettings, children: ReactNode}> = ({children, data}) => {
  return (
    <SettingsStateContext.Provider value={data}>
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
