"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Button, Link, Tooltip } from "@zeeve-platform/ui";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import { usePolygonCdkDashboard } from "../tabs/dashboard-context";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";

const normalizeBridgeUrl = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};

const BridgeAction = () => {
  const params = useParams();
  const networkId = params.id as string;
  const {
    request: { data, isLoading },
  } = usePolygonValidiumService().supernet.supernetInfo(networkId);
  const { normalized, isLoading: dashboardLoading } = usePolygonCdkDashboard();

  const bridgeUrl = useMemo(() => {
    const candidate =
      (normalized?.bridge?.url as string | undefined) ??
      (normalized?.rollupMetadata?.l2?.bridgeUrl as string | undefined) ??
      (normalized?.rollupMetadata?.l1?.bridgeUrl as string | undefined);
    return normalizeBridgeUrl(candidate);
  }, [normalized]);

  return (
    <Tooltip text={"Bridge"} placement={"top-start"}>
      <Link as={"a"} target="_blank" rel="noopener noreferrer" href={bridgeUrl}>
        <Button isDisabled={isLoading || !bridgeUrl} iconLeft={<IconDocument1 className="text-xl" />}>
          Bridge
        </Button>
      </Link>
    </Tooltip>
  );
};

export default BridgeAction;
