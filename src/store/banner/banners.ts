import { getConfig } from "@/config";

const config = getConfig();

type Banner = Record<
  BannerKey,
  {
    heading: string;
    text: string;
    url: string;
    images: {
      src: string;
      alt: string;
    }[]; // images must be categorized by BannerKey inside `public/assets/images/banners` directory
  }
>;

// add banner keys here
type BannerKey = "default" | "polygon-cdk" | "zksync-hyperchain";

// add banner info here
const banners: Banner = {
  default: {
    heading: "Build, Deploy and Manage your Rollup, AppChain or Dedicated node infrastructure",
    text: "Save up to 97% in time and 60%+ in costs using Zeeve",
    url: config.url?.external?.platformNew?.frontend ?? "/",
    images: [
      {
        src: "/assets/images/banners/default/1.svg",
        alt: "banner",
      },
      {
        src: "/assets/images/banners/default/2.svg",
        alt: "banner",
      },
      {
        src: "/assets/images/banners/default/3.svg",
        alt: "banner",
      },
    ],
  },
  "polygon-cdk": {
    heading: "Build, Deploy and Manage your Polygon CDK based zkRollup with Zeeve RaaS",
    text: "Launch enterprise-grade, fully-managed L2 rollups seamlessly incorporated with features such as oracles, bridges, data indexers and account abstraction.",
    url: `${config.url?.host}/validium`,
    images: [
      {
        src: "/assets/images/banners/default/1.svg",
        alt: "banner",
      },
      {
        src: "/assets/images/banners/default/2.svg",
        alt: "banner",
      },
      {
        src: "/assets/images/banners/default/3.svg",
        alt: "banner",
      },
    ],
  },
  "zksync-hyperchain": {
    heading: "Build, Deploy and Manage your L2/L3 zkSync hyperchain with Zeeve RaaS",
    text: "Launch enterprise-grade, fully-managed L2/L3 rollups seamlessly incorporated with features such as oracles, bridges, data indexers and account abstraction.",
    url: `${config.url?.host}/zksync`,
    images: [
      {
        src: "/assets/images/banners/default/1.svg",
        alt: "banner",
      },
      {
        src: "/assets/images/banners/default/2.svg",
        alt: "banner",
      },
      {
        src: "/assets/images/banners/default/3.svg",
        alt: "banner",
      },
    ],
  },
};

export type { BannerKey };
export { banners };
