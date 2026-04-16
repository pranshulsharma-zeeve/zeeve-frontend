"use client";
import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, Heading, Input, Select, Button, useToast } from "@zeeve-platform/ui";
import PageHeader from "@/components/shared/PageHeader";
import useRollupConfiguration from "@/services/rollups/use-rollup-configuration";
import SectionCard from "@/components/shared/SectionCard";
import useRollupService, { RollupKey } from "@/services/rollups/use-rollup-service";
import { withBasePath } from "@/utils/helpers";

const DeployRollupPageClient = ({ rollupKey }: { rollupKey: string }) => {
  const env = (useSearchParams().get("env") ?? "testnet") as "testnet" | "mainnet";
  const key = rollupKey.toLowerCase() as RollupKey;
  const toast = useToast();
  const router = useRouter();

  const { types, deploy } = useRollupService();
  const { request: typesReq } = types(key);
  const typeData = typesReq.data?.data;
  // Prefer new configuration API, fallback to legacy types API if not available
  const { options: cfgOptions } = useRollupConfiguration(key);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("networkName") as string) || "";
    const settlementLayer = (formData.get("settlementLayer") as string) || "";
    const dataAvailability = (formData.get("dataAvailability") as string) || "";
    // Build Arbitrum-style payload to be consistent across rollups
    const payload = {
      rollupKey: key,
      environment: env,
      networkConfig: {
        generalConfig: {
          name,
          environment: env === "mainnet" ? "mainnet" : "devnet",
          workspaceId: "", // optional/default; backend may infer
        },
        chainConfig: {
          settlementLayer,
          externalDA: dataAvailability,
          externalDaPartner: "",
          sequencer: "Centralized",
          sequencerPartner: "",
          integerations: { bridge: true, rpc: true, explorer: true, faucet: false },
        },
      },
      cloudConfig: {
        cloudId: "c8f63af9-4e4a-418b-9148-3e6a0da32ef4",
        regionId: "774af366-2b1d-47c7-a573-a3f922be8f46",
        deploymentTypeId: "bd005ba5-015e-46c4-8336-20fc820ccf9e",
        managedHosting: true,
      },
      nodesConfig: {},
    };
    try {
      const res = await deploy().request(payload);
      const redirect = res?.data?.redirectionUrl;
      const id = res?.data?.id;
      if (redirect) {
        router.push(redirect);
      } else if (id) {
        if (key === "arbitrum-orbit") router.push(withBasePath(`/arbitrum-orbit/network/${id}`));
        else router.push(withBasePath(`/rollups/${key}/network/${id}`));
      } else {
        toast("Deployment started", { status: "success" });
      }
    } catch (err) {
      toast("Failed to deploy", { status: "error" });
    }
  };

  const slOptions = useMemo(() => {
    if (cfgOptions.settlementLayers.length > 0) return cfgOptions.settlementLayers;
    return typeData?.settlementLayers ?? [];
  }, [cfgOptions.settlementLayers, typeData]);
  const daOptions = useMemo(() => {
    if (cfgOptions.dataAvailabilityLayers.length > 0) return cfgOptions.dataAvailabilityLayers;
    return typeData?.dataAvailabilityLayers ?? [];
  }, [cfgOptions.dataAvailabilityLayers, typeData]);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <PageHeader
        title={`Deploy ${rollupKey.replace("-", " ")} (${env})`}
        breadcrumbs={[
          { href: withBasePath("/"), label: "Dashboard" },
          { href: withBasePath(`/rollups/${key}`), label: rollupKey },
          { href: withBasePath(`/rollups/${key}/deploy?env=${env}`), label: "Deploy" },
        ]}
      />
      <SectionCard title="Configuration" subtitle="Fill required details and deploy">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="col-span-1 flex flex-col gap-3 p-4">
            <Heading as="h5">General</Heading>
            <label className="text-sm">Network Name</label>
            <Input name="networkName" placeholder="My Rollup" isRequired />
          </Card>

          <Card className="col-span-1 flex flex-col gap-3 p-4">
            <Heading as="h5">Layers</Heading>
            <label className="text-sm">Settlement Layer</label>
            <Select name="settlementLayer" isRequired>
              {slOptions.map((o: any) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <label className="text-sm">Data Availability</label>
            <Select name="dataAvailability" isRequired>
              {daOptions.map((o: any) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Card>

          <div className="col-span-1 md:col-span-2">
            <Button type="submit">Deploy</Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default DeployRollupPageClient;
