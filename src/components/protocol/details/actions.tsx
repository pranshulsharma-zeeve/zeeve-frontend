"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  Link,
  useToast,
  useToggle,
} from "@zeeve-platform/ui";
import { IconChart5Square } from "@zeeve-platform/icons/business/outline";
import { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconTrash } from "@zeeve-platform/icons/essential/outline";
import { useParams, useSearchParams } from "next/navigation";
import { IconSetting1 } from "@zeeve-platform/icons/setting/outline";
import moment from "moment";
import useAnalyticsService from "@/services/analytics/use-analytics-service";
import { useNetworkStore } from "@/store/network";
import { ModalType, useModalStore } from "@/store/modal";
import { getNodeType, getTimeDiffrenceInHrs } from "@/utils/helpers";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import usePlatformService from "@/services/platform/use-platform-service";
import { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";
import { TxnMethods } from "@/types/network";
import { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";
import { ValidatorPublicDetailsResponse } from "@/services/vizion/validator-public-details";

interface Props {
  protocolName: string | undefined;
  validatorNodeDetails: UpdatedValidatorNodeResponse | undefined;
  validatorPublicDetails: ValidatorPublicDetailsResponse | undefined;
  endpoint?: string;
}

interface MenuItem {
  label: string;
  key?: string;
  modalName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  methodName?: TxnMethods;
}

const editMenuItems: MenuItem[] = [
  {
    label: "Validator Name",
    key: "validatorName",
    methodName: "update-validator-name",
  },
  {
    label: "Commission Rate (%)",
    key: "commissionRate",
    methodName: "change-commission",
  },
  {
    label: "Security Contact",
    key: "email",
    methodName: "update-email",
  },
  {
    label: "Validator Identity",
    key: "validatorIdentity",
    methodName: "validator-identity",
  },
  {
    label: "Website",
    key: "website",
    methodName: "edit-website",
  },
  {
    label: "Validator Description",
    key: "description",
    methodName: "update-description",
  },
  {
    label: "Select Wallet",
    key: "selectWallet", // assuming this maps to the wallet
  },
];

const settingsMenuItems: MenuItem[] = [
  {
    label: "Unbond Tokens",
    modalName: "unboundToken",
  },
  {
    label: "Unjail Validator",
    modalName: "unjail",
  },
  {
    label: "Withdraw Rewards and Commission",
    modalName: "withdrawRewards",
  },
  {
    label: "Set Rewards to a different Wallet",
    modalName: "setRewards",
  },
  {
    label: "Enable Restake",
    modalName: "enableRestake",
  },
  {
    label: "Disable Restake",
    modalName: "disableRestake",
  },
];
const Actions = ({ protocolName, validatorNodeDetails, validatorPublicDetails, endpoint }: Props) => {
  const [nodeId, setNodeId] = useState<string>();
  const [networkId, setNetworkId] = useState<string>();
  const { isOpen, handleToggle, handleClose } = useToggle();
  const { isOpen: isEditMenuOpen, handleToggle: handleEditMenuToggle, handleClose: handleEditMenuClose } = useToggle();
  const {
    isOpen: isSettingsMenuOpen,
    handleToggle: handleSettingsMenuToggle,
    handleClose: handleSettingsMenuClose,
  } = useToggle();
  const toast = useToast();

  const { openModal } = useModalStore();
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const nodeType = getNodeType();
  const params = useParams();
  const protocolId = params.id as string;
  const searchParams = useSearchParams();
  const [shardeumValidatorUI, setShardeumValidatorUI] = useState("");
  const [shouldPoll, setShouldPoll] = useState(false);
  const shouldFetchActionStatus = protocolName?.toLowerCase() === "shardeum";
  const shouldFetchValidatorDetails = protocolName?.toLowerCase() === "coreum";
  // const [canDeleteNetwork, setCanDeleteNetwork] = useState<boolean>(true);
  const {
    request: { data: actionData, isLoading: actionLoading },
  } = usePlatformService().protocol.actionStatus(
    shouldFetchActionStatus ? (params.id as string) : undefined,
    shouldFetchActionStatus ? (searchParams.get("protocolId") as string) : undefined,
    shouldPoll,
  );
  // Then update it when actionData changes
  useEffect(() => {
    if (actionData?.data?.status === false) {
      setShouldPoll(true);
    } else if (actionData?.data?.status === true) {
      setShouldPoll(false);
    }
  }, [actionData]);

  const {
    request: { data, isLoading },
  } = useAnalyticsService().dashboardUrls(nodeId);

  const {
    request: { data: transactions },
  } = usePlatformService().vizion.validatorTransaction(shouldFetchValidatorDetails ? nodeId : undefined);

  // const renderButton = () => {
  //   if (!(nodeType === "full" || nodeType === "archive") && protocolData?.network.networkFromNodeJourney) {
  //     return false;
  //   } else if (!(nodeType === "validator") && !(protocolName === "Beam L1")) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  useEffect(() => {
    if (endpoint) {
      setShardeumValidatorUI(endpoint);
    }
  }, [endpoint]);

  // useEffect(() => {
  //   console.log("inside useEffect canUnbound", transactions);

  //   if (!transactions?.data || transactions.data.length <= 0) return;

  //   const canUnbound = transactions.data
  //     .sort((tx1, tx2) => {
  //       return moment(tx2.created_at).unix() - moment(tx1.created_at).unix();
  //     })
  //     .find((tx) => {
  //       const { txhash } = tx.details;
  //       if (tx.action === "unbound-token" && txhash !== undefined) {
  //         const diff = getTimeDiffrenceInHrs(tx.created_at);

  //         if (diff / 24 < 7) return true;
  //         else return false;
  //       } else return false;
  //     });
  //   console.log("delete network canUnbound", canUnbound);
  //   if (canUnbound !== undefined) setCanDeleteNetwork(false);
  //   else setCanDeleteNetwork(true);
  // }, [transactions]);

  return (
    <div className="flex flex-row gap-x-4">
      <DropdownMenu onClose={handleClose} isOpen={isOpen} placement="bottom-start">
        {/* {renderButton() ? (
          <DropdownMenuButton
            as={Button}
            onClick={handleToggle}
            isDisabled={
              networkInfo.data?.network.status !== "ready" || typeof data === "undefined" || data.length === 0
            }
            iconLeft={<IconChart5Square className="text-xl" />}
            isLoading={isLoading || networkInfo.isLoading}
            isFullWidth
          >
            Analytics
          </DropdownMenuButton>
        ) : null} */}

        <DropdownMenuList>
          {data
            ? data.map((dashboard, index) => (
                <Link key={index} href={dashboard.dashboardURL} target={"_blank"}>
                  <DropdownMenuItem>{dashboard.dashboardName}</DropdownMenuItem>
                </Link>
              ))
            : null}
        </DropdownMenuList>
      </DropdownMenu>
      {/* Network Delete Button For Full Node*/}
      {/* {(nodeType === "full" || nodeType === "archive") && (
        <Tooltip text="Delete Network" placement={"top-start"}>
          <IconButton
            colorScheme="red"
            variant={"outline"}
            isLoading={networkInfo.isLoading}
            onClick={() => {
              openModal("deleteProtocol", {
                deleteProtocol: {
                  protocolId: protocolId,
                  protocolName: PROTOCOL_MAPPING[protocolId]?.name,
                  nodeType: nodeType,
                },
              });
            }}
          >
            {<IconTrash className="text-xl" />}
          </IconButton>
        </Tooltip>
      )} */}

      {/* Network Delete Button For Coreum Validator Node*/}
      {/* {protocolName?.toLocaleLowerCase() === "coreum" && nodeType === "validator" && canDeleteNetwork && (
        <Tooltip text="Delete Network" placement={"top-start"}>
          <IconButton
            colorScheme="red"
            variant={"outline"}
            isLoading={networkInfo.isLoading}
            onClick={() => {
              openModal("deleteProtocol", {
                deleteProtocol: {
                  protocolId: protocolId,
                  protocolName: PROTOCOL_MAPPING[protocolId]?.name,
                  nodeType: nodeType,
                },
              });
            }}
          >
            {<IconTrash className="text-xl" />}
          </IconButton>
        </Tooltip>
      )} */}

      {/*Stake Button */}
      {nodeType === "validator" &&
        protocolName?.toLocaleLowerCase() === "coreum" &&
        !validatorNodeDetails?.data?.validator_address && (
          <Button
            variant="outline"
            size="medium"
            className="w-auto rounded-[6px] px-4 font-semibold hover:bg-brand-primary hover:text-white"
            isLoading={networkInfo.isLoading}
            isDisabled={validatorNodeDetails?.data?.validator_address ? true : false}
            onClick={() => {
              openModal("stakevalidator", {
                stakevalidator: {
                  networkId: networkId as string,
                  validatorNodeDetails: validatorNodeDetails as UpdatedValidatorNodeResponse,
                  validatorPublicDetails: validatorPublicDetails as ValidatorPublicDetailsResponse,
                },
              });
            }}
          >
            Stake
          </Button>
        )}

      {/* Edit Button*/}
      {protocolName?.toLowerCase() === "coreum" && (
        <DropdownMenu onClose={handleEditMenuClose} isOpen={isEditMenuOpen} placement="bottom-start">
          <DropdownMenuButton
            as={Button}
            variant={"outline"}
            className="w-auto rounded-[6px] px-4 font-semibold hover:bg-brand-primary hover:text-white"
            onClick={handleEditMenuToggle}
            // isLoading={isLoading || networkInfo.isLoading}
            isDisabled={
              !validatorNodeDetails?.data?.validator_address
              // !protocolData?.nodes[0]?.metaData?.nodes[0]?.isVisionOnboarded
            }
          >
            Edit
          </DropdownMenuButton>

          <DropdownMenuList className="w-60 rounded-xl p-0">
            {editMenuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className={`h-12 border-b-[#DFDFDF] text-sm font-normal text-[#09122D] hover:bg-[#4864D733] hover:text-[#09122D] focus:bg-[#4864D733] focus:text-[#09122D] ${index === 0 ? "rounded-t-xl" : index === editMenuItems.length - 1 ? "rounded-b-xl" : ""}`}
                onClick={() => {
                  openModal("editValidator", {
                    editValidator: {
                      key: item.key as string,
                      value: item.label,
                      validatorNodeDetails: validatorNodeDetails as UpdatedValidatorNodeResponse,
                      validatorPublicDetails: validatorPublicDetails as ValidatorPublicDetailsResponse,
                      methodName: item.methodName as TxnMethods,
                    },
                  });
                }}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuList>
        </DropdownMenu>
      )}

      {/* Settings Button*/}
      {protocolName?.toLowerCase() === "coreum" && (
        <DropdownMenu onClose={handleSettingsMenuClose} isOpen={isSettingsMenuOpen} placement="bottom-start">
          <DropdownMenuButton
            as={IconButton}
            variant={"outline"}
            className="w-11 rounded-xl px-2 hover:bg-brand-primary hover:text-white"
            onClick={handleSettingsMenuToggle}
            isDisabled={
              !validatorNodeDetails?.data?.validator_address
              // !protocolData?.nodes[0]?.metaData?.nodes[0]?.isVisionOnboarded
            }
            // isLoading={isLoading || networkInfo.isLoading}
          >
            <IconSetting1 className="text-[28px]" />
          </DropdownMenuButton>

          <DropdownMenuList className="w-80 rounded-xl p-0">
            {settingsMenuItems.map((item, index) => {
              const isEnableRestake = item.modalName === "enableRestake";
              const isDisableRestake = item.modalName === "disableRestake";
              const isDisabled =
                (isEnableRestake && validatorNodeDetails?.data?.restake_status) ||
                (isDisableRestake && !validatorNodeDetails?.data?.restake_status);

              return (
                <DropdownMenuItem
                  key={index}
                  isDisabled={isDisabled} // ✅ disable Enable/Disable Restake modal based on restake status
                  className={`
            h-12 border-b-[#DFDFDF] text-sm font-normal text-[#09122D]
            ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-[#4864D733] hover:text-[#09122D] focus:bg-[#4864D733] focus:text-[#09122D]"}
            ${index === 0 ? "rounded-t-xl" : index === settingsMenuItems.length - 1 ? "rounded-b-xl" : ""}
          `}
                  onClick={() => {
                    if (isDisabled) return; // ✅ prevent click
                    openModal(item.modalName as ModalType, {
                      cosmosSettingsModals: {
                        networkId: networkId ?? "",
                        nodeId: (params.id as string) ?? "",
                        networkType: validatorNodeDetails?.data.network_type as string,
                        botAddress: validatorNodeDetails?.data.bot_addresses as string,
                        botBalance: validatorNodeDetails?.data.bot_wallet_balances as {
                          denom: string;
                          amount: string;
                        },
                        validatorAddress: validatorNodeDetails?.data.validator_address as string,
                        delegationAddress: validatorNodeDetails?.data.delegation_address as string,
                        validatorPublicDetails: validatorPublicDetails as ValidatorPublicDetailsResponse,
                      },
                    });
                  }}
                >
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuList>
        </DropdownMenu>
      )}
      {/* Validator UI Button For Shardeum Validator*/}
      {nodeType === "validator" &&
        protocolName === "Shardeum" &&
        (!shardeumValidatorUI || shardeumValidatorUI === "" ? (
          <Tooltip text="Enabled once validator UI is available" placement="bottom-start">
            <span>
              <a
                href={shardeumValidatorUI.startsWith("http") ? shardeumValidatorUI : `https://${shardeumValidatorUI}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button isDisabled size={"small"}>
                  {"Validator UI"}
                </Button>
              </a>
            </span>
          </Tooltip>
        ) : (
          <a
            href={shardeumValidatorUI.startsWith("http") ? shardeumValidatorUI : `https://${shardeumValidatorUI}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size={"small"}>{"Validator UI"}</Button>
          </a>
        ))}
      {/* Change Password For Shardeum UI*/}
      {nodeType === "validator" &&
        protocolName === "Shardeum" &&
        (!shardeumValidatorUI || shardeumValidatorUI === "" ? (
          <Tooltip text="Resetting Password." placement="top-start">
            <span>
              <Button
                variant="outline"
                size="small"
                isLoading={networkInfo.isLoading}
                isDisabled
                onClick={() => {
                  openModal("changePassword", {
                    changePassword: {
                      networkId: (params.id as string) || "",
                      protocolId: (searchParams.get("protocolId") as string) || "",
                    },
                  });
                }}
              >
                Change Password
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            variant="outline"
            size="small"
            isLoading={networkInfo.isLoading}
            onClick={() => {
              openModal("changePassword", {
                changePassword: {
                  networkId: (params.id as string) || "",
                  protocolId: (searchParams.get("protocolId") as string) || "",
                },
              });
            }}
          >
            Change Password
          </Button>
        ))}
    </div>
  );
};

export default Actions;
