import { create } from "zustand";

export type Monitor = {
  data: {
    loadBalancer: {
      sslExpiryDate: string;
      status: string;
    };
    wssEndpoint: string;
    httpEndpoint: string;
    nodes: [
      {
        name: string;
        sslExpiryDate: string;
      },
    ];
    secureAccess: boolean;
    malwareProtection: boolean;
    ddosProtection: boolean;
    intrusionDetection: boolean;
    firewall: string;
    ddosLogsAnalysed: string;
    softwareUpdates: string;
    unauthorisedAccessAnalysed: string;
    securityPackageUpdate: string;
    malwareScan: string;
    backup: string;
    endpointPenTest: string;
  };
};

// types
type State = {
  monitorRpc: Monitor | null;
};

type Actions = {
  setMonitor: (dashboard: Monitor) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  monitorRpc: null,
};

// config store
const useMonitorRpcStore = create<State & Actions>((set) => ({
  ...initialState,
  setMonitor: (monitorRpc: Monitor) => {
    set({ monitorRpc });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useMonitorRpcStore };
