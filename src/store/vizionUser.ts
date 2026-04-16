import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HostData {
  protocolName?: string;
  nodeName: string;
  hostIds: string[];
  indentifierType?: string;
  protocolType?: string;
  networkId?: string;
  primaryHost: string;
  hasLB?: string;
  proxyType?: string;
  "host-name"?: string;
  NodeIdentifier?: string;
  "protocol-type"?: string;
  singleMachine?: boolean;
  RPC?: string[];
  Bridge?: string[];
  Explorer?: string[];
  Prover?: string[];
  Backup?: string[];
  Core?: string[];
  Sequencer?: string[];
}

interface VisionUser {
  success: boolean;
  token: string;
  hostData: HostData[];
  username: string;
}

// --- store types
type State = {
  visionUser: VisionUser | null;
};

type Actions = {
  setVisionUser: (user: VisionUser | null) => void;
  reset: () => void;
};

// --- initial state
const initialState: State = {
  visionUser: null,
};

// --- store with persist
const useVisionUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setVisionUser: (user: VisionUser | null) => set({ visionUser: user }),
      reset: () => set(initialState),
    }),
    {
      name: "vision-user-storage", // key in localStorage
      getStorage: () => localStorage, // optional, defaults to localStorage
    },
  ),
);

export { useVisionUserStore };
export type { VisionUser, HostData };
