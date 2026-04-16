import useFinancialRpcAPI from "../vizion/financial";
import useAlertsAPI from "../vizion/alerts";
import useStakingValidatorTrends from "../vizion/stacked-graph";
import useValidatorTransactionAPI from "../vizion/validator-transactions";
import useValidatorDelegationAPI from "../vizion/validator-delegations";
import useValidatorDetailAPI from "../vizion/validator-details";
import useValidatorStakingDetails from "../vizion/staking-validator";
import useVisionUserLoginAPI from "../vizion/login-with-email";
import useSecurityMonitorValidatorAPI from "../vizion/security-monitoring";
import useValidatorNodeDetailAPI from "../vizion/validator-node-details";
import useEnableRestakeAPI from "../vizion/enable-restake";
import useEnableDisableRestakeAPI from "../vizion/enable-disable-stake";
import useSaveTxnAPI from "../vizion/save-txn";
import useStakeValidatorAPI from "../vizion/stake-validator";
import useRestakeInfoAPI from "../vizion/restake-info";
import useNewValidatorNodeDetailAPI from "../vizion/new-validator-node-details";
import useValidatorPublicDetailsAPI from "../vizion/validator-public-details";
import useValidatorPerformanceAPI from "../vizion/validator-performance";
import useValidatorRewardsAPI from "../vizion/validator-rewards";
import useValidatorStakeDelegatorsAPI from "../vizion/validator-stake-delegators";
import useDisableRestakeAPI from "../vizion/disable-restake";
import useProtocolDataAPI from "../vizion/protocol-latest-data";
import usePortUptimeTrendAPI from "../vizion/port-uptime-trend";
import useHistoricalAlertsAPI from "../vizion/historical-alerts";
import useValidatorDashboardDelegationsAPI from "../vizion/validator-dashboard-delegations";
import useThetaTransactionsAPI from "../theta-transactions";
import useAlertListAPI from "./alert/list";
import useUserInfoAPI from "./dashboard/user-info";
import useNetworkDetailAPI from "./network/detail";
import useNetworkListAPI from "./network/list";
import useNodeDeploymentAPI from "./protocol/deploy";
import useProtocolDetailsAPI from "./protocol/details";
import useProtocolListAPI from "./protocol/list";
import useProtocolSelectionAPI from "./protocol/protocol-selection";
import useSubscribeProtocolAPI from "./protocol/subscribe";
import useRpcNearApi from "./rpc/near";
import useRpcNearMetricsApi from "./rpc/near-metrics";
import useSubscriptionListAPI from "./subscription/list";
import useRetryCreateCheckoutSessionAPI from "./subscription/retry-create-checkout-session";
import useRetryProratedChargeAPI from "./subscription/retry-prorated-charge";
import useVerifyCheckoutSessionAPI from "./subscription/verify-checkout-session";
import useWorkspaceListAPI from "./workspace/list";
import useFullNodeProtocolListAPI from "./node-journey/list";
import useDeleteProtocolAPI from "./protocol/delete";
import useNodeCreateAPI from "./node-journey/create";
import useVisionUserInfoAPI from "./dashboard/vision-user-info";
import useVisionUserCreateAPI from "./dashboard/vision-user-create";
import useSubscriptionSummaryAPI from "./subscription/summary";
import useVizionUserInfoAPI from "./node-journey/vizionUserInfo";
import useChangePasswordAPI from "./protocol/useChangePasswordAPI";
import useActionStatus from "./protocol/action-status";
import useNodeConfigurationsAPI from "./node-configurations/get-config";
import useUpdateNodeConfigurationsAPI from "./node-configurations/update-config";
import useAddConfigUpdationLogAPI from "./node-configurations/add-config-updation-log";
import useNodeConfigStatusAPI from "./node-configurations/get-config-status";
import useNodeLogsAPI from "./logs/node-logs";
import useNodeServicesAPI from "./logs/node-services";
import useSubmitQueryAPI from "./protocol/query-form";
import useValidatorOverviewAPI from "./validator/overview";
import useNodeDetailsAPI from "./network/node-details";
import useUploadImageAPI from "./dashboard/upload-image";
import useInfrastructureHealthReport from "./reports/infrastructure-health";
import useRpcFleetReport from "./reports/rpc-fleet";
import useRpcNodeReport from "./reports/rpc-node";
import useValidatorFleetReport from "./reports/validator-fleet";
import useValidatorNodeReport from "./reports/validator-node";

