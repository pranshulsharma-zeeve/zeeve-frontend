import usePriceListAPI from "./payment/price-list";
import useBlockNumber from "./network/block-number";
import useDeployNetwork from "./network/deploy-network";
import useDeleteNetwork from "./network/delete-network";
import useNodeListAPI from "./node/list";
import useTrialInfo from "./network/trialInfo";
import useCloudConfigAPI from "./cloud/config";
import useCreatePaymentUrlAPI from "./payment/create-payment-url";
import useNetworkListAPI from "./network/network-list";
import useNetworkOverview from "./network/overview";
import useNodeDetailAPI from "./node/node-detail";
import useBridgeAPI from "./network/bridge";
import usePaymentSuccessAPI from "./payment/payment-success";
import useBlockchainDetails from "./network/blockchain-details";

/** hook to use Arbitrum Orbit service */
const useArbitrumOrbitService = () => {
  return {
    cloud: {
      config: useCloudConfigAPI,
    },
    payment: {
      priceList: usePriceListAPI,
      create: useCreatePaymentUrlAPI,
      paymentSuccess: usePaymentSuccessAPI,
    },
    node: {
      list: useNodeListAPI,
      detail: useNodeDetailAPI,
    },
    network: {
      blockNumber: useBlockNumber,
      deployNetwork: useDeployNetwork,
      deleteNetwork: useDeleteNetwork,
      blockchainDetails: useBlockchainDetails,
      bridgeInfo: useBridgeAPI,
      networkList: useNetworkListAPI,
      trialInfo: useTrialInfo,
      overview: useNetworkOverview,
    },
  };
};

export default useArbitrumOrbitService;
