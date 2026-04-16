import create from "zustand";

interface ProtocolStore {
  focusedProtocol: string | null;
  setFocusedProtocol: (protocol: string | null) => void;
}

const useProtocolStore = create<ProtocolStore>()((set) => ({
  focusedProtocol: null,
  setFocusedProtocol: (protocol) => set({ focusedProtocol: protocol }),
}));

export default useProtocolStore;
