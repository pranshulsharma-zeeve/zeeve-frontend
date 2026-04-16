"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useZkSyncDashboard } from "../tabs/dashboard-context";
import ChainInfoCard from "./chain-data/chain-data-card";
import TransactionInfoCard from "./transaction-data/transaction-data-card";
import ServiceCard from "./services/services";
import StatusRollupsCard from "./status-rollups/status-rollups-card";
import SecurityMonitoringCard from "./security-monitoring/security";
import {
  getZkSyncDemoHost,
  getZkSyncDemoVizionToken,
  getZkSyncDemoVizionUrl,
  isZkSyncDemoNetwork,
} from "./demo-vizion";
import useVisionService from "@/services/vision/use-vision-service";
import { getCookie } from "@/utils/cookies";
import HTTP_STATUS from "@/constants/http";
import { useZksyncDashboardStore } from "@/store/vizion/zksync-dashboard";
import { useServiceStore } from "@/store/vizion/service";
import { useSslRpcStore } from "@/store/vizion/sslRpc";
import { useMonitorRpcStore } from "@/store/vizion/monitorRpc";
import { useVisionUserStore } from "@/store/vizionUser";
import ROUTES from "@/routes";

const MonitoringDashboard = () => {
  const { id } = useParams();
  const networkId = id as string;
  const refreshInterval = 20_000;
  const [isLoading, setIsLoading] = useState(true);
  const user = useVisionUserStore((state) => state.visionUser);
  const { overview } = useZkSyncDashboard();
  const isDemoNetwork = isZkSyncDemoNetwork(networkId);
  const setDashboard = useZksyncDashboardStore((state) => state.setZksyncDashboard);
  const setService = useServiceStore((state) => state.setService);
  const setSslRpcService = useSslRpcStore((state) => state.setSslRpcService);
  const setMonitor = useMonitorRpcStore((state) => state.setMonitor);
  const demoToken = getZkSyncDemoVizionToken();
  const token = isDemoNetwork ? demoToken : (user?.token ?? getCookie("token"));
  // const token = "d7bca92c2353e3e9e5dbae88d44b1b49";
  const { request: dashboardRequest, url: dashboardUrlConfig } = useVisionService().mainPage.zksyncDashboard();
  const { request: serviceRequest, url: serviceUrlConfig } = useVisionService().mainPage.service();
  const { request: rpcsslRequest, url: rpcsslUrlConfig } = useVisionService().mainPage.rpcSsl();
  const { request: monitorRequest, url: monitorUrlConfig } = useVisionService().rpc.monitorRpc();
  const dashboardUrl = isDemoNetwork ? getZkSyncDemoVizionUrl(ROUTES.VISION.API.ZKSYNC_DASHBOARD) : dashboardUrlConfig;
  const serviceUrl = isDemoNetwork ? getZkSyncDemoVizionUrl(ROUTES.VISION.API.SERVICE) : serviceUrlConfig;
  const rpcsslUrl = isDemoNetwork ? getZkSyncDemoVizionUrl(ROUTES.VISION.API.SERVICE_RPC_SSL) : rpcsslUrlConfig;
  const monitorUrl = isDemoNetwork ? getZkSyncDemoVizionUrl(ROUTES.VISION.API.SECURITY_MONITOR_RPC) : monitorUrlConfig;
  const securityMonitoringCreatedAt = overview?.created_at ?? "";
  const selectedHost = useMemo(() => {
    if (isDemoNetwork) {
      return getZkSyncDemoHost();
    }
    if (!user?.hostData || user.hostData.length === 0) {
      return null;
    }
    return user.hostData.find((host) => host?.networkId === networkId) ?? user.hostData[0];
  }, [isDemoNetwork, user?.hostData, networkId]);

  const getPrimaryHost = useCallback((host: typeof selectedHost) => {
    if (!host) return "";
    if (host["protocol-type"] && host["protocol-type"].toLowerCase() === "parachain") {
      return host.primaryHost;
    }
    if (host.hasLB && host.hasLB !== "no") {
      const [first] = host.hasLB.split(/[\s,]+/);
      return first || host.primaryHost;
    }
    return host.primaryHost;
  }, []);

  const requestHeaders = useMemo(() => {
    if (!token) return undefined;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const fetchMonitoringData = useCallback(async () => {
    if (!selectedHost || !requestHeaders) {
      return;
    }
    // setRefreshed(true);
    const hostIds = selectedHost.hostIds;
    const primaryHost = getPrimaryHost(selectedHost);
    const monitorPrimaryHost = selectedHost.RPC && selectedHost.RPC.length > 0 ? selectedHost.RPC[0] : primaryHost;

    try {
      const [dashboardResult, serviceResult, rpcSslResult, monitorResult] = await Promise.allSettled([
        dashboardRequest(
          dashboardUrl,
          {
            hostIds,
            primaryHost,
            rpc: selectedHost.RPC,
            bridge: selectedHost.Bridge,
            explorer: selectedHost.Explorer,
            prover: selectedHost.Prover,
            backup: selectedHost.Backup,
            core: selectedHost.Core,
          },
          requestHeaders,
        ),
        serviceRequest(serviceUrl, { hostIds, primaryHost }, requestHeaders),
        rpcsslRequest(rpcsslUrl, { hostIds, primaryHost }, requestHeaders),
        monitorRequest(monitorUrl, { hostIds, primaryHost: monitorPrimaryHost }, requestHeaders),
      ]);

      if (dashboardResult.status === "fulfilled") {
        if (dashboardResult.value.status === HTTP_STATUS.OK) {
          setDashboard(dashboardResult.value.data);
        }
      } else {
        console.error("Monitoring dashboard fetch error", dashboardResult.reason);
      }

      if (serviceResult.status === "fulfilled") {
        if (serviceResult.value.status === HTTP_STATUS.OK) {
          setService(serviceResult.value.data);
        }
      } else {
        console.error("Monitoring service fetch error", serviceResult.reason);
      }

      if (rpcSslResult.status === "fulfilled") {
        if (rpcSslResult.value.status === HTTP_STATUS.OK) {
          setSslRpcService(rpcSslResult.value.data);
        }
      } else {
        console.error("Monitoring RPC SSL fetch error", rpcSslResult.reason);
      }

      if (monitorResult.status === "fulfilled") {
        if (monitorResult.value.status === HTTP_STATUS.OK) {
          setMonitor(monitorResult.value.data);
        }
      } else {
        console.error("Monitoring security fetch error", monitorResult.reason);
      }
    } catch (error) {
      console.error("Failed to fetch monitoring data", error);
    } finally {
      setIsLoading(false);
      // setRefreshed(false);
      // setRefreshedManual(false);
    }
  }, [
    dashboardRequest,
    dashboardUrl,
    getPrimaryHost,
    monitorRequest,
    monitorUrl,
    requestHeaders,
    rpcsslRequest,
    rpcsslUrl,
    selectedHost,
    serviceRequest,
    serviceUrl,
    setDashboard,
    setMonitor,
    setService,
    setSslRpcService,
  ]);

  useEffect(() => {
    if (!selectedHost || !requestHeaders) {
      return;
    }
    void fetchMonitoringData();
    const interval = setInterval(() => {
      void fetchMonitoringData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchMonitoringData, requestHeaders, selectedHost]);

  console.log("selectedHost", selectedHost);
  if (!selectedHost || (isDemoNetwork ? !demoToken : !token)) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
        Monitoring data is unavailable for this network.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
          <p className="text-sm text-slate-500">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <StatusRollupsCard className="col-span-12" />
      <ChainInfoCard className="col-span-12 lg:col-span-6" />
      <TransactionInfoCard className="col-span-12 lg:col-span-6" />
      {/* <FinancialsTransactionsCard className="col-span-12" /> */}
      <SecurityMonitoringCard createdAt={securityMonitoringCreatedAt} className="col-span-12" />
      <ServiceCard className="col-span-12" />
      {/* <ServiceSslRpcCard className="col-span-12" /> */}
      {/* <AlertsCard className="col-span-12" /> */}
    </div>
  );
};

export default MonitoringDashboard;
