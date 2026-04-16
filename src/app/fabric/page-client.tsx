"use client";
import { Spinner, Button, Z4Navigation } from "@zeeve-platform/ui";
import Image from "next/image";
import { IconPhone } from "@zeeve-platform/icons/phone/outline";
import KeyFeatureCard from "../besu/_components/keyFeatureCard";
import { withBasePath } from "@/utils/helpers";
import ROUTES from "@/routes";
import { useModalStore } from "@/store/modal";

const keyFeatures: { title: string; content: string }[] = [
  {
    title: "Configurations & Flexibility",
    content: "Unlimited flexibility to deploy and manage your Hyperledger Fabric network",
  },
  {
    title: "Enterprise-grade Node Infrastructure",
    content: "Reliable nodes with load balancing, scalability and high availability",
  },
  {
    title: "White-labeled Block Explorer",
    content: "Integrated whitelabeled and featurerich Block Explorer",
  },
  {
    title: "Cost-optimized Super Performance",
    content: "Blazingly fast APIs, high throughput and scaleon- demand",
  },
  {
    title: "Enterprise SLA",
    content: "24x7 support with 99.9% uptime guarantee",
  },
  {
    title: "Hosted Subgraphs and Data APIs",
    content: "Real-time access to Data APIs with super-fast indexers",
  },
  {
    title: "Global Cloud Coverage",
    content: "Supports 9 cloud providers with 150+ regions across the world",
  },
  {
    title: "Node Analytics and 24x7 Proactive Monitoring",
    content: "Advanced analytics and 24x7 Monitoring with Alerts and Notifications",
  },
  {
    title: "Production-Ready Stack with all components",
    content: "Faucet, cross-chain bridges, wallet infrastructure, etc",
  },
  {
    title: "Migration Assistance",
    content: "Expert support for migration to your own Hyperledger Fabric network infrastructure",
  },
];

const isLoading = false;

const FabricPageClient = () => {
  const { openModal } = useModalStore();
  const openContactUsModal = () =>
    openModal("contactUs", {
      contactUs: {
        protocolName: "fabric",
      },
    });

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Z4Navigation
        heading={
          <div>
            {isLoading ? (
              <Spinner colorScheme={"cyan"} />
            ) : (
              <div className="flex flex-row items-center gap-2">Hyperledger Fabric</div>
            )}
          </div>
        }
        breadcrumb={{
          items: [
            {
              label: "Dashboard",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              as: "a",
              isActive: false,
            },
            {
              label: "Hyperledger Fabric",
              href: "/platform/fabric",
              isActive: true,
            },
          ],
        }}
      ></Z4Navigation>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {keyFeatures.map((keyFeature, idx) => (
          <KeyFeatureCard key={idx} title={keyFeature.title} content={keyFeature.content} />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/50 shadow-[0px_21px_18px_0px_#0000000A]">
        <Image
          src={withBasePath(`/assets/images/fabric/bg-banner.svg`)}
          alt="Banner"
          className="h-[220px] w-full object-cover object-[72%_center] sm:h-[260px] sm:object-[78%_center] lg:h-[300px] lg:object-right xl:object-center"
          width={1440}
          height={320}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[#0E2B6E]/35 px-4 py-6 sm:px-8">
          <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 text-center sm:gap-6">
            <span className="max-w-2xl text-sm font-medium leading-6 text-white sm:text-lg sm:leading-8 lg:text-[22px]">
              Choose from a range of subscription plans designed to fit your needs.
            </span>
            <Button
              className="w-full max-w-[240px] rounded-[4px] bg-white px-5 py-3 text-sm font-semibold text-brand-primary sm:w-fit lg:px-6 lg:py-5 lg:text-base"
              iconLeft={<IconPhone className="mr-1 text-2xl" />}
              onClick={openContactUsModal}
            >
              Talk to an Expert
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-[28px] border border-white bg-[#FFFFFF66] p-5 backdrop-blur-sm sm:p-8 lg:p-10">
        <span className="text-center text-xs font-semibold uppercase tracking-[4px] text-[#FF9653] sm:text-sm sm:tracking-[5px]">
          Testimonial
        </span>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex w-full shrink-0 flex-col items-center gap-5 rounded-2xl bg-white p-5 text-center shadow-[0px_5px_10px_0px_#00000005] sm:p-6 lg:w-[320px] lg:items-start lg:text-left">
            <div className="flex w-full flex-col gap-4 border-b border-[#E1E1E1] pb-5">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:items-start">
                <div className="relative size-[64px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={withBasePath(`/assets/images/fabric/prasannaLohar.jpeg`)}
                    alt="Reviewer logo"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-lg font-medium text-[#383535]">Prasanna Lohar</span>
                  <span className="text-xs leading-5 text-[#4D4D4E]">Digital Head, DCB Bank</span>
                </div>
              </div>
              <Image
                src={withBasePath(`/assets/images/others/stars.svg`)}
                alt={`Ratings Logo`}
                className="mx-auto h-auto w-[100px] sm:mx-0"
                width={100}
                height={20}
              />
            </div>
            <Image
              src={withBasePath(`/assets/images/fabric/dcb_bank.svg`)}
              alt={`DCB Bank Icon`}
              className="h-auto w-[140px]"
              width={140}
              height={36}
            />
          </div>

          <div className="flex flex-1 items-center rounded-2xl bg-white/70 p-5 text-sm leading-7 text-[#4D4D4E] shadow-[0px_5px_10px_0px_#00000005] sm:p-6 sm:text-base lg:p-8">
            “Zeeve’s web3 infrastructure automation platform helped the DCB team solve all the challenges about the
            enterprise Fabric deployment. Hiring an expert DevOps resource with knowledge of Blockchain is a nightmare.
            Zeeve Platform helped us in a perfect way to overcome this big issue. It was completely seamless with
            experts like Zeeve”
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricPageClient;
