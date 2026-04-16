"use client";
import React from "react";
import { Heading, Tooltip } from "@zeeve-platform/ui";
import Image from "next/image";
import { useParams } from "next/navigation";
import KeyValuePair from "@/components/key-value-pair";
import { withBasePath } from "@/utils/helpers";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";

const CloudInfra = () => {
  const params = useParams();
  const networkId = params.id as string;
  const rpcNodeId = params.rpcNodeId as string;
  const {
    request: { data, isLoading },
  } = usePolygonValidiumService().node.info(networkId, rpcNodeId);
  const infra = data?.data?.infra;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Cloud Infra</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Cloud"
          value={
            infra?.cloud ? (
              <Tooltip text={infra.managed ? "Zeeve Managed" : infra.cloud.toUpperCase()} placement={"top-start"}>
                <div className="flex gap-2">
                  <Image
                    src={withBasePath(
                      `/assets/images/protocol/clouds/${infra.managed ? "zeeve-managed" : infra.cloud.toLowerCase()}.svg`,
                    )}
                    alt={infra.cloud}
                    width={24}
                    height={24}
                  />
                  <div className="flex flex-row items-center gap-2 text-sm">
                    {infra.managed ? "Zeeve Managed" : infra.cloud.toUpperCase()}
                  </div>
                </div>
              </Tooltip>
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
        />
        <KeyValuePair
          label="Region"
          value={infra?.region ? `${infra.region.region}, ${infra.region.regionName}` : "NA"}
          isLoading={isLoading}
        />
        <KeyValuePair label="Machine Config" value={infra?.cloud ? "2 vCPUs, 4GB RAM" : "NA"} isLoading={isLoading} />
        <KeyValuePair label="Storage" value={infra?.cloud ? "10 GB" : "NA"} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CloudInfra;
