import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import GeneralInfo from "../../details/general-info";
import NodeMetricsCard from "./_components/node-metrics/node-metrics-card";
import StakingDetails from "./_components/staking-details/staking-details";
import DelegationTransaction from "./_components/delegation-transaction/delegation-transaction";
import RestakeWalletInfo from "./_components/restake-wallet/restake-wallet-info";
import ROUTES from "@/routes";
import { NetworkDetailsResponse } from "@/services/platform/protocol/details";
import usePlatformService from "@/services/platform/use-platform-service";
import HTTP_STATUS from "@/constants/http";
import { StakingValidatorRequestResponse } from "@/services/vizion/staking-validator";
import { useVisionUserStore } from "@/store/vizionUser";
import { getCookie } from "@/utils/cookies";
import { useDelegationBalanceStore } from "@/store/delegationBalance";
import { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";
import { RestakeInfoResponse } from "@/services/vizion/restake-info";
const Cosmos = ({
  validatorData,
  validatorNodeDetails,
  restakeDataRequest,
}: {
  validatorData: ValidatorDetailResponse | undefined;
  validatorNodeDetails: ValidatorNodeResponse | undefined;
  restakeDataRequest: RestakeInfoResponse | undefined;
}) => {
  const params = useParams();
  const router = useRouter();
  const networkId = params.id as string;
  const [stakingDetails, setStakingDetails] = useState<StakingValidatorRequestResponse>();
  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const setDelegationBalance = useDelegationBalanceStore((state) => state.setDelegationBalance);
  const queryToken = useSearchParams().get("token");
  const token = queryToken ?? getCookie("token");
  const {
    request: { data, isLoading },
  } = usePlatformService().protocol.details(networkId);
  const nodeId = data?.nodes[0]?.id ?? "";

  const { request: stakingValidatorReuest, url: stakingValidatorUrl } = usePlatformService().vizion.stakingValidator();

  const getStakingDetails = async () => {
    try {
      if (!vizionUser) {
        console.warn("[Cosmos] Missing vizion user context, skip staking details fetch.", { networkId });
        return;
      }
      const hostList = Array.isArray(vizionUser.hostData) ? vizionUser.hostData : [];
      if (!hostList.length) {
        console.warn("[Cosmos] vizion user has no host data", { vizionUser, networkId });
      }
      const coreumHost = hostList.find((host) => host.networkId === networkId);
      if (!coreumHost) {
        console.warn("[Cosmos] Unable to locate host entry for network", { networkId, hostList });
        return;
      }
      const coreumPrimaryHost = coreumHost?.primaryHost;
      const primaryHost = coreumPrimaryHost ?? "";
      console.log("[Cosmos] fetching staking details", { networkId, primaryHost });
      const response = await axios.post(
        stakingValidatorUrl,
        { primaryHost }, // request body
        {
          headers: {
            Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === HTTP_STATUS.OK) {
        setStakingDetails(response.data); // use .data directly
        console.log("delegation balance", response.data.data?.stakingDetails?.selfDelegation);
        setDelegationBalance(response.data.data?.stakingDetails?.selfDelegation);
      }
    } catch (error) {
      console.log(error, "in error Monitor details");
    }
  };

  const isProvisioning = data?.network?.status === "provisioning";
  useEffect(() => {
    if (isProvisioning) {
      const timer = setTimeout(() => {
        router.replace(ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES);
      }, 3000); // wait for 3 seconds

      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [isProvisioning, router]);

  useEffect(() => {
    getStakingDetails();
  }, [nodeId]);

  return (
    <div className="grid grid-cols-10 gap-2 text-brand-dark lg:gap-5">
      <GeneralInfo data={data as NetworkDetailsResponse} isLoading={isLoading} />
      <NodeMetricsCard
        stakingDetails={stakingDetails}
        validatorData={validatorData}
        validatorNodeDetails={validatorNodeDetails}
      />
      <StakingDetails
        stakingDetails={stakingDetails}
        validatorData={validatorData}
        networkType={data?.nodes[0]?.metaData?.general?.networkType ?? ""}
        validatorNodeDetails={validatorNodeDetails}
      />
      {restakeDataRequest?.data?.botAddress ? (
        <RestakeWalletInfo
          validatorData={validatorData}
          networkType={data?.nodes[0]?.metaData?.general?.networkType ?? ""}
          restakeData={restakeDataRequest as RestakeInfoResponse}
          nodeId={nodeId}
        />
      ) : null}
      <DelegationTransaction
        validatorAddress={validatorData?.data?.validatorAddress ?? ""}
        nodeId={nodeId ?? ""}
        networkType={data?.nodes[0]?.metaData?.general?.networkType ?? ""}
        networkId={networkId}
      />
    </div>
  );
};

export default Cosmos;
