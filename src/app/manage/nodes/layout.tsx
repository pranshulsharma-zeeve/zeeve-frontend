"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { Z4Navigation } from "@zeeve-platform/ui";
import { withBasePath } from "@/utils/helpers";
import ROUTES from "@/routes";
import {
  CheckoutSessionBlockingScreen,
  useCheckoutSessionVerification,
} from "@/components/subscription/checkout-session-verifier";
const TABS = [
  {
    label: "Full Nodes",
    path: "/manage/nodes/full/protocols",
    activeBgClass: "bg-brand-full",
    textColorClass: "text-brand-full",
    icon: {
      default: "/assets/images/protocols/full-icon.svg",
      selected: "/assets/images/protocols/full-icon-selected.svg",
    },
    manageHref: ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES,
  },
  {
    label: "Validator Nodes",
    path: "/manage/nodes/validator/protocols",
    activeBgClass: "bg-brand-validator",
    textColorClass: "text-brand-validator",
    icon: {
      default: "/assets/images/protocols/validator-icon.svg",
      selected: "/assets/images/protocols/validator-icon-selected.svg",
    },
    manageHref: ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES,
  },
  {
    label: "Archive Nodes",
    path: "/manage/nodes/archive/protocols",
    activeBgClass: "bg-brand-archive",
    textColorClass: "text-brand-archive-blue",
    icon: {
      default: "/assets/images/protocols/archive-icon.svg",
      selected: "/assets/images/protocols/archive-icon-selected.svg",
    },
    manageHref: ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES,
  },
];

export default function NodesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isBlocking, verificationStatus } = useCheckoutSessionVerification();

  const fromSmartNode = searchParams.get("from") === "smart-node";
  const currentTab = TABS.find((tab) => pathname.endsWith(tab.path));
  const shouldShowTabs = TABS.some((tab) => pathname.endsWith(tab.path));
  const paramFocusedProtocol = searchParams.get("protocol")?.toLowerCase();

  if (isBlocking) {
    return <CheckoutSessionBlockingScreen status={verificationStatus} />;
  }

  return (
    <div className="flex min-h-full flex-col">
      {shouldShowTabs && (
        <>
          <Z4Navigation
            heading="Select your Smart Node"
            className="mb-4 font-semibold"
            breadcrumb={{
              items: fromSmartNode
                ? [
                    {
                      href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
                      label: "Dashboard",
                      as: "a",
                    },
                    {
                      href: withBasePath(
                        paramFocusedProtocol
                          ? `${currentTab?.path}?from=smart-node&protocol=${paramFocusedProtocol}`
                          : `${currentTab?.path}?from=smart-node`,
                      ),
                      label: "Select Plan",
                      isActive: true,
                    },
                  ]
                : [
                    {
                      href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
                      label: "Dashboard",
                      as: "a",
                    },
                    {
                      href: withBasePath(currentTab?.manageHref ?? ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES),
                      label: `Manage ${currentTab?.label === "Full Nodes" ? "RPC Nodes" : (currentTab?.label ?? "Nodes")}`,
                      as: "a",
                    },
                    {
                      href: withBasePath(
                        `${currentTab?.path}${paramFocusedProtocol ? `?protocol=${paramFocusedProtocol}` : ""}`,
                      ),
                      label: "Select Plan",
                      isActive: true,
                    },
                  ],
            }}
          />

          {/* Tab Switcher */}
          <div className="mb-4 grid w-full grid-cols-1 rounded-xl border bg-white sm:grid-cols-3">
            {TABS.map((tab) => {
              const isActive = pathname.endsWith(tab.path);

              return (
                <button
                  key={tab.path}
                  onClick={() => {
                    const queryParams = new URLSearchParams();
                    if (fromSmartNode) queryParams.set("from", "smart-node");
                    if (paramFocusedProtocol) queryParams.set("protocol", paramFocusedProtocol);
                    router.push(`${tab.path}?${queryParams.toString()}`);
                  }}
                  className={clsx(
                    "flex w-full items-center justify-center gap-2 py-5 text-center text-[18px] font-medium transition-colors",
                    "rounded-[10px]",
                    isActive ? `text-white ${tab.activeBgClass}` : `bg-[#FAFAFA] ${tab.textColorClass}`,
                  )}
                >
                  <Image
                    src={withBasePath(isActive ? tab.icon.selected : tab.icon.default)}
                    alt={`${tab.label} icon`}
                    width={20}
                    height={20}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