/** hook to use platform service */
const usePlatformService = () => {
  return {
    workspace: {
      list: useWorkspaceListAPI,
    },
    dashboard: {
      userInfo: useUserInfoAPI,
      visionUser: useVisionUserInfoAPI,
      createVisionUser: useVisionUserCreateAPI,
      uploadImage: useUploadImageAPI,
    },
    subscription: {
      list: useSubscriptionListAPI,
      summary: useSubscriptionSummaryAPI,
      retryCreateCheckoutSession: useRetryCreateCheckoutSessionAPI,
      retryProratedCharge: useRetryProratedChargeAPI,
      verifyCheckoutSession: useVerifyCheckoutSessionAPI,
    },
    network: {
      list: useNetworkListAPI,
      overViewDetail: useNetworkDetailAPI,
      nodeDetails: useNodeDetailsAPI,
    },
    node_journey: {
      list: useFullNodeProtocolListAPI,
      create: useNodeCreateAPI,
      vizionUserInfo: useVizionUserInfoAPI,
    },
    protocol: {
      list: useProtocolListAPI,
      protocolSelection: useProtocolSelectionAPI,
      subscribe: useSubscribeProtocolAPI,
      details: useProtocolDetailsAPI,
      deploy: useNodeDeploymentAPI,
      deleteProtocol: useDeleteProtocolAPI,
      changePassword: useChangePasswordAPI,
      actionStatus: useActionStatus,
      submitQuery: useSubmitQueryAPI,
    },
    alerts: {
      list: useAlertListAPI,
      historical: useHistoricalAlertsAPI,
    },
    rpc: {
      near: useRpcNearApi,
      metrics: useRpcNearMetricsApi,
    },
    vizion: {
      vizionLogin: useVisionUserLoginAPI,
      financialRpc: useFinancialRpcAPI,
      alerts: useAlertsAPI,
      monitoring: useSecurityMonitorValidatorAPI,
      stakingValidator: useValidatorStakingDetails,
      stackedGraph: useStakingValidatorTrends,
      validatorDetails: useValidatorDetailAPI,
      validatorDelegation: useValidatorDelegationAPI,
      validatorTransaction: useValidatorTransactionAPI,
      validatorNodeDetails: useValidatorNodeDetailAPI,
      updatedValidatorNodeDetails: useNewValidatorNodeDetailAPI,
      validatorPublicDetails: useValidatorPublicDetailsAPI,
      validatorPerformance: useValidatorPerformanceAPI,
      validatorRewards: useValidatorRewardsAPI,
      validatorStakeDelegators: useValidatorStakeDelegatorsAPI,
      enableRestake: useEnableRestakeAPI,
      disableRestake: useDisableRestakeAPI,
      saveTxn: useSaveTxnAPI,
      stakeValidator: useStakeValidatorAPI,
      restakeInfo: useRestakeInfoAPI,
      enableDisableRestake: useEnableDisableRestakeAPI,
      protocolData: useProtocolDataAPI,
      portUptimeTrend: usePortUptimeTrendAPI,
      validatorDashboardDelegations: useValidatorDashboardDelegationsAPI,
      thetaTransactions: useThetaTransactionsAPI,
    },
    validator: {
      overview: useValidatorOverviewAPI,
    },
    configurations: {
      getNodeConfigurations: useNodeConfigurationsAPI,
      updateNodeConfigurations: useUpdateNodeConfigurationsAPI,
      addConfigUpdationLog: useAddConfigUpdationLogAPI,
      getNodeConfigStatus: useNodeConfigStatusAPI,
    },
    logs: {
      getNodeLogs: useNodeLogsAPI,
      getNodeServices: useNodeServicesAPI,
    },
    reports: {
      infrastructureHealth: useInfrastructureHealthReport,
      rpcFleet: useRpcFleetReport,
      rpcNode: useRpcNodeReport,
      validatorFleet: useValidatorFleetReport,
      validatorNode: useValidatorNodeReport,
    },
  };
};

export default usePlatformService;
