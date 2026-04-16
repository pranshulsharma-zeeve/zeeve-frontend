"use client";
import { IconArrow1Right } from "@zeeve-platform/icons/arrow/outline";
import { Button, Card, Z4Navigation } from "@zeeve-platform/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/utils/helpers";
import { useConfigStore } from "@/store/config";
import ROUTES from "@/routes";
import { EXTERNAL_ROUTES } from "@/constants/protocol";

export const rollupAppchainDeploymentOptions = [
  {
    id: 1,
    title: "Arbitrum Orbit",
    description: "Arbitrum's suite of scaling solutions provides fast and secure transactions on Ethereum.",
    image: "arbitrum-icon.svg",
    url: "/arbitrum-orbit",
  },
  {
    id: 2,
    title: "OP Stack",
    description: "OP Stack is a modular framework for building scalable and customizable Layer 2 solutions.",
    image: "optimism-icon.svg",
    url: "/opstack",
  },
  {
    id: 3,
    title: "Polygon CDK",
    description: "Polygon CDK is a developer toolkit for building scalable and interoperable blockchain applications.",
    image: "polygon-icon.svg",
    url: "/polygon-cdk",
  },
  {
    id: 4,
    title: "zkSync Hyperchains",
    description: "zkSync Era is a Layer 2 scaling solution for Ethereum, enabling fast and secure transactions.",
    image: "hyperchain.svg",
    url: "/zksync",
  },
  {
    id: 5,
    title: "Avalanche L1",
    description:
      "Avalanche L1 provides a high-performance blockchain platform with low transaction costs and fast finality.",
    image: "avalanche-icon.svg",
    url: EXTERNAL_ROUTES.COGITUS,
  },
  {
    id: 6,
    title: "Parachains",
    description:
      "Parachains are independent blockchains that run in parallel on the Polkadot network, enabling interoperability and scalability.",
    image: "parachains-icon.svg",
    url: EXTERNAL_ROUTES.PERFUSE,
  },
];

const SelectRollupAppchainPageClient = () => {
  const router = useRouter();
  const config = useConfigStore((state) => state.config);
  const host = config?.url?.host ?? "https://app.zeeve.io";

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={"Deploy your Rollup or Appchains"}
        breadcrumb={{
          items: [
            {
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              label: "Dashboard",
              isActive: false,
              as: "a",
            },
            {
              href: "",
              label: "Select Rollup or Appchain",
              isActive: true,
            },
          ],
        }}
      ></Z4Navigation>

      {/* Deployment Cards Grid */}
      <div className="grid max-w-full grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-4">
        {rollupAppchainDeploymentOptions.map((option) => (
          <Card key={option.id} className="rounded-2xl border-0 bg-[#0152B80D] backdrop-blur-md">
            <div className="flex h-full flex-col gap-2 lg:gap-3">
              {/* Icon and Title */}
              <Image
                src={withBasePath(`/assets/images/protocols/${option.image}`)}
                alt={option.title}
                height={32}
                width={32}
              />
              <span className="text-xl font-semibold">{option.title}</span>

              {/* Description */}
              <p className="mb-6 grow text-sm lg:mb-9">{option.description}</p>

              {/* Deploy Button */}
              <Button
                size={"large"}
                className="rounded text-sm font-semibold lg:text-base"
                onClick={() => router.push(`${option.url}`)}
              >
                Deploy Now
                <IconArrow1Right className="ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SelectRollupAppchainPageClient;
