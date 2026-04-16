import { withApiBasePath } from "@/constants/api";

const PAGE = {
  DASHBOARD: "/",
  MANAGE_FULL_NODES: "/manage/nodes/full",
  MANAGE_ARCHIVE_NODES: "/manage/nodes/archive",
  MANAGE_VALIDATOR_NODES: "/manage/nodes/validator",
  MANAGE_FULL_NODES_PROTOCOLS: "/manage/nodes/full/protocols",
  MANAGE_ARCHIVE_NODES_PROTOCOLS: "/manage/nodes/archive/protocols",
  PURCHASE_FULL_NODE: "/manage/nodes/full/protocols/purchase",
  MANAGE_VALIDATOR_NODES_PROTOCOLS: "/manage/nodes/validator/protocols",
  ALL_NODES_METRICS_DASHBOARD: "/manage/nodes/all",
  WORKSPACE: "/workspace",
  ARBITRUM_ORBIT: "/arbitrum-orbit",
  ARBITRUM_ORBIT_DEPLOY: "/arbitrum-orbit/deploy",
  ARBITRUM_ORBIT_NETWORK: "/arbitrum-orbit/network",
  REPORTS_INFRA_HEALTH: "/reports/infrastructure-health",
  REPORTS_RPC_FLEET: "/reports/rpc-fleet",
  REPORTS_RPC_NODE: "/reports/rpc",
  REPORTS_VALIDATOR_FLEET: "/reports/validator-fleet",
  REPORTS_VALIDATOR_NODE: "/reports/validator",
  SUPPORT_TICKETS: "/support/tickets",
};

const API = {
  NETWORKS: "/v3/networks/",
  SUBSCRIPTIONS: "/v3/subscriptions",
  PROTOCOLS: "/v3/protocols",
  NODE_JOURNEY_PROTOCOLS: "/v4/protocols",
  NODE_JOURNEY_NETWORKS: "/v4/networks",
  SUMMARY: withApiBasePath("/subscriptions-list"),
  DETAILS_PROTOCOLS: withApiBasePath("/details/protocols"),
  NODE_CONFIG: "/node-config",
  USER_INFO: withApiBasePath("/user-info"),
  NODE_SUBSCRIPTION_LIST: withApiBasePath("/list/subscription"),
  VALIDATOR: withApiBasePath("/validator"),
  REPORTS_INFRA_HEALTH: withApiBasePath("/reports/account-weekly"),
  REPORTS_RPC_FLEET: withApiBasePath("/reports/rpc-fleet"),
  REPORTS_RPC_NODE: withApiBasePath("/reports/rpc"),
  REPORTS_VALIDATOR_FLEET: withApiBasePath("/reports/validator-fleet"),
  REPORTS_VALIDATOR_NODE: withApiBasePath("/reports/validator"),
};

const PLATFORM_ROUTES = {
  PAGE,
  API,
};

export default PLATFORM_ROUTES;
