"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  Tooltip,
  useToggle,
} from "@zeeve-platform/ui";
import { useSuperNetStore } from "@/store/super-net";
import { formatDate, toShortString } from "@/utils/helpers";
import Status from "@/components/status";
import { NodeNetworkStates, NodeType } from "@/types/node";
import Card from "@/components/vizion/card";

type NodeCardProps = {
  nodeId: string;
  networkId: string;
  nodeName: string;
  nodeType: NodeType;
  nodeStatus: NodeNetworkStates | undefined;
  nodeCreatedAt?: Date;
  endpoint?: string;
  description?: string;
};

const NodeCard = ({
  nodeId,
  networkId,
  nodeName,
  nodeType,
  nodeStatus,
  nodeCreatedAt,
  endpoint,
  description,
}: NodeCardProps) => {
  const { isOpen: isDropdownOpen, handleToggle: handleDropdownToggle, handleClose: handleDropdownClose } = useToggle();
  const superNetInfo = useSuperNetStore((state) => state.superNetInfo);
  const displayDescription = description && description.length > 0 ? description : "Description not available.";
  const createdOn = nodeCreatedAt ? formatDate(nodeCreatedAt.toString()) : "NA";

  return (
    <div className="col-span-12 rounded-lg border border-brand-outline shadow-sm lg:col-span-4">
      <Card className="relative flex flex-col gap-4 border-0 px-4 py-7">
        <div className="absolute right-6 top-4 rounded-[4px] bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase text-brand-primary">
          {nodeType}
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-base font-semibold text-brand-dark">{nodeName || "NA"}</p>
            </div>
            <div className="flex min-w-[140px] flex-col items-end gap-3 text-right">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500">Status</span>
                <div className="-mr-8 flex justify-end">
                  <Status status={nodeStatus} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">Description</p>
            <Tooltip text={displayDescription} placement="top-start">
              <p className="whitespace-pre-line break-words text-base font-medium text-brand-dark">
                {displayDescription}
              </p>
            </Tooltip>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between rounded-b-lg px-4 py-3 text-white bg-mainnet-gradient lg:px-6">
        <div>
          <p className="text-sm">Created On</p>
          <p className="text-sm">{createdOn}</p>
        </div>
        {/* <DropdownMenu onClose={handleDropdownClose} isOpen={isDropdownOpen} placement="bottom-start">
          <Tooltip text="More Options" placement="top-start">
            <DropdownMenuButton
              as={Button}
              onClick={handleDropdownToggle}
              variant="outline"
              colorScheme="blue"
              className="h-8 rounded-md border-white p-2 hover:bg-white/10"
              aria-label="Node actions"
            >
              <span className="text-white">···</span>
            </DropdownMenuButton>
          </Tooltip>

          <DropdownMenuList className="p-0"> */}
        {/* <DropdownMenuItem className="border-b border-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark">
              <Link
                href={`/polygon-cdk/network/${networkId}/nodes/${nodeType}/${nodeId}?network=${superNetInfo.data?.name}`}
                className="block w-full"
              >
                View Details
              </Link>
            </DropdownMenuItem> */}
        {/* <DropdownMenuItem
              className="text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark"
              onClick={() => navigator.clipboard.writeText(nodeId)}
            >
              Copy Node ID ({toShortString(nodeId)})
            </DropdownMenuItem>
          </DropdownMenuList>
        </DropdownMenu> */}
      </div>
    </div>
  );
};

export default NodeCard;
