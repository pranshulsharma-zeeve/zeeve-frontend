import useArbitrumDashboardAPI from "./arbitrum/main-page/dashboard";
import useOpStackDashboardAPI from "./opstack/main-page/dashboard";
import useLoginAPI from "./polygon/auth/login";
import useAlertsAPI from "./polygon/main-page/alerts";
import useBlockStatusAPI from "./polygon/main-page/block-status";
import useDashboardAPI from "./polygon/main-page/dashboard";
import useFinancialAPI from "./polygon/main-page/financial";
import useServiceAPI from "./polygon/main-page/services";
import useServiceRpcSslAPI from "./polygon/main-page/services-rpc-ssl";
import useSecurityMonitorRpcAPI from "./polygon/rpc/security-monitor";
import useZksyncDashboardAPI from "./zksync/main-page/dashboard";

const useVisionService = () => {
  return {
    mainPage: {
      blockStatus: useBlockStatusAPI,
      login: useLoginAPI,
      dashboard: useDashboardAPI,
      zksyncDashboard: useZksyncDashboardAPI,
      arbitrumDashboard: useArbitrumDashboardAPI,
      opStackDashboard: useOpStackDashboardAPI,
      financial: useFinancialAPI,
      service: useServiceAPI,
      alerts: useAlertsAPI,
      rpcSsl: useServiceRpcSslAPI,
    },
    rpc: {
      monitorRpc: useSecurityMonitorRpcAPI,
    },
  };
};

export default useVisionService;
