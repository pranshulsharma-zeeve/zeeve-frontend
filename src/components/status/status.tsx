"use client";
import React from "react";
import { Tooltip } from "@zeeve-platform/ui";
import { IconArrowDoubleRotateRightCircle } from "@zeeve-platform/icons/arrow/outline";
import { IconCheckCircle, IconTrashSquare, IconXMarkCircle } from "@zeeve-platform/icons/essential/outline";
import { NodeNetworkStates } from "@/types/node";

interface NetworkNodeStatusProps {
  status?: NodeNetworkStates;
  type?: "badge" | "icon";
  statusText?: string;
  toolTipText?: string;
  disableStatusText?: boolean;
  disableToolTip?: boolean;
  size?: "default" | "compact";
}

const NetworkNodeStatus = ({
  status,
  type = "badge",
  statusText,
  toolTipText,
  disableStatusText = false,
  disableToolTip = false,
  size = "default",
}: NetworkNodeStatusProps) => {
  const badgeBaseClassName =
    size === "compact"
      ? "mr-4 rounded-md px-2 py-0.5 text-[10px] font-bold leading-4 text-center whitespace-nowrap"
      : "mr-8 rounded-md p-1 text-center text-xs font-bold";

  if (type === "badge") {
    switch (status?.toLowerCase()) {
      case "requested":
        return (
          <div className={`${badgeBaseClassName} bg-brand-primary text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? "PROVISIONING"}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Blockchain installation is being done."} placement="top-start">
                <div>{statusText ?? "PROVISIONING"}</div>
              </Tooltip>
            )}
          </div>
        );
      case "payment pending":
        return (
          <div className={`${badgeBaseClassName} bg-brand-yellow text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? "PAYMENT PENDING"}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Payment is pending for this node."} placement="top-start">
                <div>{statusText ?? "PAYMENT PENDING"}</div>
              </Tooltip>
            )}
          </div>
        );
      // return (
      //   <div className="mr-8 gap-2 rounded-md bg-brand-yellow p-1 text-center text-xs font-bold text-brand-light">
      //     {disableToolTip ? (
      //       <div>{statusText ?? status.toUpperCase()}</div>
      //     ) : (
      //       <Tooltip
      //         text={toolTipText ?? "Cloud infrastructure has been requested and it's being ready."}
      //         placement="top-start"
      //       >
      //         <div>{statusText ?? status.toUpperCase()}</div>
      //       </Tooltip>
      //     )}
      //   </div>
      // );
      case "updating":
        return (
          <div className={`${badgeBaseClassName} gap-2 bg-brand-yellow text-brand-light`}>
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
          <div className={`${badgeBaseClassName} bg-brand-primary text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Blockchain installation is being done."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "syncing":
        return (
          <div className={`${badgeBaseClassName} gap-2 bg-orange-500 text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Blockchain node is syncing right now."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "failed":
        return (
          <div className={`${badgeBaseClassName} bg-brand-red text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Failed to create, please contact support."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "user input required": // New case for user input required
        return (
          <div className={`${badgeBaseClassName} gap-2 bg-zinc-600 text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? "Configs Required"}</div>
            ) : (
              <Tooltip text={toolTipText ?? "User input is required to proceed."} placement="top-start">
                <div>{statusText ?? "Configs Required"}</div>
              </Tooltip>
            )}
          </div>
        );
      case "ready":
        return (
          <div className={`${badgeBaseClassName} bg-brand-green text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Successfully deployed and its in ready state now."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "success":
        return (
          <div className={`${badgeBaseClassName} bg-green-500 text-white`}>
            {disableToolTip ? (
              <div>{statusText ?? "SUCCESS"}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Successfully deployed and its in ready state now."} placement="top-start">
                <div>{statusText ?? "SUCCESS"}</div>
              </Tooltip>
            )}
          </div>
        );
      case "retry":
        return (
          <div className={`${badgeBaseClassName} bg-red-500 text-white`}>
            {disableToolTip ? (
              <div>{statusText ?? "RETRY"}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Action needs to be retried."} placement="top-start">
                <div>{statusText ?? "RETRY"}</div>
              </Tooltip>
            )}
          </div>
        );
      case "deleting":
        return (
          <div className={`${badgeBaseClassName} bg-brand-red text-brand-light`}>
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
          <div className={`${badgeBaseClassName} bg-brand-red text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Deleted successfully."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "closed":
        return (
          <div className={`${badgeBaseClassName} bg-brand-red text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Closed successfully."} placement="top-start">
                <div>{statusText ?? status.toUpperCase()}</div>
              </Tooltip>
            )}
          </div>
        );
      case "suspended":
        return (
          <div className={`${badgeBaseClassName} bg-brand-red text-brand-light`}>
            {disableToolTip ? (
              <div>{statusText ?? status.toUpperCase()}</div>
            ) : (
              <Tooltip text={toolTipText ?? "Node is suspended."} placement="top-start">
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
            <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-primary" />
            {!disableStatusText && <div>{statusText ?? "PROVISIONING"}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Blockchain installation is being done."} placement="top-start">
            <span className="flex items-center">
              <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-primary" />
              {!disableStatusText && <div>{statusText ?? "PROVISIONING"}</div>}
            </span>
          </Tooltip>
        );
      case "payment pending":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
            {!disableStatusText && <div>{statusText ?? "PAYMENT PENDING"}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Payment is pending for this node."} placement="top-start">
            <span className="flex items-center">
              <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
              {!disableStatusText && <div>{statusText ?? "PAYMENT PENDING"}</div>}
            </span>
          </Tooltip>
        );
      // return disableToolTip ? (
      //   <span className="flex items-center">
      //     <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
      //     {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
      //   </span>
      // ) : (
      //   <Tooltip
      //     text={toolTipText ?? "Cloud infrastructure has been requested and it's being ready."}
      //     placement="top-start"
      //   >
      //     <span className="flex items-center">
      //       <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
      //       {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
      //     </span>
      //   </Tooltip>
      // );
      case "updating":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Cloud infrastructure is updating right now."} placement="top-start">
            <span className="flex items-center">
              <IconArrowDoubleRotateRightCircle className="mr-2 animate-spin text-brand-yellow" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
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
            <IconXMarkCircle className="mr-2 text-brand-red" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Failed to create, please contact support."} placement="top-start">
            <span className="flex items-center">
              <IconXMarkCircle className="mr-2 text-brand-red" />
              {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
            </span>
          </Tooltip>
        );
      case "ready":
        return disableToolTip ? (
          <span className="flex items-center">
            <IconCheckCircle className="mr-2 text-brand-green" />
            {!disableStatusText && <div>{statusText ?? status.toUpperCase()}</div>}
          </span>
        ) : (
          <Tooltip text={toolTipText ?? "Successfully deployed and its in ready state now."} placement="top-start">
            <span className="flex items-center">
              <IconCheckCircle className="mr-2 text-brand-green" />
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
export default NetworkNodeStatus;
