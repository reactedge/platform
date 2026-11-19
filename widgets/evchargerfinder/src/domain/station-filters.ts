import type { ChargingStation, Connector } from "./ev-charger.types.ts";

function connectorName(connector: Connector): string {
  return connector.type.toLowerCase();
}

function matchesConnector(station: ChargingStation, filter: string): boolean {
  if (filter === "all") return true;
  for (const connector of station.connectors) {
    if (connectorName(connector).includes(filter)) return true;
  }
  return false;
}

function matchesSpeed(station: ChargingStation, filter: string): boolean {
  if (filter === "all") return true;
  let maxPower = 0;
  for (const connector of station.connectors) {
    maxPower = Math.max(maxPower, connector.powerKw ?? 0);
  }
  if (filter === "rapid") return maxPower >= 50;
  return maxPower < 50;
}

function shouldShow(station: ChargingStation, connector: string, speed: string, availableOnly: boolean): boolean {
  return matchesConnector(station, connector) && matchesSpeed(station, speed) && (!availableOnly || station.available);
}

export function filterStations(stations: readonly ChargingStation[], connector: string, speed: string, availableOnly: boolean): ChargingStation[] {
  const matches: ChargingStation[] = [];
  for (const station of stations) {
    if (shouldShow(station, connector, speed, availableOnly)) matches.push(station);
  }
  return matches;
}
