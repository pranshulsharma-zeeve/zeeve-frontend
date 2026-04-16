"use client";
import React from "react";
import Image from "next/image";
import { Heading, Tooltip } from "@zeeve-platform/ui";
import KeyValuePair from "@/components/key-value-pair";
import { NetworkDetailsResponse } from "@/services/platform/protocol/details";
import { withBasePath } from "@/utils/helpers";

interface CloudInfraProps {
  data: NetworkDetailsResponse;
  isLoading: boolean;
}
const CloudInfra = ({ data, isLoading }: CloudInfraProps) => {
  const cloud = data?.nodes[0].metaData.cloud;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-4">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Cloud Infra</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Cloud"
          value={
            cloud?.cloudId ? (
              <Tooltip
                text={cloud.zeeveManaged ? "Zeeve Managed" : cloud.cloudName.toUpperCase()}
                placement={"top-start"}
              >
                <div className="flex gap-2">
                  <Image
                    src={withBasePath(
                      `/assets/images/clouds/${
                        cloud.zeeveManaged ? "zeeve-managed" : cloud.cloudName.toLowerCase()
                      }.svg`,
                    )}
                    alt={cloud.cloudName}
                    width={24}
                    height={24}
                  />
                  <div className="flex flex-row items-center gap-2 text-sm">
                    {cloud.zeeveManaged ? "Zeeve Managed" : cloud.cloudName.toUpperCase()}
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
          label={"Machine Config"}
          value={
            <div>
              {cloud?.machineSpec.cpu || 4} vCPUs , {cloud?.machineSpec.ram || 16} RAM
            </div>
          }
          isLoading={isLoading}
        />
        <KeyValuePair label={"Storage"} value={cloud?.machineSpec.storage ?? "NA"} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CloudInfra;
