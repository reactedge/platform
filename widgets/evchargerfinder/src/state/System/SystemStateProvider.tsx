import { useMemo, type ReactNode } from "react";
import type { WidgetConfig } from "../../bootstrap/config/Config.ts";
import { ChargingStationService } from "../../domain/charging-station.service.ts";
import { LocalSystemStateContext } from "./SystemState.tsx";

interface Props { readonly children: ReactNode; readonly config: WidgetConfig }

export function SystemStateProvider({ children, config }: Props) {
  const apiBaseUrl = config.integrations.evchargerfinderApi.api;
  const chargingStationService = useMemo(() => new ChargingStationService(apiBaseUrl), [apiBaseUrl]);
  const value = useMemo(() => ({ chargingStationService }), [chargingStationService]);
  return <LocalSystemStateContext.Provider value={value}>{children}</LocalSystemStateContext.Provider>;
}
