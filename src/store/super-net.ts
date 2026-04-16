import { create } from "zustand";
import type { NodeNetworkStates } from "@/types/node";
import type { PolygonRollupNode, PolygonRollupOverview, PolygonRollupUserInputs } from "@/types/polygon-cdk";

type SupernetInfo = {
  name?: string;
  chainId?: string;
  environment?: "production" | "sandbox";
  agentId?: string;
  analyticsId?: string;
  status?: NodeNetworkStates;
  createdAt?: Date | string;
  ownedBy?: string;
  infraProvisionedAt?: Date | string;
  blockchainProvisionedAt?: Date | string;
  serviceId?: number;
  serviceName?: string;
  userInputs?: PolygonRollupUserInputs;
  nodes?: PolygonRollupNode[];
  overview?: PolygonRollupOverview;
};

type State = {
  superNetInfo: { data?: SupernetInfo; isLoading: boolean };
};

type Actions = {
  setSuperNetInfo: (isLoading: boolean, data?: SupernetInfo) => void;
  reset: () => void;
};

const initialState: State = {
  superNetInfo: { data: undefined, isLoading: false },
};

const useSuperNetStore = create<State & Actions>((set) => ({
  ...initialState,
  setSuperNetInfo: (isLoading: boolean, data?: SupernetInfo) => {
    set({ superNetInfo: { data, isLoading } });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useSuperNetStore };
