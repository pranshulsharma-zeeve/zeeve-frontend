"use client";
import { Heading, Tooltip, tx } from "@zeeve-platform/ui";
import Image from "next/image";
import React from "react";
import KeyValuePair from "@/components/key-value-pair";
import { withBasePath } from "@/utils/helpers";
import { useNetworkStore } from "@/store/network";

interface CloudInfraProps {
  className?: string;
}

const CloudInfra = ({ className }: CloudInfraProps) => {
  const { data, isLoading } = useNetworkStore((state) => state.networkInfo);
  const cloud = data?.nodes[0].metaData?.cloud;

  return (
    <div
      className={tx(
        "col-span-12 flex flex-col rounded-lg border border-brand-outline xl:col-span-12 2xl:col-span-6",
        className,
      )}
    >
      <div className="p-4">
        <Heading as="h4">Cloud Infra</Heading>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-y-6">
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
          className="col-span-12 md:col-span-6 xl:col-span-6"
          isLoading={isLoading}
        />

        <KeyValuePair
          label={"CPU"}
          value={cloud?.machineSpec.cpu ?? "NA"}
          className="col-span-12 xl:col-span-6"
          isLoading={isLoading}
        />
        <KeyValuePair
          label={"RAM"}
          value={cloud?.machineSpec.ram ?? "NA"}
          className="col-span-12 xl:col-span-6"
          isLoading={isLoading}
        />
        <KeyValuePair
          label={"Storage"}
          value={cloud?.machineSpec.storage ?? "NA"}
          className="col-span-12 xl:col-span-6"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CloudInfra;
