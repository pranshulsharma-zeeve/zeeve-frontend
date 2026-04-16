import { create } from "zustand";
import { DeployNetworkSchemaType } from "@/app/arbitrum-orbit/deploy/page-client";

// you can add additional type properties here for each step
type DeployNetworkConfiguration = DeployNetworkSchemaType;

type State = {
  deployNetworkConfiguration: DeployNetworkConfiguration | null;
};

// form steps
type FormStep = { step: "deployNetworkConfiguration"; data: DeployNetworkConfiguration | null };

// initial state
const initialState: State = {
  deployNetworkConfiguration: null,
};

type Actions = {
  setFormData: ({ step, data }: FormStep) => void;
};

const useDeployNetworkFormStore = create<State & Actions>((set) => ({
  ...initialState,
  setFormData: ({ step, data }) =>
    set((state) => ({
      ...state,
      [step]: data,
    })),
}));

export { useDeployNetworkFormStore };
