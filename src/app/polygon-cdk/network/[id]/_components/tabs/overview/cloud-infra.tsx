"use client";
import React from "react";
import { Heading, IconButton, Tooltip, useTabsContext } from "@zeeve-platform/ui";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import KeyValuePair from "@/components/key-value-pair";
import { withBasePath } from "@/utils/helpers";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";

const CloudInfra = () => {
  const params = useParams();
  const networkId = params.id as string;
  const { setActiveIndex } = useTabsContext();
  const {
    request: { data, isLoading },
  } = usePolygonValidiumService().supernet.infraDetails(networkId);
  const infraData = data?.data;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-4 lg:col-span-4 xl:col-span-2">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Cloud Infra</Heading>
          <Tooltip text={"Cloud Infra"} placement="top-start">
            <IconButton colorScheme="primary" variant={"ghost"} onClick={() => setActiveIndex(6)}>
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
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
          className="col-span-12 lg:col-span-7"
        />
        <KeyValuePair
          label="Region"
          value={infraData?.region ? `${infraData.region.region}, ${infraData.region.regionName}` : "NA"}
          isLoading={isLoading}
          className="col-span-12 lg:col-span-7"
        />
      </div>
    </div>
  );
};

export default CloudInfra;
