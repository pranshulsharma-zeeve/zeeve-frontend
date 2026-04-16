"use client";
import { Heading, IconButton, Tooltip, useTabsContext } from "@zeeve-platform/ui";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { NodeType } from "@orbit/types/node";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import CardKeyValuePair from "@orbit/components/card-key-value-pair";
import { useNetworkStore } from "@orbit/store/network";
import { getNodeCounts } from "@orbit/utils/network-overview";

const nodeItem: Array<{
  label: string;
  type: NodeType;
}> = [
  { label: "Nitro Nodes", type: "nitroNode" },
  { label: "Arbitrum Sepolia Nodes", type: "arbitrumSepoliaNode" },
  { label: "Ethereum Sepolia Nodes", type: "ethereumSepoliaNode" },
];

const nodeItemLocalDA: Array<{
  label: string;
  type: NodeType;
}> = [
  { label: "Nitro Nodes", type: "nitroNode" },
  { label: "Arbitrum Sepolia Nodes", type: "arbitrumSepoliaNode" },
  { label: "Ethereum Sepolia Nodes", type: "ethereumSepoliaNode" },
  { label: "Arbitrum DA Nodes", type: "arbitrumDA" },
];

type GeneralProps = {
  data?: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};

const NodesSummary = ({ isLoading }: GeneralProps) => {
  const { setActiveIndex } = useTabsContext();
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const counts = getNodeCounts(networkInfo.data);
  const arbitrumDANodeValue = counts["arbitrumDA"];

  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline xl:col-span-6 2xl:col-span-3">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Heading as="h4">Nodes</Heading>
          <Tooltip text={"My Nodes"} placement="top-start">
            <IconButton colorScheme="primary" variant={"ghost"} onClick={() => setActiveIndex(1)} size={"small"}>
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="grid grid-cols-12 gap-3 pt-4 lg:gap-4">
          {(arbitrumDANodeValue && arbitrumDANodeValue > 0 ? nodeItemLocalDA : nodeItem).map((item, index) => {
            return (
              <CardKeyValuePair
                key={index}
                label={item.label}
                value={counts[item.type] ?? "NA"}
                className="lg:col-span-12 lg:p-3"
                valueClassName="h-0.5"
                isLoading={isLoading}
                skeletonChildClassName="my-2"
                as="h6"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NodesSummary;
