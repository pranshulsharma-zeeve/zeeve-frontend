"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heading, Tooltip, Z4Button, Z4DashboardCard, tx, useToast } from "@zeeve-platform/ui";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";
import { IconZ4Docs, IconZ4Monitor, IconZ4Tick } from "@zeeve-platform/icons/z4/outline";
import { IconArrow1RightCircle, IconChevronSwapLeftRight } from "@zeeve-platform/icons/arrow/outline";
import { IconEndpoints1 } from "@zeeve-platform/icons/programming/outline";
import { IconLaunch } from "@zeeve-platform/icons/product/outline";
import { IconPhoneVolume } from "@zeeve-platform/icons/phone/outline";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Z4NetworkNodeStatus from "@orbit/components/z4-network-node-status";
import { withBasePath } from "@/utils/helpers";
import { RollupKey } from "@/services/rollups/use-rollup-service";
import useRollupServicesByType from "@/services/rollups/services-by-type";
import { getPartnerIconPath } from "@/modules/arbitrum-orbit/constants/partner-icons";
import useRollupService from "@/services/rollups/use-rollup-service";
import buildRollupDeployPayload from "@/services/rollups/build-rollup-deploy-payload";
import { POLYGON_CDK_DEMO_SERVICE_ID } from "@/constants/polygon-cdk";
import { normalizeStatus } from "@/app/zksync/page-client";
import { redirectToStripeUrl } from "@/utils/redirects";

const polygonDocsUrl = "https://docs.zeeve.io/rollups/polygon-cdk-zkrollups";

