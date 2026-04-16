import { create } from "zustand";

// types
type State = {
  delegationBalance: string | number;
};

type Actions = {
  setDelegationBalance: (delegationBalance: string | number) => void;
};

// initial state
const initialState: State = {
  delegationBalance: 1e6,
};

// Delegation Balance store
const useDelegationBalanceStore = create<State & Actions>((set) => ({
  ...initialState,
  setDelegationBalance: (delegationBalance: string | number) => {
    set({ delegationBalance });
  },
}));

export { useDelegationBalanceStore };
