import { create } from "zustand";
import { NodeType } from "@/types/node";
import { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";
import { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import { TxnMethods } from "@/types/network";
import { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";
import { ValidatorPublicDetailsResponse } from "@/services/vizion/validator-public-details";

// types
export type ModalType =
  | "purchase"
  | "deleteProtocol"
  | "nodeDetails"
  | "updateSoftware"
  | "changePassword"
  | "unboundToken"
  | "unjail"
  | "editValidator"
  | "withdrawRewards"
  | "setRewards"
  | "enableRestake"
  | "stakevalidator"
  | "restakeModal"
  | "disableRestake"
  | "contactUs"
  | "deleteNetwork"
  | "uniswap";

type ModalData = {
  purchase?: {
    url: string;
  };
  deleteNetwork?: {
    networkId: string;
    networkName: string;
  };
  uniswap?: Record<string, never>;
  deleteProtocol?: {
    protocolName: string;
    protocolId: string;
    nodeType: string;
  };
  nodeDetails?: {
    nodeId: string;
    networkId: string;
    nodeType: NodeType;
  };
  updateSoftware?: {
    value: string;
    toggle: () => void;
  };
  cosmosSettingsModals?: {
    networkId: string;
    nodeId: string;
    networkType: string;
    botAddress: string;
    botBalance: {
      denom: string;
      amount: string;
    };
    validatorAddress: string;
    delegationAddress: string;
    validatorPublicDetails: ValidatorPublicDetailsResponse;
  };
  changePassword?: {
    networkId: string;
    protocolId: string;
  };
  editValidator?: {
    value: string;
    key: string;
    validatorNodeDetails: UpdatedValidatorNodeResponse;
    validatorPublicDetails: ValidatorPublicDetailsResponse;
    methodName: TxnMethods;
  };
  stakevalidator?: {
    networkId: string;
    validatorNodeDetails: UpdatedValidatorNodeResponse;
    validatorPublicDetails: ValidatorPublicDetailsResponse;
  };
  restakeModal?: {
    networkId: string;
    nodeId: string;
    restakeStatus?: boolean;
  };
  contactUs?: {
    protocolName: string;
  };
};

type State = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
};

// actions
type Actions = {
  openModal: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  setModalData: (type: ModalType, data: ModalData) => void;
};

// initial state
const initialState: State = {
  type: null,
  data: {},
  isOpen: false,
};

/** hook to use modal store */
const useModalStore = create<State & Actions>((set) => ({
  ...initialState,
  openModal: (type, data = {}) => {
    set({ isOpen: true, type, data });
  },
  onClose: () => {
    set({ isOpen: false, type: null, data: {} });
  },
  setModalData: (type, data) => {
    set({ type, data });
  },
}));

export { useModalStore };
