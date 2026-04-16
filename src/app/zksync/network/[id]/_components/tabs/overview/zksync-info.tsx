"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Heading, IconButton, Tooltip, useTabsContext, Z4DashboardCard } from "@zeeve-platform/ui";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { useZkSyncDashboard } from "../dashboard-context";
import { formatDate, toCapitalize } from "@/utils/helpers";
import Status from "@/components/status";
import InfoRow from "@/modules/arbitrum-orbit/components/info-row";
import { ZKSYNC_DEMO_SERVICE_ID } from "@/constants/zksync";

const ZkSyncInfo = () => {
  const { id } = useParams();
  const serviceId = Array.isArray(id) ? id[0] : id;
  const isDemo = Boolean(serviceId && serviceId === ZKSYNC_DEMO_SERVICE_ID);
  const { setActiveIndex } = useTabsContext();
  const { normalized, isLoading } = useZkSyncDashboard();
  const info = normalized?.summary;

  return (
    <div className="col-span-12 flex h-full flex-col rounded-lg xl:col-span-12 2xl:col-span-5">
      <Z4DashboardCard cardType={isDemo ? "demo" : "testnet"} className="flex h-full flex-col">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h5">Rollup Info</Heading>
          <Tooltip text={"Rollup Config"} placement="top-start">
            <IconButton colorScheme="primary" variant={"ghost"} onClick={() => setActiveIndex(1)}>
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <InfoRow label="Name" value={info?.serviceName ?? "NA"} isLoading={isLoading} />
          <InfoRow
            label="Chain ID"
            value={info?.chainId ?? "NA"}
            isLoading={isLoading}
            showCopyButton={info?.chainId ? true : false}
            textAlign="right"
          />
          <InfoRow
            label="Network Type"
            value={
              isDemo
                ? "SANDBOX"
                : info?.environment
                  ? info.environment === "sandbox"
                    ? "TESTNET"
                    : info.environment === "production"
                      ? "MAINNET"
                      : toCapitalize(info.environment, "all")
                  : "NA"
            }
            isLoading={isLoading}
          />
          <InfoRow
            label="Status"
            value={<Status status={info?.status} type={"icon"} />}
            isLoading={isLoading}
            textAlign="right"
          />
          <InfoRow
            label="Settlement Layer"
            value={normalized?.rollupMetadata?.l1?.name ?? "NA"}
            isLoading={isLoading}
          />
          <InfoRow label="Created On" value={formatDate(info?.createdAt)} isLoading={isLoading} textAlign="right" />
        </div>
      </Z4DashboardCard>
    </div>
  );
};

export default ZkSyncInfo;
