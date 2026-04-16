"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toCapitalize, withBasePath } from "@/utils/helpers";
import { normalizeHttpUrl } from "@/utils/rpc-utils";
import { formatNumber } from "@orbit/utils/helpers";
import { getRpcNodeInfo } from "@orbit/utils/network-overview";
import { OVERVIEW_INFO } from "@orbit/types/overview";

interface ParametersProps {
  data?: OVERVIEW_INFO;
  isLoading: boolean;
  chain?: "l2" | "l3";
  colorScheme?: "dark" | "primary";
}

const Parameters: React.FC<ParametersProps> = ({ data, isLoading, colorScheme = "primary", chain = "l3" }) => {
  const rpcUrl = useMemo(() => {
    const rpcInfo = getRpcNodeInfo(data);
    return normalizeHttpUrl(rpcInfo.httpEndpoint);
  }, [data]);

  const [rpcBlockHeight, setRpcBlockHeight] = useState<number | string | undefined>(undefined);
  const [rpcLoading, setRpcLoading] = useState(false);
  const [rpcError, setRpcError] = useState(false);

  useEffect(() => {
    if (!rpcUrl) {
      setRpcBlockHeight(undefined);
      setRpcLoading(false);
      setRpcError(true);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchBlockHeight = async () => {
      setRpcLoading(true);
      setRpcError(false);
      try {
        const response = await fetch("/api/rpc/block-height", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rpcUrl }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`RPC returned ${response.status}`);
        }
        const payload = (await response.json()) as { blockHeight?: number | string };
        if (payload?.blockHeight === undefined || payload?.blockHeight === null) {
          throw new Error("Missing block height");
        }
        if (isMounted) {
          setRpcBlockHeight(payload.blockHeight);
        }
      } catch {
        if (isMounted) {
          setRpcBlockHeight(undefined);
          setRpcError(true);
        }
      } finally {
        if (isMounted) {
          setRpcLoading(false);
        }
      }
    };

    fetchBlockHeight();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [rpcUrl]);

  const health = useMemo(() => {
    const status = rpcLoading || isLoading ? "NA" : rpcBlockHeight !== undefined && !rpcError ? "healthy" : "unhealthy";
    const colorClass =
      status === "healthy"
        ? "#2ec589"
        : status === "unhealthy"
          ? "#c12c2c"
          : colorScheme === "dark"
            ? "#F8FAFC"
            : "#f8fafa";
    return { status, colorClass } as const;
  }, [colorScheme, rpcLoading, isLoading, rpcBlockHeight, rpcError]);

  const textClass = colorScheme === "dark" ? "text-[#F8FAFC]" : "text-white";
  const blockHeight = (() => {
    if (rpcLoading || isLoading) return "Loading...";
    if (typeof rpcBlockHeight === "number") return formatNumber(rpcBlockHeight, "standard");
    if (typeof rpcBlockHeight === "string") return rpcBlockHeight;
    return "NA";
  })();

  return (
    <div className="col-span-12 flex h-full flex-col xl:col-span-2 2xl:col-span-2">
      <div className="flex h-full flex-row justify-between rounded-xl p-6 shadow-lg bg-mainnet-gradient xl:flex-col">
        {/* Content */}
        <div>
          <p className={`font-bold ${textClass}`}>{blockHeight}</p>
          <p
            className={`mb-4 text-sm font-medium ${textClass}`}
          >{`${chain ? `${toCapitalize(chain)} ` : ""}Block Height`}</p>

          <p className={`font-bold ${textClass}`}>
            <div className="flex flex-row items-center justify-start">
              {(health.status === "healthy" || health.status === "unhealthy") && (
                <svg className="relative mr-1 size-3" viewBox="0 0 12 12" fill="none">
                  {/* Pulsing Effect */}
                  <circle className="animate-ping" cx="6" cy="6" r="5" fill={health.colorClass} fillOpacity="0.5" />
                  {/* Solid Circle */}
                  <circle cx="6" cy="6" r="3" fill={health.colorClass} />
                </svg>
              )}
              {toCapitalize(health.status, "all")}
            </div>
          </p>
        </div>
        {/* Image at Bottom */}
        <div className="flex items-end justify-end sm:justify-start xl:justify-end">
          <Image
            src={withBasePath(`/assets/images/protocol/node-health.svg`)}
            alt="Node health"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Parameters;
