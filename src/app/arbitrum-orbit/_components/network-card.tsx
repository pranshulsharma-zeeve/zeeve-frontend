"use client";

import Link from "next/link";
import { Heading, Tooltip, tx, Z4Button, Z4DashboardCard, useToast } from "@zeeve-platform/ui";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";
import { Network } from "@orbit/types/network";
import Z4NetworkNodeStatus from "@orbit/components/z4-network-node-status";
import ROUTES from "@orbit/routes";
import { withBasePath } from "@orbit/utils/helpers";
import useRollupService from "@/services/rollups/use-rollup-service";
import buildRollupDeployPayload from "@/services/rollups/build-rollup-deploy-payload";
import { OrbitService } from "@/modules/arbitrum-orbit/services/rollup/services";
import { normalizeStatus } from "@/app/zksync/page-client";
import { redirectToStripeUrl } from "@/utils/redirects";

interface NetworkCardProps {
  data: Network & { serviceInputs?: OrbitService["inputs"] };
}

const NetworkCard = ({
  data: { networkId, networkName, networkStatus, isDemo, networkEnvironment, serviceInputs },
}: NetworkCardProps) => {
  const [isNavigatingView, setIsNavigatingView] = useState(false);
  const [isNavigatingInfo, setIsNavigatingInfo] = useState(false);
  const networkDetailsUrl = withBasePath(
    `${ROUTES.ARBITRUM_ORBIT.PAGE.NETWORK}/${networkId}${isDemo ? "?demo=true" : ""}`,
  );
  const cardType = isDemo ? "demo" : networkEnvironment === "mainnet" ? "testnet" : "testnet";
  const normalizedStatus = normalizeStatus(networkStatus);
  const labelText = isDemo ? "DEMO" : networkEnvironment === "mainnet" ? "MAINNET" : "TESTNET";
  const isMainnet = networkEnvironment === "mainnet" && !isDemo;
  // const normalizedStatus = (networkStatus ?? "").toString().toLowerCase();
  const isReady = normalizedStatus === "ready" || normalizedStatus === "active";
  const isDraft = normalizedStatus === "draft";
  const toast = useToast();
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const { deploy } = useRollupService();
  const handleStripeRedirect = (url: string) => {
    if (redirectToStripeUrl(url)) {
      return true;
    }
    toast("", { status: "error", message: "Invalid payment link. Please contact support." });
    return false;
  };

  const handleCompletePayment = async () => {
    const payload = buildRollupDeployPayload(serviceInputs);
    if (!payload) {
      toast("", { status: "error", message: "Unable to initiate payment. Please contact support." });
      return;
    }
    try {
      setIsRetrying(true);
      const response = (await deploy().request(payload)) as {
        checkout_url?: string;
        redirectionUrl?: string;
        data?: {
          checkout_url?: string;
          redirectionUrl?: string;
          service?: { service_id?: string };
          id?: string;
        };
        message?: string;
        service?: { service_id?: string };
        id?: string;
      };
      const checkoutUrl = response.data?.checkout_url ?? response.checkout_url ?? undefined;
      const redirectionUrl = response.data?.redirectionUrl ?? response.redirectionUrl ?? undefined;
      const serviceId =
        response.data?.service?.service_id ?? response.service?.service_id ?? response.data?.id ?? response.id;
      if (checkoutUrl) {
        if (handleStripeRedirect(checkoutUrl)) {
          return;
        }
        return;
      }
      if (redirectionUrl) {
        if (redirectionUrl.startsWith("http")) {
          if (handleStripeRedirect(redirectionUrl)) {
            return;
          }
        } else {
          router.push(redirectionUrl);
        }
        return;
      }
      if (serviceId) {
        router.push(withBasePath(`${ROUTES.ARBITRUM_ORBIT.PAGE.NETWORK}/${serviceId}${isDemo ? "?demo=true" : ""}`));
        return;
      }
      toast("", { status: "error", message: response.message || "Unable to create checkout session." });
    } catch (error) {
      const err = error as AxiosError<{ message?: string; error?: string; detail?: string }>;
      const message = axios.isAxiosError(error)
        ? err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "An unexpected error occurred"
        : "An unexpected error occurred";
      toast("", { status: "error", message });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleViewClick = () => {
    if (!isReady) return;
    setIsNavigatingView(true);
  };

  const viewButton = (
    <Z4Button
      className="h-12 w-full"
      colorScheme={cardType as never}
      variant={"solid"}
      onClick={handleViewClick}
      isLoading={isNavigatingView}
      isDisabled={!isReady}
      aria-disabled={!isReady}
    >
      View
    </Z4Button>
  );

  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard cardType={cardType as never} className="flex size-full grow flex-col">
        <div className={tx("flex flex-col items-start gap-3 text-sm")}>
          <Heading
            className={tx(
              { "text-brand-demo": isDemo, "text-brand-testnet": !isDemo },
              "font-normal flex flex-row justify-between w-full items-center text-lg",
            )}
            as={"h5"}
          >
            <span
              style={{
                letterSpacing: ".4em",
              }}
            >
              {labelText}
            </span>
            {isDemo && (
              <span className="border-brand-demo text-brand-demo rounded-md border px-1.5 text-sm font-medium">
                Free
              </span>
            )}
          </Heading>
          {isMainnet
            ? "The Arbitrum Orbit mainnet provides production-ready solutions Arbitrum Orbit's Layer 3 rollup features."
            : "The Arbitrum Orbit testnet is a development environment for testing Arbitrum Orbit's Layer 3 rollup features."}
        </div>
        <>
          <KeyValuePair
            label={"Name"}
            value={<span className="mt-1 text-sm font-medium text-[#09122D]">{networkName}</span>}
            classNames={{
              label: "text-xs font-normal text-[#09122D]",
              container: "border-b border-[#DEDEDE] pb-2",
            }}
          />
          {/* <KeyValuePair
            label={"Chain Id"}
            value={
              <span className=" flex justify-between">
                <div>{"changeIt"}</div>
              </span>
            }
          /> */}
          <KeyValuePair
            label={"Network Type"}
            value={<span className="mt-1 text-sm font-medium text-[#09122D]">{isMainnet ? "Mainnet" : "Testnet"}</span>}
            classNames={{
              label: "text-xs font-normal text-[#09122D]",
              container: "border-b border-[#DEDEDE] pb-2",
            }}
          />
          {normalizedStatus && (
            <KeyValuePair
              label={"Status"}
              value={
                <span className="mt-2 text-sm font-medium text-[#09122D]">
                  {isDraft ? "PAYMENT PENDING" : <Z4NetworkNodeStatus status={normalizedStatus} type="icon" />}
                </span>
              }
              classNames={{
                label: "text-xs font-normal text-[#09122D]",
              }}
              enableBorder={false}
            />
          )}
        </>
        <div className="grow"></div>
        <div className="flex gap-3">
          {isDraft ? (
            <>
              <Z4Button
                className="h-12 w-full"
                colorScheme={cardType as never}
                variant={"solid"}
                onClick={handleCompletePayment}
                isLoading={isRetrying}
                isDisabled={isRetrying}
              >
                Complete Payment
              </Z4Button>
              <Link
                className="w-full"
                href={
                  isDemo
                    ? `https://docs.zeeve.io/rollups/arbitrum-orbit/demo-network`
                    : `https://docs.zeeve.io/rollups/arbitrum-orbit`
                }
              >
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={cardType as never}
                  variant={"outline"}
                  onClick={() => {
                    setIsNavigatingInfo(true);
                  }}
                  isLoading={isNavigatingInfo}
                >
                  Info
                </Z4Button>
              </Link>
            </>
          ) : isReady ? (
            <>
              <Link className="w-full" href={networkDetailsUrl}>
                {viewButton}
              </Link>
              <Link
                className="w-full"
                href={
                  isDemo
                    ? `https://docs.zeeve.io/rollups/arbitrum-orbit/demo-network`
                    : `https://docs.zeeve.io/rollups/arbitrum-orbit`
                }
              >
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={cardType as never}
                  variant={"outline"}
                  onClick={() => {
                    setIsNavigatingInfo(true);
                  }}
                  isLoading={isNavigatingInfo}
                >
                  Info
                </Z4Button>
              </Link>
            </>
          ) : (
            <>
              <Tooltip text="Available once the network reaches Ready state" placement="top-start">
                <div className="w-full">{viewButton}</div>
              </Tooltip>
              <Link
                className="w-full"
                href={
                  isDemo
                    ? `https://docs.zeeve.io/rollups/arbitrum-orbit/demo-network`
                    : `https://docs.zeeve.io/rollups/arbitrum-orbit`
                }
              >
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={cardType as never}
                  variant={"outline"}
                  onClick={() => {
                    setIsNavigatingInfo(true);
                  }}
                  isLoading={isNavigatingInfo}
                >
                  Info
                </Z4Button>
              </Link>
            </>
          )}
        </div>
      </Z4DashboardCard>
    </div>
  );
};

export default NetworkCard;
