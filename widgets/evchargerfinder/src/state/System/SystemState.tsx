import { createContext } from "react";
import type { ChargingStationService } from "../../domain/charging-station.service.ts";

export interface SystemState {
  readonly chargingStationService: ChargingStationService;
}

export const LocalSystemStateContext = createContext<SystemState | undefined>(undefined);
