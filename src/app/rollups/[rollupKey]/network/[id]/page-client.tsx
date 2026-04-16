"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/utils/helpers";
import PageHeader from "@/components/shared/PageHeader";

const RollupNetworkDetailsClient = ({ rollupKey, id }: { rollupKey: string; id: string }) => {
  const router = useRouter();
  useEffect(() => {
    if (rollupKey === "arbitrum-orbit") {
      router.replace(withBasePath(`/arbitrum-orbit/network/${id}`));
    }
  }, [rollupKey, id, router]);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <PageHeader
        title={`${rollupKey.replace("-", " ")} Network`}
        breadcrumbs={[{ href: withBasePath("/"), label: "Dashboard" }]}
      />
      <div className="rounded-md border border-white/10 p-6 text-sm opacity-80">Network details will appear here.</div>
    </div>
  );
};

export default RollupNetworkDetailsClient;
