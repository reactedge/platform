import { useContext } from "react";
import { LocalSystemStateContext } from "./SystemState.tsx";

export function useSystemState() {
  const state = useContext(LocalSystemStateContext);
  if (!state) throw new Error("useSystemState must be used within SystemStateProvider");
  return state;
}
