import { create } from "zustand";
import { RegistrationFormValidationSchemaType } from "@/app/account/register/[[...slug]]/_components/form-steps/step-1-registration-form";

type Step = "registrationForm" | "accountVerification" | "registrationSuccess";

type RegistrationForm = RegistrationFormValidationSchemaType;
type AccountVerification = {
  email: string;
};

type Registration =
  | { step: "registrationForm"; data: RegistrationForm }
  | {
      step: "accountVerification";
      data: AccountVerification;
    };

type State = {
  step: Step;
  registrationForm: RegistrationForm | null;
  accountVerification: AccountVerification | null;
};

const initialState: State = {
  step: "registrationForm",
  registrationForm: null,
  accountVerification: null,
};

type Actions = {
  setStep: (step: Step) => void;
  setFormData: ({ step, data }: Registration) => void;
  reset: () => void;
};

const useRegistrationStore = create<State & Actions>((set) => ({
  ...initialState,
  setStep: (step: Step) => {
    set({ step });
  },
  setFormData: ({ step, data }) =>
    set((state) => ({
      ...state,
      [step]: data,
    })),
  reset: () => {
    set(initialState);
  },
}));

export { useRegistrationStore };
