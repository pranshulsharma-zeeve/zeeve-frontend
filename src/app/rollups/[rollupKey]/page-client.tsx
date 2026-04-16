"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@zeeve-platform/ui";
import PolygonCdkLanding from "./_components/polygon-cdk-landing";
import useRollupService, { RollupKey } from "@/services/rollups/use-rollup-service";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import { withBasePath } from "@/utils/helpers";
import {
  CheckoutSessionBlockingScreen,
  useCheckoutSessionVerification,
} from "@/components/subscription/checkout-session-verifier";

interface PageClientProps {
  rollupKey: string;
}

const RollupDashboardPageClient = ({ rollupKey }: PageClientProps) => {
  const key = rollupKey.toLowerCase() as RollupKey;
  const router = useRouter();
  const { services } = useRollupService();
  const { request } = services(key);
  const info = request.data?.data;
  const { isBlocking, verificationStatus } = useCheckoutSessionVerification();

  const cards = useMemo(() => {
    const arr: Array<{ title: string; description?: string; action: () => void; cta: string }> = [];
    if (info?.demo?.available) {
      arr.push({
        title: "Demo Network",
        description: "Explore a demo network for this rollup.",
        action: () => {
          const id = info.demo?.id;
          if (id) {
            if (key === "arbitrum-orbit") router.push(withBasePath(`/arbitrum-orbit/network/${id}`));
            else router.push(withBasePath(`/rollups/${key}/network/${id}`));
          }
        },
        cta: "Open Demo",
      });
    }
    arr.push({
      title: "Testnet",
      description: info?.testnet?.deployed ? "Your testnet is ready." : "Deploy a testnet instance.",
      action: () => {
        const id = info?.testnet?.id;
        if (info?.testnet?.deployed && id) {
          if (key === "arbitrum-orbit") router.push(withBasePath(`/arbitrum-orbit/network/${id}`));
          else router.push(withBasePath(`/rollups/${key}/network/${id}`));
        } else {
          router.push(withBasePath(`/rollups/${key}/deploy?env=testnet`));
        }
      },
      cta: info?.testnet?.deployed ? "View" : "Deploy",
    });
    arr.push({
      title: "Mainnet",
      description: info?.mainnet?.deployed ? "Your mainnet is ready." : "Deploy a mainnet instance.",
      action: () => {
        const id = info?.mainnet?.id;
        if (info?.mainnet?.deployed && id) {
          if (key === "arbitrum-orbit") router.push(withBasePath(`/arbitrum-orbit/network/${id}`));
          else router.push(withBasePath(`/rollups/${key}/network/${id}`));
        } else {
          router.push(withBasePath(`/rollups/${key}/deploy?env=mainnet`));
        }
      },
      cta: info?.mainnet?.deployed ? "View" : "Deploy",
    });
    return arr;
  }, [info, key, router]);

  if (isBlocking) {
    return <CheckoutSessionBlockingScreen status={verificationStatus} />;
  }

  // Special landing for Polygon CDK – rich cards like Validium
  if (key === "polygon-cdk") {
    return (
      <div className="flex flex-col gap-y-3 lg:gap-y-6">
        <PageHeader
          title={"Polygon CDK"}
          breadcrumbs={[
            { href: withBasePath("/"), label: "Dashboard" },
            { href: withBasePath(`/${key}`), label: rollupKey, isActive: true },
          ]}
        />
        <PolygonCdkLanding rollupKey={key} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <PageHeader
        title={rollupKey.replace("-", " ")}
        breadcrumbs={[
          { href: withBasePath("/"), label: "Dashboard" },
          { href: withBasePath(`/rollups/${key}`), label: rollupKey },
        ]}
      />
      <SectionCard title="Getting Started" subtitle="Choose an environment to view or deploy">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((c, idx) => (
            <Card key={idx} className="flex flex-col gap-3 p-4">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              {c.description ? <p className="text-sm opacity-80">{c.description}</p> : null}
              <Button onClick={c.action} className="w-fit">
                {c.cta}
              </Button>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default RollupDashboardPageClient;
