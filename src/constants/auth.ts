import axios from "axios";
const AUTH_PRESENCE_COOKIE = "zeeve_platform_session";

const RestUrl = {
  mainnet: "https://internal-coreum-mainnet-wkfg49.zeeve.net",
  testnet: "https://rest.testcosmos.directory/coreumtestnet",
};

const REST_API_INSTANCE = {
  mainnet: axios.create({
    baseURL: RestUrl.mainnet,
    headers: {
      "content-type": "application/json",
    },
  }),
  testnet: axios.create({
    baseURL: RestUrl.testnet,
    headers: {
      "content-type": "application/json",
    },
  }),
};

export { AUTH_PRESENCE_COOKIE, REST_API_INSTANCE };
