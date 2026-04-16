import { create } from "zustand";

export type NodeStatus = "active" | "standby" | "disabled";

interface NodeUptimeState {
  nodeStatuses: Record<string, NodeStatus>;
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  clearNodeStatuses: () => void;
}

export const useNodeUptimeStore = create<NodeUptimeState>((set) => ({
  nodeStatuses: {},
  setNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodeStatuses: { ...state.nodeStatuses, [nodeId]: status },
    })),
  clearNodeStatuses: () => set({ nodeStatuses: {} }),
}));
