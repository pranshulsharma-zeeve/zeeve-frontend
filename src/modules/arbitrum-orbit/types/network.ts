import { NodeNetworkStates } from "./node";

/** type declaration of purpose of environment of Arbitrum Orbit network */
type NetworkEnvironment = "devnet" | "testnet" | "mainnet";

/** type declaration of Arbitrum Orbit network */
type Network = {
  networkId: string;
  networkName: string;
  networkEnvironment: NetworkEnvironment;
  networkStatus: NodeNetworkStates;
  networkCreatedAt: Date;
  isDemo: boolean;
};

export type { NetworkEnvironment, Network };
