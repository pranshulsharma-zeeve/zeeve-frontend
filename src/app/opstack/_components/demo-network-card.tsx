"use client";
import Link from "next/link";
import { Heading, Z4DashboardCard, Z4Button, tx } from "@zeeve-platform/ui";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";

const DemoNetworkCard = ({ id }: { id?: string | null }) => {
  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard cardType="demo" className="flex size-full grow flex-col">
        <div className={tx("flex flex-col items-start gap-3 text-sm")}>
          <Heading
            className={tx("text-brand-demo font-normal text-lg flex w-full items-center justify-between")}
            as="h5"
            style={{ letterSpacing: ".4em" }}
          >
            DEMO
            <span className="rounded-md border border-brand-demo px-1.5 text-sm font-medium text-brand-demo">Free</span>
          </Heading>
          The OP Stack testnet is a development environment for testing OP Stack&apos;s Layer 2 rollup features.
        </div>
        <KeyValuePair
          label="Name"
          value={<span className="mt-1 text-sm font-medium text-[#09122D]">Demo</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
        />
        <KeyValuePair
          label="Network Type"
          value={<span className="mt-1 text-sm font-medium text-[#09122D]">Testnet</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-2" }}
        />
        <KeyValuePair
          label="Status"
          value={<span className="mt-2 text-sm font-medium text-[#09122D]">READY</span>}
          classNames={{ label: "text-xs font-normal text-[#09122D]" }}
          enableBorder={false}
        />
        <div className="grow" />
        <div className="flex gap-3">
          <Link className="w-full" href={id ? `/opstack/network/${id}` : "#"}>
            <Z4Button className="h-12 w-full" colorScheme="demo" variant="solid" isDisabled={!id}>
              View
            </Z4Button>
          </Link>
          <Link className="w-full" href={`https://docs.zeeve.io/rollups/op-stack/demo-network`} target="_blank">
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
