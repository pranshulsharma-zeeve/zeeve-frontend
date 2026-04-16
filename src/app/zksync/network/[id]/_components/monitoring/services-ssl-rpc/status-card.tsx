import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface StatusProps {
  cpu?: string;
  memory?: string;
  network?: string;
  rpcStatus?: string;
  sslStatus?: string;
  networkSent?: string;
}

export default function StatusCard(props: StatusProps) {
  return (
    <div className="w-72 rounded-lg bg-[#12132966] p-4 text-white shadow-lg backdrop-blur-md">
      <div className="space-y-3">
        {props.cpu && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={withBasePath("/assets/images/protocol/service/cpu.svg")} alt="cpu" width={14} height={14} />
              <span>CPU</span>
            </div>
            <span>{props.cpu} Core</span>
          </div>
        )}
        {props.memory && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={withBasePath("/assets/images/protocol/service/memory.svg")}
                alt="memory"
                width={14}
                height={14}
              />
              <span>Memory</span>
            </div>
            <span>{(Number(props.memory) / 1024 ** 3).toFixed(3)} GB</span>
          </div>
        )}
        {props.network && props.networkSent && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={withBasePath("/assets/images/protocol/service/network.svg")}
                alt="network"
                width={14}
                height={14}
              />
              <span>Network I/O</span>
            </div>
            <span>
              {((Number(props.networkSent) * 8) / 1_000_000).toFixed(3)} /{" "}
              {((Number(props.network) * 8) / 1_000_000).toFixed(3)} Mbps
            </span>
          </div>
        )}
        {props.rpcStatus && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={withBasePath("/assets/images/protocol/service/network-analytic.svg")}
                alt="network-analytic"
                width={14}
                height={14}
              />
              <span>RPC Status</span>
            </div>
            {props.rpcStatus.toLowerCase() === "healthy" ? (
              <Image
                src={withBasePath("/assets/images/protocol/healthy.svg")}
                alt="blockchain"
                width={74}
                height={74}
              />
            ) : (
              <div className="rounded-md bg-red-600 px-2 text-white">Risky</div>
            )}
          </div>
        )}
        {props.sslStatus && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={withBasePath("/assets/images/protocol/service/blockchain.svg")}
                alt="blockchain"
                width={14}
                height={14}
              />
              <span>SSL Status</span>
            </div>
            <span className="font-bold text-red-500">{props.sslStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
