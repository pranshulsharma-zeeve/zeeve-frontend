"use client";
import { Card, CopyButton, Tooltip } from "@zeeve-platform/ui";
import InfoRow from "@orbit/components/info-row";
import { NodeNetworkStates } from "@orbit/types/node";
import { formatDate, toShortString } from "@orbit/utils/helpers";
import Z4NetworkNodeStatus from "@orbit/components/z4-network-node-status";
import { OverviewNode } from "@orbit/types/overview";
import { normalizeHttpUrl } from "@/utils/rpc-utils";

type NodeProps = {
  node: OverviewNode;
};

const NodeCard = ({ node }: NodeProps) => {
  const nodeStatus = node.status as NodeNetworkStates | undefined;
  const endpointValue = normalizeHttpUrl(node.endpoint_url);
  const endpointDisplay = endpointValue ?? node.endpoint_url;
  const nodeTypeLabel = node.node_type?.toLowerCase() === "validator" ? "VALIDATOR" : node.node_type;

  return (
    <div className="col-span-12 rounded-lg border border-brand-outline shadow-sm lg:col-span-4">
      <Card className="flex flex-col border-0">
        <div className="w-fit rounded-[4px] bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase text-brand-primary">
          {nodeTypeLabel}
        </div>
        <div className="flex items-start justify-between">
          <InfoRow label="Name" value={node.name ?? "NA"} />
          <InfoRow
            label="Status"
            value={<Z4NetworkNodeStatus status={nodeStatus} />}
            textAlign="right"
            labelClassName="mr-4"
          />
        </div>
        <div className="mt-2">
          <InfoRow
            label="Endpoint"
            value={
              endpointDisplay ? (
                <Tooltip text={endpointDisplay} placement="top-start">
                  <div className="flex items-center">
                    <span className="mr-2">{toShortString(endpointDisplay)}</span>
                    <CopyButton text={endpointDisplay} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
          />
        </div>
      </Card>
      <div className="flex items-center justify-between rounded-b-lg px-4 py-3 text-white bg-mainnet-gradient lg:px-6">
        <div>
          <p className="text-sm">Created On</p>
          <p className="text-sm">{formatDate(node.created_at)}</p>
        </div>
        {/* <DropdownMenu onClose={handleDropdownClose} isOpen={isDropdownOpen} placement="bottom-start">
          <Tooltip text="More Options" placement="top-start">
            <DropdownMenuButton
              as={Button}
              onClick={handleDropdownToggle}
              variant={"outline"}
              colorScheme={"blue"}
              className="h-6 rounded-md border-none p-0"
              isFullWidth
              aria-label="Node actions"
            >
              <SvgThreeDots />
            </DropdownMenuButton>
          </Tooltip>

          <DropdownMenuList className="p-0">
            {["View Details", "View Analytics"].map((item, index) => (
              <DropdownMenuItem
                key={item}
                isDisabled={index === 1}
                className="border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark"
                onClick={() => {
                  if (index === 0) {
                    openModal("nodeDetails", {
                      nodeDetails: {
                        nodeName,
                        nodeCreatedAt,
                        nodeId,
                        networkId,
                        nodeType,
                      },
                    });
                  }
                }}
              >
                {item}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="text-sm font-normal" onClick={() => navigator.clipboard.writeText(nodeId)}>
              Copy Node ID ({toShortString(nodeId)})
            </DropdownMenuItem>
          </DropdownMenuList>
        </DropdownMenu> */}
      </div>
    </div>
  );
};

export default NodeCard;
