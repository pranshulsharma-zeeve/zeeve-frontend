"use client";
import { useParams } from "next/navigation";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  useToggle,
} from "@zeeve-platform/ui";
import { IconBoxSquare } from "@zeeve-platform/icons/delivery/outline";
import { useZkSyncDashboard } from "../tabs/dashboard-context";
import useZkSyncValidiumService from "@/services/zksync-validium/use-zksync-validium-service";

const ExplorersAction = () => {
  const params = useParams();
  const networkId = params.id as string;
  const { isOpen, handleToggle, handleClose } = useToggle();
  const {
    request: { data: endpointsExpl1, isLoading: isEndpointsExpl1Loading },
  } = useZkSyncValidiumService().supernet.explorerEndpoints(networkId, "type", "expl1");
  const {
    request: { data: endpointsExpl2, isLoading: isEndpointsExpl2Loading },
  } = useZkSyncValidiumService().supernet.explorerEndpoints(networkId, "type", "expl2");
  const { normalized, isLoading } = useZkSyncDashboard();
  const explorerL1Endpoint = normalized?.rollupMetadata?.l1?.explorerUrl;
  const explorerL2Endpoint = normalized?.rollupMetadata?.l2?.explorerUrl;

  return (
    <DropdownMenu isOpen={isOpen} placement="bottom-start" onClose={handleClose}>
      <DropdownMenuButton
        as={Button}
        onClick={handleToggle}
        iconLeft={<IconBoxSquare className="text-xl" />}
        isFullWidth
      >
        Explorers
      </DropdownMenuButton>
      <DropdownMenuList>
        <DropdownMenuItem
          isDisabled={isLoading || !explorerL1Endpoint}
          onClick={() => {
            if (explorerL1Endpoint) {
              window.open(`${explorerL1Endpoint}`);
            }
          }}
        >
          L1 Explorer
        </DropdownMenuItem>
        <DropdownMenuItem
          isDisabled={isLoading || !explorerL2Endpoint}
          onClick={() => {
            if (explorerL2Endpoint) {
              window.open(`${explorerL2Endpoint}`);
            }
          }}
        >
          L2 Explorer
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

export default ExplorersAction;
