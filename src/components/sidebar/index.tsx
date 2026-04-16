"use client";

import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarItem,
  SidebarItemDropdown,
  SidebarItemGroup,
  SidebarItemGroupTitle,
  SidebarItems,
  SidebarProps as UISidebarProps,
  tx,
} from "@zeeve-platform/ui";
import { IconActivitySquare } from "@zeeve-platform/icons/business/outline";
import { IconPhoneVolume } from "@zeeve-platform/icons/phone/outline";
import IconOPStack from "./icons/opstack";
import sidebarDashboardIcon from "./icons/dashboard.svg";
import sidebarRollupIcon from "./icons/rollup.svg";
import sidebarRpcNodesIcon from "./icons/rpc-nodes.svg";
import sidebarArchiveNodesIcon from "./icons/archive-nodes.svg";
import sidebarValidatorNodesIcon from "./icons/validator-nodes.svg";
import sidebarAccountReportIcon from "./icons/account-report.svg";
import sidebarReportIcon from "./icons/report.svg";
import sidebarRpcFleetIcon from "./icons/rpc-fleet.svg";
import sidebarValidatorFleetIcon from "./icons/validator-fleet.svg";
import polygonIcon from "./icons/polygon.svg";
import avalancheIcon from "./icons/avalanche.svg";
import parachainIcon from "./icons/parachain.svg";
import hyperchainIcon from "./icons/hyperchain.svg";
import hostedLogo from "./icons/hosted_subgraph.svg";
import graphLogo from "./icons/graph_node.svg";
import IconArbitrumOrbit from "./icons/arbitrum-orbit";
import collapsedLogoDark from "@/../public/assets/images/sidebar/zeeve-logo-dark.png";
import logoTextDark from "@/../public/assets/images/sidebar/zeeve-text-dark.png";
import collapsedLogoLight from "@/../public/assets/images/sidebar/zeeve-logo-collapsed.svg";
import logoTextLight from "@/../public/assets/images/sidebar/zeeve-logo-text.svg";
import sidebarCollapseIcon from "@/../public/assets/images/sidebar/sidebar-collapse.svg";
import sidebarExpandIcon from "@/../public/assets/images/sidebar/sidebar_expand.png";
import downArrow from "@/../public/assets/images/sidebar/down-arrow.png";
import upArrow from "@/../public/assets/images/sidebar/up-arrow.png";
import { getPreferredBasePath, normalizePathname } from "@/utils/path";
import ROUTES from "@/routes";
import { useConfigStore } from "@/store/config";
import { EXTERNAL_ROUTES, OPTIMISTICLABS_EMAILS } from "@/constants/protocol";
import { useUserStore } from "@/store/user";

interface SidebarItemConfig {
  title: string;
  icon?: React.ReactElement | ((isActive: boolean) => React.ReactElement);
  href?: string;
  external?: boolean;
  children?: SidebarItemConfig[];
  ariaLabel?: string;
  className?: string;
}

interface SidebarGroupConfig {
  id?: string;
  title?: string;
  groupIcon?: React.ReactElement;
  items: SidebarItemConfig[];
}

interface SidebarNavigationProps extends UISidebarProps {
  /**
   * Disable the auto-collapse behavior that hides labels when the sidebar width is small.
   * Useful for mobile side-drawers where we always want to show labels.
   */
  disableAutoCollapse?: boolean;
  /**
   * When provided, overrides the default hover-based width animation of the underlying Sidebar.
   * Used internally to keep the sidebar expanded on touch devices.
   */
  sidebarMotionProps?: Partial<UISidebarProps>;
  /**
   * Called after a navigation item is selected.
   * Useful for closing a mobile drawer after route changes.
   */
  onNavigate?: () => void;
}

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 240;
const DARK_ICON_CLASS = "dark:invert";
const DROPDOWN_GROUP_IDS = ["reports", "appchains-rollups", "node-infrastructure", "support", "resources"] as const;

const removeTrailingSlash = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (value === "/") {
    return "/";
  }
  return value.replace(/\/$/, "");
};

