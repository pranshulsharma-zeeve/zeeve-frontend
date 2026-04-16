import { useEffect } from "react";
import { useParams } from "next/navigation";
import NearProtocol from "./near/near";
import SubsquidProtocol from "./subsquid/subsquid";
import BeamProtocol from "./beam/beam";
import EvmInfo from "./evm/evm";
import Cosmos from "./cosmos/cosmos";
import { useNetworkStore } from "@/store/network";
import usePlatformService from "@/services/platform/use-platform-service";
import { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";
import { RestakeInfoResponse } from "@/services/vizion/restake-info";

const RenderProtocol = ({
  protocolName,
  validatorData,
  validatorNodeDetails,
  restakeDataRequest,
}: {
  protocolName: string;
  validatorData: ValidatorDetailResponse | undefined;
  validatorNodeDetails: ValidatorNodeResponse | undefined;
  restakeDataRequest: RestakeInfoResponse | undefined;
}) => {
  const params = useParams();
  const networkId = params.id as string;
  const {
    request: { data, isLoading },
  } = usePlatformService().network.overViewDetail(networkId);
  const [networkInfo, setNetworkInfo] = useNetworkStore((state) => [state.networkInfo, state.setNetworkInfo]);
  useEffect(() => {
    setNetworkInfo({
      data: data,
      isLoading,
    });
  }, [data, isLoading, setNetworkInfo]);

  switch (protocolName) {
    case "Subsquid":
      return <SubsquidProtocol data={networkInfo.data} isLoading={isLoading} />;
    case "Near":
      return <NearProtocol data={networkInfo.data} isLoading={isLoading} />;
    case "Beam L1":
    case "Avalanche":
    case "XDC":
    case "Dcomm":
      return <BeamProtocol data={networkInfo.data} isLoading={isLoading} />;
    case "Coreum":
      return (
        <Cosmos
          validatorData={validatorData}
          validatorNodeDetails={validatorNodeDetails}
          restakeDataRequest={restakeDataRequest}
        />
      );
    case "Solana":
    case "Flow":
    case "Polygon":
      return (
        <EvmInfo
          owner={networkInfo?.data?.nodes[0].metaData?.owner}
          signer={networkInfo?.data?.nodes[0].metaData?.signer}
          validatorId={networkInfo?.data?.nodes[0].metaData?.validatorId}
        />
      );
    default:
      return <p>Protocol not supported</p>;
  }
};

export default RenderProtocol;
