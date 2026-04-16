"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Heading, Tooltip, tx, Z4Button, Z4DashboardCard, useToast } from "@zeeve-platform/ui";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";
import useRollupService from "@/services/rollups/use-rollup-service";
import buildRollupDeployPayload from "@/services/rollups/build-rollup-deploy-payload";
import { RollupServiceItem } from "@/services/rollups/services-by-type";
import { redirectToStripeUrl } from "@/utils/redirects";

type Props = {
  id: string;
  name: string;
  status?: string | null;
  environment: "testnet" | "mainnet";
  inputs?: RollupServiceItem["inputs"];
};

const DeployedNetworkCard = ({ id, name, status, environment, inputs }: Props) => {
  const isMainnet = environment === "mainnet";
  const labelText = isMainnet ? "MAINNET" : "TESTNET";
  const detailsUrl = `/opstack/network/${id}`;
  const docsUrl = `https://docs.zeeve.io/rollups/op-stack`;
  const normalizedStatus = typeof status === "string" ? status.toLowerCase() : "";
  const isReady = normalizedStatus === "active";
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
    const payload = buildRollupDeployPayload(inputs);
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
        router.push(`/opstack/network/${serviceId}`);
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

  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard
        cardType={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
        className="flex size-full grow flex-col"
      >
        <div className={tx("flex flex-col items-start gap-3 text-sm")}>
          <Heading
            className={tx(
              { "text-white": isMainnet, "text-brand-testnet": !isMainnet },
              "font-normal flex w-full items-center justify-between text-lg",
            )}
            as="h5"
          >
            <span style={{ letterSpacing: ".4em" }}>{labelText}</span>
          </Heading>
          {isMainnet
            ? "The OP Stack mainnet provides production-ready solutions OP Stack's Layer 2 rollup features."
            : "The OP Stack testnet is a development environment for testing OP Stack's Layer 2 rollup features."}
        </div>
        <KeyValuePair
          label="Name"
          value={<span className="mt-1 text-sm font-medium text-[#09122D]">{name}</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
        />
        <KeyValuePair
          label="Network Type"
          value={<span className="mt-1 text-sm font-medium text-[#09122D]">{isMainnet ? "Mainnet" : "Testnet"}</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
        />
        {status ? (
          <KeyValuePair
            label="Status"
            value={
              <span className="mt-2 text-sm font-medium text-[#09122D]">
                {isDraft ? "PAYMENT PENDING" : normalizedStatus === "active" ? "READY" : String(status).toUpperCase()}
              </span>
            }
            classNames={{ label: "text-xs font-normal text-[#09122D]" }}
            enableBorder={false}
          />
        ) : null}
        <div className="grow" />
        <div className="flex gap-3">
          {isDraft ? (
            <>
              <Z4Button
                className="h-12 w-full"
                colorScheme={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
                variant="solid"
                onClick={handleCompletePayment}
                isLoading={isRetrying}
                isDisabled={isRetrying}
              >
                Complete Payment
              </Z4Button>
              <Link className="w-full" href={docsUrl} target="_blank">
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
                  variant="outline"
                >
                  Info
                </Z4Button>
              </Link>
            </>
          ) : isReady ? (
            <>
              <Link className="w-full" href={detailsUrl}>
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
                  variant="solid"
                >
                  View
                </Z4Button>
              </Link>
              <Link className="w-full" href={docsUrl} target="_blank">
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
                  variant="outline"
                >
                  Info
                </Z4Button>
              </Link>
            </>
          ) : (
            <>
              <Tooltip text="Available once the network reaches Ready state" placement="top-start">
                <div className="w-full">
                  <Z4Button
                    className="h-12 w-full"
                    colorScheme={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
                    variant="solid"
                    isDisabled
                    aria-disabled={true}
                  >
                    View
                  </Z4Button>
                </div>
              </Tooltip>
              <Link className="w-full" href={docsUrl} target="_blank">
                <Z4Button
                  className="h-12 w-full"
                  colorScheme={isMainnet ? ("mainnet" as const) : ("testnet" as const)}
                  variant="outline"
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

export default DeployedNetworkCard;
