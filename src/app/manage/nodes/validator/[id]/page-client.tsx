"use client";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Spinner, Z4Navigation } from "@zeeve-platform/ui";
import InfoBanner from "./_components/protocols/cosmos/_components/info-banner";
import InfrastructureDashboardTab from "./_components/infrastructure-dashboard/infrastructure-dashboard-tab";
import BasicTabs from "./_components/tab/tab";
import ValidatorDashboardTab from "./_components/validator-dashboard/validator-dashboard-tab";
import GeneralInfo from "./_components/protocols/beam/_components/general-info";
import { withBasePath } from "@/utils/helpers";
import ROUTES from "@/routes";
import Actions from "@/components/protocol/details/actions";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import type { NodeDetailsResponse } from "@/services/platform/network/node-details";

const ValidatorNodeDetailPageClient = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const nodeId = params.id as string;
  const protocolId = searchParams.get("protocolId") as string;
  const planType = searchParams.get("planType");
  const tabParam = searchParams.get("tab");

  // Map tab query param to tab index: infrastructure -> 1, default (staking-dashboard) -> 0
  const initialTabIndex = tabParam === "infrastructure" ? 1 : 0;
  const protocolInfo = PROTOCOL_MAPPING[protocolId];
  const normalizedProtocolName = protocolInfo?.name?.toLowerCase() ?? "";


  const {
    request: { data: nodeDetails, isLoading },
  } = usePlatformService().network.nodeDetails(params.id as string);


  const shouldFetchValidatorDetails = Boolean(nodeId);
  const vizionReady =
    shouldFetchValidatorDetails &&
    Boolean(nodeDetails?.data?.isVisionOnboarded) &&
    (nodeDetails?.data?.status ?? "").toLowerCase() === "ready";



  const safeNodeId = vizionReady ? (nodeId as string) : undefined;
  const visionUser = useVisionUserStore((state) => state.visionUser);



  const {
    request: { data: updatedValidatorNodeDetails, isLoading: updatedValidatorNodeDetailsLoading },
  } = usePlatformService().vizion.updatedValidatorNodeDetails(safeNodeId);

  const {
    request: { data: validatorPublicDetails, isLoading: validatorPublicDetailsLoading },
  } = usePlatformService().vizion.validatorPublicDetails(safeNodeId);
  // const {
  //   request: { data: updatedValidatorNodeDetails, isLoading: updatedValidatorNodeDetailsLoading },
  // } = usePlatformService().vizion.updatedValidatorNodeDetails(nodeId);

  // const {
  //   request: { data: validatorPublicDetails, isLoading: validatorPublicDetailsLoading },
  // } = usePlatformService().vizion.validatorPublicDetails(nodeId);

  // const validatorDashboardDisplayName = `${protocolInfo.name} Validator`;

  const isValidatorDashboardDisabled = updatedValidatorNodeDetails?.data?.validator_address === null;
  const validatorDisplayName =
    validatorPublicDetails?.data?.summary?.moniker ??
    updatedValidatorNodeDetails?.data?.validator_address ??
    (protocolInfo?.name ? `${protocolInfo.name} Validator` : nodeId);

  const specialProtocols = [
    "avalanche",
    "xdc",
    "beam l1",
    "near",
    "subsquid",
    "dcomm",
    "solana",
    "flow",
    "polygon",
    "coreum",
  ];
  // Do not auto-redirect when node is not ready; keep the user here

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <>
        <Z4Navigation
          heading={
            <div>
              {isLoading ? (
                <Spinner colorScheme={"cyan"} />
              ) : protocolId ? (
                <div className="flex flex-row items-center gap-2">
                  <span className="text-xl md:text-2xl">Validator Nodes -</span>
                  <Image
                    src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)}
                    alt={`${PROTOCOL_MAPPING[protocolId]?.name} Icon`}
                    width={24}
                    height={24}
                  />{" "}
                  <span className="text-xl md:text-2xl">{PROTOCOL_MAPPING[protocolId]?.name}</span>
                </div>
              ) : (
                nodeId
              )}
            </div>
          }
          breadcrumb={{
            items: [
              { label: "Dashboard", href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`), as: "a" },
              { label: "Manage Validator Nodes", href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES) },
              {
                label: "Node Details",
                href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES}/${nodeId}?protocolId=${protocolId}`),
                isActive: true,
              },
            ],
          }}
        >
          <Actions
            protocolName={protocolInfo?.name}
            validatorNodeDetails={updatedValidatorNodeDetails}
            validatorPublicDetails={validatorPublicDetails}
            endpoint={nodeDetails?.data?.endpoint}
          />
        </Z4Navigation>

        {isValidatorDashboardDisabled && (
          <InfoBanner
            name={protocolInfo?.name}
            status={nodeDetails?.data?.status}
            validatorAddress={updatedValidatorNodeDetails?.data?.validator_address}
            isVizionOnboarded={nodeDetails?.data?.isVisionOnboarded}
          />
        )}
        <div className="rounded-xl p-3 lg:p-6">
          {protocolId === "a7a25c9e-c2cd-4f0c-a4af-777b818b4b16" ? ( // Beam L1 dashboard
            <div className="grid grid-cols-12 gap-2 text-brand-dark lg:gap-6">
              <GeneralInfo
                blsKey={nodeDetails?.data?.metadata?.blsKey}
                blsProof={nodeDetails?.data?.metadata?.blsProof}
                nodeId={nodeDetails?.data?.metadata?.nodeId}
                dcomm={false}
              />
            </div>
          ) : (
            <BasicTabs
              defaultIndex={initialTabIndex}
              tabs={[
                {
                  label: "Staking Dashboard",
                  disabled: isValidatorDashboardDisabled,
                  disabledTooltip: "Please stake your node to view the validator dashboard",
                  content: (
                    <ValidatorDashboardTab
                      validatorName={validatorDisplayName}
                      validatorAddress={updatedValidatorNodeDetails?.data?.validator_address ?? ""}
                      protocolName={protocolInfo?.name}
                      protocolIcon={protocolInfo?.icon ? `/assets/images/protocols/${protocolInfo.icon}` : undefined}
                      isLoading={isLoading}
                      validatorPublicDetails={validatorPublicDetails}
                      validatorPublicDetailsLoading={validatorPublicDetailsLoading}
                      updatedValidatorNodeDetails={updatedValidatorNodeDetails}
                      updatedValidatorNodeDetailsLoading={updatedValidatorNodeDetailsLoading}
                      nodeId={safeNodeId}
                      nodeDetails={nodeDetails as NodeDetailsResponse | undefined}
                    />
                  ),
                },
                {
                  label: "Infrastructure Dashboard",
                  content: (
                    <InfrastructureDashboardTab
                      protocolName={protocolInfo?.name ?? ""}
                      createdAt={nodeDetails?.data?.created_on}
                      // validatorData={updatedValidatorNodeDetails}
                      // validatorNodeDetails={updatedValidatorNodeDetails}
                      // restakeDataRequest={restakeDataRequest}
                      nodeDetails={nodeDetails}
                      isLoading={isLoading}
                    />
                  ),
                },
              ]}
            />
          )}
        </div>
      </>
    </div>
  );
};

export default ValidatorNodeDetailPageClient;
