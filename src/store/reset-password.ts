import { create } from "zustand";

type Step = "resetPasswordForm" | "resetPasswordSuccess";

type State = {
  step: Step;
};

const initialState: State = {
  step: "resetPasswordForm",
};

type Actions = {
  setStep: (step: Step) => void;
  reset: () => void;
};

const useResetPasswordStore = create<State & Actions>((set) => ({
  ...initialState,
  setStep: (step: Step) => {
    set({ step });
  },
  reset: () => {
    set(initialState);
  },
}));

export { useResetPasswordStore };
