/** Application PAGES. Check `src/app`. Dynamic page routes must not be declared here.
 * @ THIS DOES NOT DEFINE ROUTES FOR THE APPLICATION. USED FOR REDIRECTION ONLY.
 */
const PAGE = {
  BLOCKS: "/blocks",
  DASHBOARD: "/dashboard",
} as const;

/** Must contain RESOURCE url only.
 * For example, a simple RESTful API might have the following endpoints:
 * ```text
 * /users - to retrieve a list of all users (GET)
 * /users/:id - to retrieve a specific user by ID (GET)
 * /users - to create a new user (POST)
 * /users/:id - to update an existing user by ID (PUT)
 * /users/:id - to delete an existing user by ID (DELETE)
 * ```
 * In this example, the endpoints define the actions that a client can perform on the server's user RESOURCE.
 */
const API = {
  BLOCK_STATUS: "block-status",
  LOGIN: "/api/auth/login",
  DASHBOARD: "/api/item/get-latest-data",
  /** Generic protocol data endpoint - accepts 'protocol' query parameter (e.g., coreum, avalanche) */
  PROTOCOL_DATA: "/api/item/get-latest-protocol-data",
  ZKSYNC_DASHBOARD: "/api/item/get-latest-data-zksync",
  ARBITRUM_DASHBOARD: "/api/item/get-latest-data-arbitrum",
  OPSTACK_DASHBOARD: "/api/item/get-latest-data-opstack",
  DASHBOARD_RPC: "/api/item/get-latest-evm-data",
  AVALANCHE_DASHBOARD_RPC: "/api/item/get-latest-avax-data",
  PARACHAIN_DASHBOARD_RPC: "/api/item/get-latest-parachain-data",
  SECURITY_MONITOR_RPC: "/api/item/get-security-monitor-data",
  FINANCIAL: "/api/history/get-financial-trend",
  FINANCIAL_RPC: "/api/history/get-evm-financial-trend",
  UPTIME_RPC: "/api/history/get-rpc-uptime-trend",
  /** Generic port uptime history endpoint - accepts 'protocol' query parameter (e.g., coreum, avalanche) */
  PORT_UPTIME_HISTORY_GENERIC: "/api/history/get-port-uptime-history-generic",
  UPTIME_RPC_HISTORY: "/api/history/get-rpc-uptime-history",
  HTTP_CU: "/api/history/get-eth-method-trend",
  SERVICE: "/api/item/get-service-data",
  ALERTS: "/api/item/get-trigger-data",
  SERVICE_RPC_SSL: "/api/item/get-rpc-ssl-data",
};

/** Routes for this app and its backend apis. */
const VISION_ROUTES = {
  PAGE,
  API,
};

export default VISION_ROUTES;