export default function PolygonCdkLanding({ rollupKey }: { rollupKey: RollupKey }) {
  const { normalizedServices } = useRollupServicesByType("polygon-cdk");
  const toast = useToast();
  const router = useRouter();
  const [isRetryingTestnet, setIsRetryingTestnet] = useState(false);
  const [isRetryingMainnet, setIsRetryingMainnet] = useState(false);
  const { deploy } = useRollupService();
  const demoServiceId = POLYGON_CDK_DEMO_SERVICE_ID;
  const demoService = normalizedServices.find((s) => s.service_id === demoServiceId);
  const testnetService = normalizedServices.find((s) => s.service_id !== demoServiceId && s.network_type === "testnet");
  const mainnetService = normalizedServices.find((s) => s.service_id !== demoServiceId && s.network_type === "mainnet");
  const handleStripeRedirect = (url: string) => {
    if (redirectToStripeUrl(url)) {
      return true;
    }
    toast("", { status: "error", message: "Invalid payment link. Please contact support." });
    return false;
  };
  const cards = useMemo(
    () => ({
      demo: { id: demoService?.service_id, status: "ready", name: "Demo Network" },
    }),
    [demoService],
  );

  const DemoCard = () => {
    const [isNavigatingView, setIsNavigatingView] = useState(false);
    const [isNavigatingInfo, setIsNavigatingInfo] = useState(false);
    const demoName = demoService?.name?.trim() || "Demo Network";
    const demoStatus = demoService?.status ?? "ready";
    return (
      <div className="col-span-12 flex size-full flex-col lg:col-span-4">
        <Z4DashboardCard cardType="demo" className="flex size-full grow flex-col">
          <div className={tx("flex flex-col items-start gap-3 text-sm")}>
            <Heading
              className="flex w-full flex-row items-center justify-between text-lg font-normal text-brand-demo"
              as="h5"
            >
              <span style={{ letterSpacing: ".4em" }}>DEMO</span>
              <span className="rounded-md border border-brand-demo px-1.5 text-sm font-medium text-brand-demo">
                Free
              </span>
            </Heading>
            Layer 2 ZK Validium Sandbox Network using Polygon CDK Stack.
          </div>
          <>
            <KeyValuePair
              label="Name"
              value={<span className="mt-1 text-sm font-medium text-[#09122D]">{demoName}</span>}
              classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
            />
            <KeyValuePair
              label="Network Type"
              value={<span className="mt-1 text-sm font-medium text-[#09122D]">Sandbox</span>}
              classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
            />
            <KeyValuePair
              label="Status"
              value={
                <span className="mt-2 text-sm font-medium text-[#09122D]">
                  <Z4NetworkNodeStatus status={normalizeStatus(demoStatus) as never} type="icon" />
                </span>
              }
              classNames={{ label: "text-xs font-normal text-[#09122D]" }}
              enableBorder={false}
            />
          </>
          <div className="grow"></div>
          <div className="flex gap-3">
            <Link className="w-full" href={cards.demo.id ? `/polygon-cdk/network/${cards.demo.id}` : "#"}>
              <Z4Button
                className="h-12 w-full"
                colorScheme="demo"
                variant="solid"
                onClick={() => setIsNavigatingView(true)}
                isLoading={isNavigatingView}
              >
                View
              </Z4Button>
            </Link>
            <Link
              className="w-full"
              href={`https://docs.zeeve.io/rollups/polygon-cdk-zkrollups${cards.demo.id ? "/demo-network" : ""}`}
              target="_blank"
            >
              <Z4Button
                className="h-12 w-full"
                colorScheme="demo"
                variant="outline"
                onClick={() => setIsNavigatingInfo(true)}
                isLoading={isNavigatingInfo}
              >
                Info
              </Z4Button>
            </Link>
          </div>
        </Z4DashboardCard>
      </div>
    );
  };

  const TestnetCard = () => {
    const [isNavigatingView, setIsNavigatingView] = useState(false);
    const [isNavigatingDeploy, setIsNavigatingDeploy] = useState(false);
    const [isNavigatingInfo, setIsNavigatingInfo] = useState(false);
    const testnetStatus = (testnetService?.status ?? "").toString().toLowerCase();
    const testnetReady = testnetStatus === "active" || testnetStatus === "ready";
    const testnetDraft = testnetStatus === "draft";
    const displayTestnetStatus = testnetStatus === "active" ? "ready" : testnetService?.status;

    const handleCompletePayment = async () => {
      const payload = buildRollupDeployPayload(testnetService?.inputs);
      if (!payload) {
        toast("", { status: "error", message: "Unable to initiate payment. Please contact support." });
        return;
      }
      try {
        setIsRetryingTestnet(true);
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
          router.push(withBasePath(`/polygon-cdk/network/${serviceId}`));
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
        setIsRetryingTestnet(false);
      }
    };

    const handleViewClick = () => {
      if (!testnetReady) return;
      setIsNavigatingView(true);
    };

    const viewButton = (
      <Z4Button
        className="h-12 w-full"
        colorScheme="testnet"
        variant="solid"
        onClick={handleViewClick}
        isLoading={isNavigatingView}
        isDisabled={!testnetReady}
        aria-disabled={!testnetReady}
      >
        View
      </Z4Button>
    );
    return (
      <div className="col-span-12 flex size-full flex-col lg:col-span-4">
        <Z4DashboardCard cardType="testnet" className="flex size-full h-max grow flex-col">
          <div className={tx("flex flex-col items-start gap-3 text-sm")}>
            <Heading
              className={tx("text-brand-testnet", "font-normal text-lg")}
              as="h5"
              style={{ letterSpacing: ".4em" }}
            >
              TESTNET
            </Heading>
            Layer 2 ZK Validium Testnet using Polygon CDK Stack.
          </div>
          {testnetService ? (
            <>
              <KeyValuePair
                label={"Name"}
                value={<span className="mt-1 text-sm font-medium text-[#09122D]">{testnetService.name}</span>}
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-2",
                }}
              />
              <KeyValuePair
                label={"Network Type"}
                value={<span className="mt-1 text-sm font-medium text-[#09122D]">{"Testnet"}</span>}
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-2",
                }}
              />
              <KeyValuePair
                label={"Status"}
                value={
                  <span className="mt-2 text-sm font-medium text-[#09122D]">
                    {testnetDraft ? (
                      "PAYMENT PENDING"
                    ) : (
                      <Z4NetworkNodeStatus status={displayTestnetStatus as never} type="icon" />
                    )}
                  </span>
                }
                classNames={{ label: "text-xs font-normal text-[#09122D]" }}
                enableBorder={false}
              />
            </>
          ) : (
            <>
              <KeyValuePair
                label="Settlement Layer"
                value={
                  <span className="mt-2 flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                      <Image
                        src={withBasePath("/assets/images/partners/ethereum.svg")}
                        alt="Ethereum Logo"
                        width={12}
                        height={12}
                      />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">Ethereum Sepolia (L1)</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                }
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-3",
                }}
              />
              <KeyValuePair
                label="Data Availability (DA) Layer"
                value={
                  <span className="mt-2 flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                      <Image
                        src={withBasePath("/assets/images/partners/ethereum.svg")}
                        alt="Ethereum Logo"
                        width={12}
                        height={12}
                      />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">Ethereum DA</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                }
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-3",
                }}
              />
              {/* Core Components */}
              <KeyValuePair
                label={"Core Components"}
                value={
                  <div className="mt-1.5 flex flex-col gap-2.5">
                    <span className="flex flex-row items-center gap-1.5">
                      <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1 font-medium">
                        <IconChevronSwapLeftRight />
                      </span>
                      <div className="text-sm font-medium text-[#09122D]">Bridge</div>
                      <span className="grow" />
                      <IconZ4Tick className="size-5" />
                    </span>
                    <span className="flex flex-row items-center gap-1.5">
                      <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                        <IconEndpoints1 className="size-5 text-black" />
                      </span>
                      <div className="text-sm font-medium text-[#09122D]">RPC</div>
                      <span className="grow" />
                      <IconZ4Tick className="size-5" />
                    </span>
                    <span className="flex flex-row items-center gap-1.5">
                      <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white font-medium">
                        <Image
                          src={withBasePath(getPartnerIconPath("tracehawk"))}
                          alt="Tracehawk Logo"
                          width={12}
                          height={12}
                        />
                      </span>
                      <div className="text-sm font-medium text-[#09122D]">Tracehawk Block Explorer</div>
                      <span className="grow" />
                      <IconZ4Tick className="size-5" />
                    </span>
                  </div>
                }
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-3",
                }}
              />
              {/* Monitoring & SLA */}
              <KeyValuePair
                label={"Monitoring & SLA"}
                value={
                  <div className="mt-1.5 flex flex-col gap-2.5">
                    <span className="flex flex-row items-center gap-1.5">
                      <IconZ4Monitor className="ml-0.5 mt-px size-4" />
                      <div className="text-sm font-medium text-[#09122D]">Monitoring Dashboard</div>
                      <span className="grow" />
                      <IconZ4Tick className="size-5" />
                    </span>
                    <span className="flex flex-row items-center gap-1.5">
                      <IconZ4Docs className="ml-0.5 mt-px size-4" />
                      <div className="text-sm font-medium text-[#09122D]">Standard SLA 99.0%</div>
                      <span className="grow" />
                      <IconZ4Tick className="size-5" />
                    </span>
                    <span className="flex flex-row items-center gap-1.5">
                      <IconLaunch height={16} width={16} className=" text-brand-archive" />
                      <div className="text-sm font-medium text-[#09122D]">Uptime Guarantee</div>
                      <span className="grow" />
                      <IconZ4Tick className="size-5" />
                    </span>
                  </div>
                }
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-3",
                }}
              />
              <KeyValuePair
                label="Pricing"
                value={
                  <div className="mt-1.5 flex flex-col gap-2.5">
                    <span className="flex flex-row gap-1.5">
                      <div className="text-sm font-medium text-[#09122D]">Monthly Recurring Cost</div>
                      <span className="grow"></span>
                      <div className="text-sm font-medium text-[#09122D]">$199/month</div>
                    </span>
                  </div>
                }
                classNames={{ label: "text-xs font-bold text-[#09122D]" }}
                enableBorder={false}
              />
            </>
          )}
          <div className="flex grow items-center justify-center" />
          {testnetService ? (
            <div className="flex w-full gap-3">
              {testnetDraft ? (
                <Z4Button
                  className="h-12 w-full"
                  colorScheme="testnet"
                  variant="solid"
                  onClick={handleCompletePayment}
                  isLoading={isRetryingTestnet}
                  isDisabled={isRetryingTestnet}
                >
                  Complete Payment
                </Z4Button>
              ) : testnetReady ? (
                <Link className="w-full" href={`/polygon-cdk/network/${testnetService.service_id}`}>
                  {viewButton}
                </Link>
              ) : (
                <Tooltip text="Available once the network reaches Ready state" placement="top-start">
                  <div className="w-full">{viewButton}</div>
                </Tooltip>
              )}
              <Link className="w-full" href={polygonDocsUrl} target="_blank" rel="noreferrer">
                <Z4Button
                  className="h-12 w-full"
                  colorScheme="testnet"
                  variant="outline"
                  onClick={() => setIsNavigatingInfo(true)}
                  isLoading={isNavigatingInfo}
                >
                  Info
                </Z4Button>
              </Link>
            </div>
          ) : (
            <Link className="w-full" href={`/polygon-cdk/deploy?env=testnet`}>
              <Z4Button
                className="h-12 w-full"
                colorScheme="testnet"
                variant="solid"
                onClick={() => setIsNavigatingDeploy(true)}
                isLoading={isNavigatingDeploy}
                iconLeft={<IconArrow1RightCircle className="size-6" />}
              >
                Deploy Testnet
              </Z4Button>
            </Link>
          )}
        </Z4DashboardCard>
      </div>
    );
  };

  const MainnetCard = () => {
    const [isNavigatingView, setIsNavigatingView] = useState(false);
    const mainnetStatus = (mainnetService?.status ?? "").toString().toLowerCase();
    const mainnetReady = mainnetStatus === "ready" || mainnetStatus === "active";
    const mainnetDraft = mainnetStatus === "draft";
    const displayMainnetStatus = mainnetStatus === "active" ? "ready" : mainnetService?.status;
    const useLightTheme = Boolean(mainnetService);
    const cardType = useLightTheme ? ("testnet" as const) : ("mainnet" as const);
    const buttonScheme = useLightTheme ? ("testnet" as const) : ("mainnet" as const);

    const handleCompletePayment = async () => {
      if (!mainnetService?.service_id) {
        toast("", { status: "error", message: "Unable to initiate payment. Please contact support." });
        return;
      }
      try {
        setIsRetryingMainnet(true);
        const payload = buildRollupDeployPayload(mainnetService?.inputs);
        if (!payload) {
          toast("", { status: "error", message: "Unable to initiate payment. Please contact support." });
          return;
        }
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
          router.push(withBasePath(`/polygon-cdk/network/${serviceId}`));
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
        setIsRetryingMainnet(false);
      }
    };

    const handleViewClick = () => {
      if (!mainnetReady) return;
      setIsNavigatingView(true);
    };

    const viewButton = (
      <Z4Button
        className="h-12 w-full"
        colorScheme={buttonScheme}
        variant="solid"
        onClick={handleViewClick}
        isLoading={isNavigatingView}
        isDisabled={!mainnetReady}
        aria-disabled={!mainnetReady}
      >
        View
      </Z4Button>
    );

    return (
      <div className="col-span-12 flex size-full flex-col lg:col-span-4">
        <Z4DashboardCard cardType={cardType} className="flex size-full h-max grow flex-col">
          <div className={tx("flex flex-col items-start gap-3 text-sm", { "text-white": !useLightTheme })}>
            <Heading
              className={tx("text-lg font-normal", {
                "text-white": !useLightTheme,
                "text-brand-testnet": useLightTheme,
              })}
              as="h5"
              style={{ letterSpacing: ".4em" }}
            >
              MAINNET
            </Heading>
            Layer 2 or Layer3 ZK Validium Mainnet using Polygon CDK Stack.
          </div>
          {mainnetService ? (
            <>
              <KeyValuePair
                label={"Name"}
                value={<span className="mt-1 text-sm font-medium text-[#09122D]">{mainnetService.name}</span>}
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-2",
                }}
              />
              <KeyValuePair
                label={"Network Type"}
                value={<span className="mt-1 text-sm font-medium text-[#09122D]">{"Mainnet"}</span>}
                classNames={{
                  label: "text-xs font-normal text-[#09122D]",
                  container: "border-b border-[#DEDEDE] pb-2",
                }}
              />
              <KeyValuePair
                label={"Status"}
                value={
                  <span className="mt-2 text-sm font-medium text-[#09122D]">
                    {mainnetDraft ? (
                      "PAYMENT PENDING"
                    ) : (
                      <Z4NetworkNodeStatus status={displayMainnetStatus as never} type="icon" />
                    )}
                  </span>
                }
                classNames={{ label: "text-xs font-normal text-[#09122D]" }}
                enableBorder={false}
              />
              <div className="flex grow items-center justify-center" />
              <div className="flex w-full gap-3">
                {mainnetDraft ? (
                  <Z4Button
                    className="h-12 w-full bg-white"
                    colorScheme="mainnet"
                    variant="ghost"
                    onClick={handleCompletePayment}
                    isLoading={isRetryingMainnet}
                    isDisabled={isRetryingMainnet}
                  >
                    Complete Payment
                  </Z4Button>
                ) : mainnetReady ? (
                  <Link className="w-full" href={`/polygon-cdk/network/${mainnetService.service_id}`}>
                    {viewButton}
                  </Link>
                ) : (
                  <Tooltip text="Available once the network reaches Ready state" placement="top-start">
                    <div className="w-full">{viewButton}</div>
                  </Tooltip>
                )}
                <Link className="w-full" href={polygonDocsUrl} target="_blank" rel="noreferrer">
                  <Z4Button className="h-12 w-full bg-white" colorScheme="mainnet" variant="ghost">
                    Info
                  </Z4Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex grow items-center justify-center">
                <Image
                  src={withBasePath("/assets/images/protocol/dashboard/mainnet-graphic.svg")}
                  alt="polygon-cdk-mainnet"
                  width={300}
                  height={300}
                />
              </div>
              <Link className="w-full" href={`https://www.zeeve.io/talk-to-an-expert/`} target="_blank">
                <Z4Button
                  className="h-12 w-full bg-white"
                  colorScheme="mainnet"
                  variant="ghost"
                  iconLeft={<IconPhoneVolume className="text-xl" />}
                >
                  Contact Us
                </Z4Button>
              </Link>
            </>
          )}
        </Z4DashboardCard>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-3 lg:gap-6">
      {demoService ? <DemoCard /> : null}
      <TestnetCard />
      <MainnetCard />
    </div>
  );
}
