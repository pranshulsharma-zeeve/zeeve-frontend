import React from "react";
import { Card, CopyButton, Heading } from "@zeeve-platform/ui";
import KeyValuePair from "@/components/key-value-pair";
import { RpcNearApiDetailsResponse } from "@/services/platform/rpc/near";
import { formatNearAmount } from "@/utils/helpers";
import { useNetworkStore } from "@/store/network";

interface GeneralInfoProps {
  rpcData?: RpcNearApiDetailsResponse;
}

const GeneralInfo = ({ rpcData }: GeneralInfoProps) => {
  const { data, isLoading } = useNetworkStore((state) => state.networkInfo);
  const metaData = data?.nodes[0]?.metaData;
  return (
    <Card className="col-span-12 flex flex-col gap-0 p-0 lg:gap-0 lg:p-0 xl:col-span-12 2xl:col-span-6">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">General Info</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          isLoading={isLoading}
          label={"Account ID"}
          className="lg:col-span-4"
          value={
            metaData?.accountId ? (
              <div className="flex items-center gap-2">
                {metaData?.accountId}
                <CopyButton text={metaData?.accountId} />
              </div>
            ) : (
              "NA"
            )
          }
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Network Type"}
          className="lg:col-span-4"
          value={metaData?.general?.networkType.toUpperCase() ?? ("NA" as string)}
        />
        {/* <KeyValuePair
          isLoading={isLoading}
          label={"Public Key"}
          className="lg:col-span-4"
          value={rpcData?.publicKey ?? "NA"}
        /> */}
        <KeyValuePair
          isLoading={isLoading}
          label={"Balance"}
          className="lg:col-span-4"
          value={formatNearAmount(rpcData?.accountBalance as string) ?? "NA"}
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Stake Balance"}
          className="lg:col-span-4"
          value={formatNearAmount(rpcData?.locked as string) ?? "NA"}
        />
      </div>
    </Card>
  );
};

export default GeneralInfo;
