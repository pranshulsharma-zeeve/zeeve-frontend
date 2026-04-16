"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  IconButton,
  Tooltip,
  useToggle,
} from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import React from "react";
import { IconTrash } from "@zeeve-platform/icons/essential/outline";
import { IconChevronDown, IconChevronUp } from "@zeeve-platform/icons/arrow/outline";
import { useUserStore } from "@orbit/store/user";
import { useNetworkStore } from "@orbit/store/network";
import { useModalStore } from "@orbit/store/modal";
import {
  getBridgeUrl,
  getFaucetUrl,
  getL3ExplorerUrl,
  getNetworkName,
  getNetworkOwner,
  getNetworkStatus,
} from "@orbit/utils/network-overview";

export const ActionsDropDown = () => {
  const params = useParams();
  const networkId = params.id as string;
  const { openModal } = useModalStore();
  const { isOpen: isDropdownOpen, handleToggle: handleDropdownToggle, handleClose: handleDropdownClose } = useToggle();
  const user = useUserStore((state) => state.user);
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const networkStatus = getNetworkStatus(networkInfo.data);
  const bridgeUrl = getBridgeUrl(networkInfo.data);
  const faucetUrl = getFaucetUrl(networkInfo.data);
  const explorerUrl = getL3ExplorerUrl(networkInfo.data);

  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      <DropdownMenu onClose={handleDropdownClose} isOpen={isDropdownOpen} placement="bottom-start" className="w-full">
        <DropdownMenuButton
          as={Button}
          onClick={handleDropdownToggle}
          variant="outline"
          colorScheme="blue"
          className="flex w-full items-center justify-between rounded-md border border-brand-mainnet p-0 px-3"
          isFullWidth
        >
          <span className="font-semibold">Actions</span>
          {isDropdownOpen ? (
            <IconChevronUp className="border-brand-mainnet text-sm" />
          ) : (
            <IconChevronDown className="border-brand-mainnet text-sm" />
          )}
        </DropdownMenuButton>
        <DropdownMenuList className="w-3/4 p-0">
          <DropdownMenuItem
            onClick={() => {
              window.open("https://docs.zeeve.io/rollups/arbitrum-orbit", "_blank");
            }}
            className="rounded-t-md border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark"
          >
            Docs
          </DropdownMenuItem>
          <DropdownMenuItem
            isDisabled={networkStatus !== "active" || !bridgeUrl}
            onClick={() => {
              if (bridgeUrl) {
                window.open(bridgeUrl);
              }
            }}
            className="border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark"
          >
            Bridge
          </DropdownMenuItem>
          <DropdownMenuItem
            isDisabled={networkStatus !== "active" || !faucetUrl}
            onClick={() => {
              if (faucetUrl) {
                window.open(faucetUrl);
              }
            }}
            className="border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark"
          >
            Faucet
          </DropdownMenuItem>
          {/* Explorer Button */}
          <DropdownMenuItem
            isDisabled={networkStatus !== "active" || !explorerUrl}
            onClick={() => {
              if (explorerUrl && networkStatus === "active") {
                window.open(explorerUrl);
              }
            }}
            className="border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark"
          >
            Explorer
          </DropdownMenuItem>
          {/* <DropdownMenuItem isDisabled onClick={() => {}} className="text-sm font-normal">
            Analytics
          </DropdownMenuItem> */}
        </DropdownMenuList>
      </DropdownMenu>
      {/* <Tooltip text="Delete Network" placement={"top-start"}>
        <IconButton
          colorScheme="red"
          variant={"outline"}
          isLoading={networkInfo.isLoading}
          isDisabled={
            !(
              ["provisioning", "ready", "failed"].includes(networkStatus ?? "") &&
              getNetworkOwner(networkInfo.data) === user?.usercred
            )
          }
          onClick={() => {
            openModal("deleteNetwork", {
              deleteNetwork: { networkId, networkName: getNetworkName(networkInfo.data) as string },
            });
          }}
        >
          {<IconTrash className="text-xl" />}
        </IconButton>
      </Tooltip> */}
    </div>
  );
};
