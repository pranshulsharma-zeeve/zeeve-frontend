/** type declaration of different provisioning states of different resources just like any node, network, worker node or machine */
type States = "requested" | "provisioning" | "ready" | "deleting" | "deleted" | "failed" | "updating";
type CREDENTIALS_TYPE = "basic" | "apiKey";
type NetworkType = "testnet" | "mainnet";

type Endpoint = {
  http: boolean;
  ws: boolean;
  url?: null | string;
  authentication:
    | {
        type: "basic";
        username: string;
      }
    | {
        type: "apiKey";
        apiKey: string;
      };
  apis: Array<string>;
};

export type { States, CREDENTIALS_TYPE, NetworkType, Endpoint };
