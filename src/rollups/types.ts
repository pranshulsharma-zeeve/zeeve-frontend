export type RollupKey = "arbitrum-orbit" | "opstack" | "polygon-cdk" | "zksync";

export interface Option {
  value: string;
  label: string;
}

export interface Env {
  name: "testnet" | "mainnet";
}

export type Status = "unknown" | "ready" | "deploying" | "error";

export interface DeployResult {
  success: boolean;
  id?: string;
  message?: string;
}

export interface RollupConfig {
  key: RollupKey;
  displayName: string;
  logo?: string;
  settlementLayerOptions: Option[];
  dataAvailabilityOptions: Option[];
  coreComponents: Array<{ id: string; label: string; required?: boolean }>;
  apis: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkStatus: (env: Env, params: Record<string, any>) => Promise<Status>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deployTestnet?: (...args: any[]) => Promise<DeployResult>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deployMainnet?: (...args: any[]) => Promise<DeployResult>;
  };
}
