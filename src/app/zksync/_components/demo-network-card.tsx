"use client";
import Link from "next/link";
import { Heading, Z4DashboardCard, Z4Button, tx } from "@zeeve-platform/ui";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";

type Props = {
  id: string;
  name: string;
  status?: string | null;
};

const DemoNetworkCard = ({ id, name, status }: Props) => {
  const docsUrl = `https://docs.zeeve.io/rollups/zksync-hyperchain/demo-network`;
  const displayName = name?.trim() ? name : "Demo Network";
  const normalizedStatus = typeof status === "string" ? status.toLowerCase() : "";
  const displayStatus = status ? (normalizedStatus === "active" ? "READY" : String(status).toUpperCase()) : null;

  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard cardType="demo" className="flex size-full grow flex-col">
        <div className={tx("flex flex-col items-start gap-3 text-sm")}>
          <Heading
            className={tx("text-brand-demo font-normal flex w-full items-center justify-between text-lg")}
            as="h5"
          >
            <span style={{ letterSpacing: ".4em" }}>DEMO</span>
            <span className="rounded-md border border-brand-demo px-1.5 text-sm font-medium tracking-normal text-brand-demo">
              Free
            </span>
          </Heading>
          Layer 2 zk Rollup Sandbox Network using zkSync ZK Stack.
        </div>
        <KeyValuePair
          label="Name"
          value={<span className="mt-1 text-sm font-medium text-[#09122D]">{displayName}</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
        />
        <KeyValuePair
          label="Network Type"
          value={<span className="mt-1 text-sm font-medium text-[#09122D]">Sandbox</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
        />
        {displayStatus ? (
          <KeyValuePair
            label="Status"
            value={<span className="mt-2 text-sm font-medium text-[#09122D]">{displayStatus}</span>}
            classNames={{ label: "text-xs font-normal text-[#09122D]" }}
            enableBorder={false}
          />
        ) : null}
        <div className="grow" />
        <div className="flex gap-3">
          <Link className="w-full" href={`/zksync/network/${id}`}>
            <Z4Button className="h-12 w-full" colorScheme="demo" variant="solid">
              View
            </Z4Button>
          </Link>
          <Link className="w-full" href={docsUrl} target="_blank">
            <Z4Button className="h-12 w-full" colorScheme="demo" variant="outline">
              Info
            </Z4Button>
          </Link>
        </div>
      </Z4DashboardCard>
    </div>
  );
};

export default DemoNetworkCard;
