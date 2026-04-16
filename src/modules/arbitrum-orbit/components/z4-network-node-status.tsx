"use client";
import React from "react";
import { Tooltip } from "@zeeve-platform/ui";
import { IconArrowDoubleRotateRightCircle } from "@zeeve-platform/icons/arrow/outline";
import { IconTrashSquare } from "@zeeve-platform/icons/essential/outline";
import { IconZ4Cross, IconZ4Tick } from "@zeeve-platform/icons/z4/outline";
import { NodeNetworkStates } from "@orbit/types/node";
interface NetworkNodeStatusProps {
  status?: NodeNetworkStates | string;
  type?: "badge" | "icon";
  statusText?: string;
  toolTipText?: string;
  disableStatusText?: boolean;
  disableToolTip?: boolean;
}

const Z4NetworkNodeStatus = ({
  status,
  type = "badge",
  statusText,
  toolTipText,
  disableStatusText = false,
  disableToolTip = false,
}: NetworkNodeStatusProps) => {
  if (type === "badge") {
    switch (status?.toLowerCase()) {
      case "requested":
        return (
          <div className="gap-2 rounded-[50px] bg-brand-primary px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? "PROVISIONING"}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Blockchain installation is being done."} placement="top-start">
                <div>{statusText ?? "PROVISIONING"}</div>
              </Tooltip>
            )}
          </div>
        );
      case "updating":
        return (
          <div className="gap-2 rounded-[50px] bg-brand-yellow px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Cloud infrastructure is updating right now."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "provisioning":
        return (
          <div className="rounded-[50px] bg-brand-primary px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Blockchain installation is being done."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "failed":
        return (
          <div className="rounded-[50px] bg-brand-red px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Failed to create, please contact support."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "ready":
      case "active":
        return (
          <div className="rounded-[50px] bg-brand-green px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Successfully deployed and its in ready state now."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "deleting":
        return (
          <div className="rounded-[50px] bg-brand-red px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Deletion is in progress."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "deleted":
        return (
          <div className="rounded-[50px] bg-brand-red px-4 py-1 text-center text-sm text-brand-light">
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Deleted successfully."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      default:
        return (
          <div>
            {disableToolTip ? (
              <div>{status ? (statusText ?? status.toUpperCase()) : "NA"}</div>
            ) : (
              <Tooltip text={status ? (toolTipText ?? status.toUpperCase()) : "NA"} placement="top-start">
                <div>{status ? (statusText ?? status.toUpperCase()) : "NA"}</div>
              </Tooltip>
            )}
          </div>
        );
    }
  } else if (type === "icon") {
    switch (status) {
      case "requested":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip
            text={toolTipText ?? "Cloud infrastructure has been requested and it's being ready."}
            placement="top-start"
          >
            <span className="flex items-center">
              <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      // case "updating":
      //   return disableToolTip ? (
      //     <span className="flex items-center">
      //       <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
      //       {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
      //     </span>
      //   ) : (
      //     <Tooltip text={toolTipText ?? "Cloud infrastructure is updating right now."} placement="top-start">
      //       <span className="flex items-center">
      //         <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
      //         {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
      //       </span>
      //     </Tooltip>
      //   );
      case "provisioning":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-primary" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Blockchain installation is being done."} placement="top-start">
            <span className="flex items-center">
              <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-primary" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      case "failed":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconZ4Cross className="mr-2 size-5 text-brand-red" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Failed to create, please contact support."} placement="top-start">
            <span className="flex items-center">
              <IconZ4Cross className="mr-2 size-5 text-brand-red" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      case "ready":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconZ4Tick className="mr-2 size-5 text-brand-green" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Successfully deployed and its in ready state now."} placement="top-start">
            <span className="flex items-center">
              <IconZ4Tick className="mr-2 size-5 text-brand-green" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      case "deleting":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-red" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Deletion is in progress."} placement="top-start">
            <span className="flex items-center">
              <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-red" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      case "deleted":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconTrashSquare className="mr-2 text-brand-red" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Deleted successfully."} placement="top-start">
            <span className="flex items-center">
              <IconTrashSquare className="mr-2 text-brand-red" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      default:
        return disableToolTip ? (
          <span className="flex items-center">
            <div>{status ? (statusText ?? status) : "NA"}</div>
          </span>
        ) : (
          <Tooltip text={status ? (toolTipText ?? status) : "NA"} placement="top-start">
            <span className="flex items-center">
              <div>{status ? (statusText ?? status) : "NA"}</div>
            </span>
          </Tooltip>
        );
    }
  }
  return status ?? "NA";
};

export type { NetworkNodeStatusProps };
export default Z4NetworkNodeStatus;
