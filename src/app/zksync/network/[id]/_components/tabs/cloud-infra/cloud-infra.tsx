"use client";
import React from "react";
import { Heading, Tooltip } from "@zeeve-platform/ui";
import Image from "next/image";
import { useParams } from "next/navigation";
import KeyValuePair from "@/components/key-value-pair";
import { withBasePath } from "@/utils/helpers";
import useZkSyncValidiumService from "@/services/zksync-validium/use-zksync-validium-service";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const CloudInfra = () => {
  const params = useParams();
  const networkId = params.id as string;
  const {
    request: { data, isLoading },
  } = useZkSyncValidiumService().supernet.infraDetails(networkId);
  const infraData = data?.data;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline">
      {/* <DemoSupernetInfo /> */}
      <div className="p-4">
        <Heading as="h4">Cloud Infra</Heading>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Cloud"
          value={
            infraData?.cloud ? (
              <Tooltip
                text={infraData.managed ? "Zeeve Managed" : infraData.cloud.toUpperCase()}
                placement={"top-start"}
              >
                <div className="flex gap-2">
                  <Image
                    src={withBasePath(
                      `/assets/images/protocol/clouds/${infraData.managed ? "zeeve-managed" : infraData.cloud.toLowerCase()}.svg`,
                    )}
                    alt={infraData.cloud}
                    width={24}
                    height={24}
                  />
                  <div className="flex flex-row items-center gap-2 text-sm">
                    {infraData.managed ? "Zeeve Managed" : infraData.cloud.toUpperCase()}
                  </div>
                </div>
              </Tooltip>
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        />
        <KeyValuePair
          label="Region"
          value={infraData?.region ? `${infraData.region.region}, ${infraData.region.regionName}` : "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        />
        <KeyValuePair
          label="Machine Config"
          value={infraData?.cloud ? "2 vCPUs, 4GB RAM" : "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        />
        <KeyValuePair
          label="Storage"
          value={infraData?.cloud ? "10 GB" : "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        />
      </div>
    </div>
  );
};

export default CloudInfra;