const buildPlatformHref = (preferredBasePath: string, path: string): string => {
  const base = preferredBasePath === "/" ? "" : (removeTrailingSlash(preferredBasePath) ?? "");
  if (!path || path === "/") {
    return base || "/";
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

const buildSidebarConfig = (
  preferredBasePath: string,
  options: {
    hostUrl?: string;
    subgraphUrl?: string;
    isOptimisticUser?: boolean;
  },
  visuals: {
    iconSize: number;
    imageClassName: string;
    showLabels: boolean;
  },
): SidebarGroupConfig[] => {
  const { iconSize, imageClassName, showLabels } = visuals;

  const makeTitle = (label: string) => (showLabels ? label : "");
  const makeGroupTitle = (label: string) => (showLabels ? label : undefined);
  const renderSidebarMaskIcon = (src: StaticImageData, isActive: boolean) => (
    <div
      aria-hidden
      className={tx("inline-block shrink-0 bg-current", isActive ? "text-[#006CFF]" : "text-[#0E2B6E]")}
      style={{
        width: iconSize,
        height: iconSize,
        WebkitMaskImage: `url(${src.src})`,
        maskImage: `url(${src.src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );

  const dashboardIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarDashboardIcon, isActive);
  const rpcNodesIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarRpcNodesIcon, isActive);
  const archiveNodesIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarArchiveNodesIcon, isActive);
  const validatorNodesIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarValidatorNodesIcon, isActive);
  const accountReportIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarAccountReportIcon, isActive);
  const rpcFleetIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarRpcFleetIcon, isActive);
  const validatorFleetIcon = (isActive: boolean) => renderSidebarMaskIcon(sidebarValidatorFleetIcon, isActive);
  const groupRollupIcon = () => renderSidebarMaskIcon(sidebarRollupIcon, false);
  const groupReportsIcon = () => renderSidebarMaskIcon(sidebarReportIcon, false);
  const createItem = (label: string, config: Omit<SidebarItemConfig, "title">): SidebarItemConfig => ({
    title: makeTitle(label),
    ariaLabel: label,
    ...config,
  });

  const platformLink = (path: string) => buildPlatformHref(preferredBasePath, path);

  const supportTicketsHref = platformLink(ROUTES.PLATFORM.PAGE.SUPPORT_TICKETS);

  const groups: Array<SidebarGroupConfig | null> = [
    {
      id: "main-menu",
      items: [
        createItem("Dashboard", {
          icon: dashboardIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.DASHBOARD),
        }),
      ],
    },
    {
      id: "appchains-rollups",
      title: makeGroupTitle("Appchains & Rollups"),
      groupIcon: groupRollupIcon(),
      items: [
        createItem("Arbitrum Orbit", {
          icon: <IconArbitrumOrbit width={iconSize} height={iconSize} />,
          href: platformLink(ROUTES.PLATFORM.PAGE.ARBITRUM_ORBIT),
        }),
        createItem("OP Stack", {
          icon: <IconOPStack width={iconSize} height={iconSize} />,
          href: platformLink("/opstack"),
        }),
        createItem("zkSync Hyperchains", {
          icon: (
            <Image
              src={hyperchainIcon}
              alt="zkSync Hyperchains"
              width={iconSize}
              height={iconSize}
              className={imageClassName}
            />
          ),
          href: platformLink("/zksync"),
        }),
        createItem("Polygon CDK", {
          icon: (
            <Image src={polygonIcon} alt="Polygon CDK" width={iconSize} height={iconSize} className={imageClassName} />
          ),
          href: "/polygon-cdk",
        }),
        createItem("Avalanche L1s", {
          icon: (
            <Image
              src={avalancheIcon}
              alt="Avalanche L1s"
              width={iconSize}
              height={iconSize}
              className={imageClassName}
            />
          ),
          href: EXTERNAL_ROUTES.COGITUS,
          external: true,
        }),
        createItem("Parachains", {
          icon: (
            <Image src={parachainIcon} alt="Parachains" width={iconSize} height={iconSize} className={imageClassName} />
          ),
          href: EXTERNAL_ROUTES.PERFUSE,
          external: true,
        }),
        createItem("Besu", {
          icon: (
            <Image
              src={hostedLogo}
              alt="Besu"
              width={iconSize}
              height={iconSize}
              className={tx(imageClassName, DARK_ICON_CLASS)}
            />
          ),
          href: platformLink("besu"),
        }),
        createItem("Hyperledger Fabric", {
          icon: (
            <Image
              src={graphLogo}
              alt="Hyperledger Fabric"
              width={iconSize}
              height={iconSize}
              className={tx(imageClassName, DARK_ICON_CLASS)}
            />
          ),
          href: platformLink("fabric"),
        }),
      ],
    },
    {
      id: "node-infrastructure",
      title: makeGroupTitle("Node Infrastructure"),
      groupIcon: groupRollupIcon(),
      items: [
        createItem("RPC Nodes", {
          icon: rpcNodesIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES),
        }),
        createItem("Archive Nodes", {
          icon: archiveNodesIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES),
        }),
        createItem("Validator Nodes", {
          icon: validatorNodesIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES),
        }),
        // Dynamically add Nodes Metrics for Optimistic Labs client
        ...(options.isOptimisticUser
          ? [
              createItem("Nodes Metrics", {
                icon: <IconActivitySquare fontSize={`${iconSize}px`} />,
                href: platformLink(ROUTES.PLATFORM.PAGE.ALL_NODES_METRICS_DASHBOARD),
              }),
            ]
          : []),
      ],
    },
    {
      id: "reports",
      title: makeGroupTitle("Reports"),
      groupIcon: groupReportsIcon(),
      items: [
        createItem("Infrastructure Health", {
          icon: accountReportIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.REPORTS_INFRA_HEALTH),
        }),
        createItem("RPC Fleet Report", {
          icon: rpcFleetIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.REPORTS_RPC_FLEET),
        }),
        createItem("Validator Fleet Report", {
          icon: validatorFleetIcon,
          href: platformLink(ROUTES.PLATFORM.PAGE.REPORTS_VALIDATOR_FLEET),
        }),
      ],
    },
    // {
    //   title: makeGroupTitle("Traceye"),
    //   items: [
    //     createItem("Hosted Subgraphs", {
    //       icon: <IconSubgraph fontSize={`${iconSize}px`} />,
    //       href: joinUrl(subgraphBase, "dashboard"),
    //       external: true,
    //     }),
    //     createItem("Graph Nodes", {
    //       icon: <IconSubgraph fontSize={`${iconSize}px`} />,
    //       href: joinUrl(subgraphBase, "graph-node"),
    //       external: true,
    //     }),
    //     createItem("Subquery Nodes", {
    //       icon: <IconSubgraph fontSize={`${iconSize}px`} />,
    //       href: joinUrl(subgraphBase, "subquery"),
    //       external: true,
    //     }),
    //     createItem("Hosted Subquery", {
    //       icon: <IconSubgraph fontSize={`${iconSize}px`} />,
    //       href: joinUrl(subgraphBase, "shared-subquery"),
    //       external: true,
    //     }),
    //   ],
    // },
    // {
    //   title: makeGroupTitle("Permissive Chains"),
    //   items: [
    //     createItem("Besu", {
    //       icon: <IconBesu width={iconSize} height={iconSize} />,
    //       href: marketingLink("besu"),
    //       external: true,
    //     }),
    //     createItem("Hyperledger Fabric", {
    //       icon: <IconFabric width={iconSize} height={iconSize} />,
    //       href: marketingLink("fabric"),
    //       external: true,
    //     }),
    //     createItem("R3 Corda", {
    //       icon: <IconCorda width={iconSize} height={iconSize} />,
    //       href: marketingLink("corda-enterprise"),
    //       external: true,
    //     }),
    //   ],
    // },
    {
      id: "support",
      title: makeGroupTitle("Help"),
      groupIcon: <IconPhoneVolume fontSize={`${iconSize}px`} />,
      items: [
        createItem("Support Center", {
          icon: <IconPhoneVolume fontSize={`${iconSize}px`} />,
          href: supportTicketsHref,
        }),
      ],
    },
  ];

  return groups.filter(Boolean) as SidebarGroupConfig[];
};

const SidebarNavigation = (props: SidebarNavigationProps) => {
  const { className, disableAutoCollapse = false, sidebarMotionProps, onNavigate, ...rest } = props;
  const rawPathname = usePathname();
  const normalizedPath = useMemo(() => normalizePathname(rawPathname), [rawPathname]);
  const preferredBasePath = useMemo(() => getPreferredBasePath(), []);
  const config = useConfigStore((state) => state.config);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    return DROPDOWN_GROUP_IDS.reduce<Record<string, boolean>>((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
  });
  const user = useUserStore((state) => state.user);
  const [isOptimisticUser, setIsOptimisticUser] = useState(OPTIMISTICLABS_EMAILS.includes(user?.usercred || ""));

  const hostUrl = config?.url?.host;
  const subgraphUrl = config?.url?.external?.subgraph?.frontend;

  const isCollapsedView = disableAutoCollapse ? false : isManualOverride ? !isManualExpanded : isCollapsed;
  const showLabels = disableAutoCollapse || !isCollapsedView;
  const iconSize = 20;
  const imageClassName = "object-contain size-5";
  const itemTextSizeClass = "[&>span]:!text-[13px] [&>span]:!leading-4";
  const itemPaddingClass = "!px-3 !py-2.5";
  const forcedLabelClass = disableAutoCollapse
    ? "[&>span]:!flex [&>span]:!flex-col [&>span]:!gap-y-1 [&>span]:!whitespace-nowrap [&>span]:!leading-4 [&>div.ml-auto]:!block"
    : undefined;
  const labelVisibilityClass = showLabels
    ? "[&>span]:!flex [&>span]:!flex-col [&>span]:!gap-y-1 [&>span]:!whitespace-nowrap [&>span]:!leading-4 [&>div.ml-auto]:!block"
    : "[&>span]:!hidden [&>div.ml-auto]:!hidden";
  const dropdownGroupIds = useMemo(() => new Set<string>(DROPDOWN_GROUP_IDS), []);
  const groupTitleBaseClass = "whitespace-nowrap !text-xs text-slate-500 text-left dark:text-slate-300";

  useEffect(() => {
    setIsOptimisticUser(OPTIMISTICLABS_EMAILS.includes(user?.usercred || ""));
  }, [user]);

  useEffect(() => {
    if (disableAutoCollapse) {
      setIsCollapsed(false);
      return;
    }

    if (typeof window === "undefined" || !("ResizeObserver" in window)) {
      return;
    }

    const element = sidebarRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? element.offsetWidth;
      setIsCollapsed(width < 160);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [disableAutoCollapse]);

  const sections = useMemo(
    () =>
      buildSidebarConfig(
        preferredBasePath,
        {
          hostUrl,
          subgraphUrl,
          isOptimisticUser,
        },
        {
          iconSize,
          imageClassName,
          showLabels,
        },
      ),
    [preferredBasePath, hostUrl, subgraphUrl, iconSize, imageClassName, showLabels, isOptimisticUser],
  );

  const matchesRoute = useMemo(() => {
    const getNormalized = (target?: string) => (target ? normalizePathname(target) : undefined);
    return (target?: string) => {
      if (!target) {
        return false;
      }

      if (rawPathname === target || rawPathname.startsWith(`${target}/`)) {
        return true;
      }

      const normalizedTarget = getNormalized(target);
      if (!normalizedTarget) {
        return false;
      }

      return normalizedPath === normalizedTarget || normalizedPath.startsWith(`${normalizedTarget}/`);
    };
  }, [rawPathname, normalizedPath]);

  const headerClasses = tx(
    "border-white transition-[padding] duration-200 dark:border-white/10",
    isCollapsedView ? "px-2 py-3" : "px-3 py-6",
  );

  const headerLinkClasses = tx(
    "flex items-center overflow-hidden rounded-md px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/5",
    isCollapsedView ? "justify-center gap-0 px-3.5" : "gap-3",
  );

  const itemsClasses = tx("flex flex-1 flex-col overflow-y-auto pb-2", isCollapsedView ? "px-2" : "px-0");
  const toggleWrapperClasses = tx("px-2 pb-3", isCollapsedView ? "flex justify-center" : "flex justify-end");
  const toggleButtonClasses = tx(
    "inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
    "dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/30",
  );
  const toggleLabel = isCollapsedView ? "Expand sidebar" : "Collapse sidebar";
  const manualWidth = isCollapsedView ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const hoverWidth = manualWidth;
  const motionOverrides = sidebarMotionProps ?? {};
  const { initial, animate, whileHover, transition, ...restMotionProps } = motionOverrides;
  const handleToggle = () => {
    setIsManualOverride(true);
    setIsManualExpanded(isCollapsedView);
  };
  const logoIconSize = isCollapsedView ? 24 : 32;
  const logoIconClassName = isCollapsedView ? "size-6 shrink-0" : "size-8 shrink-0";
  const handleNavigate = useCallback(() => {
    onNavigate?.();

    if (typeof window === "undefined" || window.self === window.top) {
      return;
    }

    window.parent.postMessage({ type: "zeeve:sidebar:navigate" }, "*");
  }, [onNavigate]);

  return (
    <UISidebar
      ref={sidebarRef}
      className={tx(
        "group/sidebar flex h-full min-h-0 flex-col bg-white text-slate-900 dark:bg-[#0C0F2D] dark:text-white",
        "[html.theme-black_&]:bg-black",
        className,
      )}
      // Keep the sidebar fully expanded on touch devices by overriding the default hover width animation.
      {...(disableAutoCollapse
        ? {
            initial: { width: "100%" },
            animate: { width: "100%" },
            whileHover: { width: "100%" },
            transition: { duration: 0 },
            ...motionOverrides,
          }
        : {
            initial: initial ?? { width: EXPANDED_WIDTH },
            animate: animate ?? { width: manualWidth },
            whileHover: whileHover ?? { width: hoverWidth },
            transition: transition ?? { duration: 0.4 },
            ...restMotionProps,
          })}
      {...rest}
    >
      <SidebarHeader className={headerClasses}>
        <Link href={preferredBasePath} className={headerLinkClasses} onClick={handleNavigate}>
          <Image
            src={collapsedLogoDark}
            alt="Zeeve"
            width={logoIconSize}
            height={logoIconSize}
            className={tx(logoIconClassName, "dark:hidden")}
            priority
          />
          <Image
            src={collapsedLogoLight}
            alt="Zeeve"
            width={logoIconSize}
            height={logoIconSize}
            className={tx(logoIconClassName, "hidden dark:block")}
            priority
          />
          {isCollapsedView ? null : (
            <>
              <Image
                src={logoTextDark}
                alt="Zeeve Platform"
                width={88}
                height={20}
                className="h-5 w-auto dark:hidden"
                priority
              />
              <Image
                src={logoTextLight}
                alt="Zeeve Platform"
                width={88}
                height={20}
                className="hidden h-5 w-auto dark:block"
                priority
              />
            </>
          )}
        </Link>
      </SidebarHeader>
      <SidebarItems className={itemsClasses}>
        {disableAutoCollapse ? null : (
          <div className={toggleWrapperClasses}>
            <button
              type="button"
              onClick={handleToggle}
              className={toggleButtonClasses}
              aria-label={toggleLabel}
              aria-expanded={!isCollapsedView}
            >
              <Image
                src={isCollapsedView ? sidebarExpandIcon : sidebarCollapseIcon}
                alt=""
                width={24}
                height={24}
                className={tx("size-6", "dark:invert")}
              />
            </button>
          </div>
        )}
        {sections.map((group, index) => {
          const groupKey = group.id ?? group.title ?? `group-${index}`;
          const isDropdownGroup = group.id ? dropdownGroupIds?.has(group.id) : false;
          const isGroupOpen = !isDropdownGroup || !showLabels ? true : (expandedGroups[groupKey] ?? true);

          const shouldHighlightDropdown =
            isDropdownGroup && showLabels && isGroupOpen && (group.items.length > 1 || group.id === "support");

          const renderGroupTitle = () => {
            if (!group.title) {
              return null;
            }
            if (isDropdownGroup) {
              return (
                <button
                  type="button"
                  onClick={() => {
                    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !isGroupOpen }));
                  }}
                  className="flex w-full items-center justify-between px-3"
                  aria-expanded={isGroupOpen}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {group.groupIcon ? <div className="shrink-0">{group.groupIcon}</div> : null}
                    <SidebarItemGroupTitle
                      className={tx(
                        "flex-1",
                        groupTitleBaseClass,
                        "!px-0",
                        disableAutoCollapse ? "!block" : undefined,
                        showLabels ? "!block" : "!hidden",
                      )}
                    >
                      {group.title}
                    </SidebarItemGroupTitle>
                  </div>
                  <Image
                    src={isGroupOpen ? upArrow : downArrow}
                    alt=""
                    width={16}
                    height={16}
                    className={tx("size-4 -translate-y-0.5", "dark:invert")}
                  />
                </button>
              );
            }
            return (
              <div className="flex items-center gap-2 px-3">
                {group.groupIcon ? <div className="shrink-0">{group.groupIcon}</div> : null}
                <SidebarItemGroupTitle
                  className={tx(
                    groupTitleBaseClass,
                    "!px-0",
                    disableAutoCollapse ? "!block" : undefined,
                    showLabels ? "!block" : "!hidden",
                  )}
                >
                  {group.title}
                </SidebarItemGroupTitle>
              </div>
            );
          };

          const renderGroupItems = () => {
            if (!isGroupOpen) {
              return null;
            }

            const items = group.items.map((item, itemIndex) => {
              const { title, icon, href, children, external, ariaLabel, className: currentItemClass } = item;
              const baseClasses = [
                itemTextSizeClass,
                itemPaddingClass,
                labelVisibilityClass,
                currentItemClass,
                forcedLabelClass,
                "!focus:bg-transparent",
                "!hover:bg-transparent",
                "!focus-visible:bg-transparent",
                showLabels ? undefined : "justify-center px-0",
              ];

              if (children && children.length > 0) {
                const isActive = children.some((child) => matchesRoute(child.href));
                const resolvedIcon = typeof icon === "function" ? icon(isActive) : icon;
                const dropdownClassName = tx(
                  ...baseClasses,
                  isActive
                    ? "!bg-transparent !text-[#006CFF] !hover:text-[#006CFF] dark:!text-[#006CFF]"
                    : "text-[#53607F] hover:text-[#006CFF] dark:text-slate-200 dark:hover:text-[#006CFF]",
                );
                return (
                  <SidebarItemDropdown
                    key={`${title}-dropdown-${itemIndex}`}
                    iconLeft={resolvedIcon}
                    title={title}
                    isActive={false}
                    className={dropdownClassName}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={ariaLabel}
                  >
                    {children
                      .filter((child) => child.href)
                      .map((child, childIndex) => {
                        const childIsActive = matchesRoute(child.href);
                        const childResolvedIcon =
                          typeof child.icon === "function" ? child.icon(childIsActive) : child.icon;
                        const childClassName = tx(
                          itemTextSizeClass,
                          itemPaddingClass,
                          labelVisibilityClass,
                          child.className,
                          forcedLabelClass,
                          showLabels ? undefined : "justify-center px-0",
                          childIsActive
                            ? "!bg-transparent !text-[#006CFF] !hover:text-[#006CFF] dark:!text-[#006CFF]"
                            : "text-slate-700 hover:text-[#006CFF] dark:text-slate-200 dark:hover:text-[#006CFF]",
                        );
                        return (
                          <SidebarItem
                            key={`${child.title}-${childIndex}`}
                            as={child.external ? "a" : Link}
                            href={child.href}
                            onClick={handleNavigate}
                            iconLeft={childResolvedIcon}
                            title={child.title}
                            isActive={false}
                            target={child.external ? "_blank" : undefined}
                            rel={child.external ? "noopener noreferrer" : undefined}
                            aria-label={child.ariaLabel}
                            aria-current={childIsActive ? "page" : undefined}
                            className={childClassName}
                          />
                        );
                      })}
                  </SidebarItemDropdown>
                );
              }

              if (!href) {
                return null;
              }
              const isActive = matchesRoute(href);
              const resolvedIcon = typeof icon === "function" ? icon(isActive) : icon;
              const alignedClassName = tx(
                ...baseClasses,
                isActive
                  ? "!bg-transparent !text-[#006CFF] !hover:text-[#006CFF] dark:!text-[#006CFF]"
                  : "text-[#53607F] hover:text-[#006CFF] dark:text-slate-200 dark:hover:text-[#006CFF]",
              );

              return (
                <SidebarItem
                  key={`${title}-${itemIndex}`}
                  as={external ? "a" : Link}
                  href={href}
                  onClick={handleNavigate}
                  iconLeft={resolvedIcon}
                  title={title}
                  isActive={false}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={ariaLabel}
                  aria-current={isActive ? "page" : undefined}
                  className={alignedClassName}
                />
              );
            });

            return items;
          };

          const dropdownBackgroundClass = shouldHighlightDropdown ? "bg-[#EAF3FF] py-2 dark:bg-[#EAF3FF]" : undefined;
          const dashboardDividerClass = group.id === "main-menu" ? "border-b border-[#E2F1FF] pb-2 mb-0.5" : undefined;
          const stickyToBottomClass = group.id === "resources" ? "mt-auto" : undefined;

          return (
            <Fragment key={`${groupKey}-${index}`}>
              <SidebarItemGroup
                className={tx("py-1", dropdownBackgroundClass, dashboardDividerClass, stickyToBottomClass)}
              >
                {renderGroupTitle()}
                {renderGroupItems()}
              </SidebarItemGroup>
            </Fragment>
          );
        })}
      </SidebarItems>
    </UISidebar>
  );
};

const ZeeveSidebar = (props: SidebarNavigationProps) => {
  return <SidebarNavigation {...props} />;
};

export type { SidebarItemConfig, SidebarNavigationProps as SidebarProps };
export default ZeeveSidebar;
