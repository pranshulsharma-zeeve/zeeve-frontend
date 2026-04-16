import { create } from "zustand";
import { ServiceRpcSslStatusResponse } from "@/services/vision/polygon/main-page/services-rpc-ssl";

// types
type State = {
  sslRpc: ServiceRpcSslStatusResponse | null;
};

type Actions = {
  setSslRpcService: (sslRpc: ServiceRpcSslStatusResponse) => void;
  reset: () => void;
};

// initial state
const initialState: State = {
  sslRpc: null,
};

// config store
const useSslRpcStore = create<State & Actions>((set) => ({
  ...initialState,
  setSslRpcService: (sslRpc: ServiceRpcSslStatusResponse) => {
    set({ sslRpc });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useSslRpcStore };
