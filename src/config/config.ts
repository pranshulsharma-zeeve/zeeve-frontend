import { Config } from "./types";
import { OPENTELEMETRY_ENABLED_NETWORK_IDS } from "@/constants/protocol";
import { getNormalizedApiBackend, normalizeUrlEnv } from "@/utils/env";

/**
 * Get frontend config.
 */
const getConfig = (): Config => {
  // different from NODE_ENV, if NEXT_PUBLIC_ENVIRONMENT is set then use that otherwise set it to "local"
  const environment = (process.env.NEXT_PUBLIC_ENVIRONMENT as "prod" | "stage" | "dev" | "local") ?? "local";
  // host, for example: app.develop.zeeve.io
  const host = normalizeUrlEnv(process.env.NEXT_PUBLIC_HOST);
  const hostFallback = host ? host : "";
  const defaultVizionBackend = "https://vision-backend-test.zeeve.netmoniitor-data";
  const vizion = process.env.NEXT_PUBLIC_VIZION_BACKEND ?? defaultVizionBackend;
  const normalizedApiBackend = getNormalizedApiBackend();
  const enableRecaptchaEnv = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA;
  const normalizedRecaptchaEnv = enableRecaptchaEnv?.trim().toLowerCase() ?? "";
  const isRecaptchaEnabled = !["false", "0", "no"].includes(normalizedRecaptchaEnv);

  // config
  return {
    environment,
    url: {
      host: hostFallback,
      internal: {
        backend: normalizedApiBackend,
      },
      external: {
        auth: {
          frontend: hostFallback,
          backend: normalizedApiBackend,
        },
        platformOld: {
          frontend: host ? `${hostFallback}/app` : "",
          backend: normalizedApiBackend,
        },
        platformNew: {
          frontend: hostFallback || "",
          backend: normalizedApiBackend,
        },
        oas: {
          backend: host ? `${hostFallback}/oas` : "",
        },
        analytics: {
          frontend: host ? `${hostFallback}/analytics` : "",
          backend: host ? `${hostFallback}/analytics` : "",
        },
        inAppNotifications: {
          backend: host ? `wss://${host}/notifications` : "",
        },
        zdfs: {
          frontend: host ? `${hostFallback}/zdfs` : "",
        },
        blockchainData: {
          frontend: host ? `${hostFallback}/blockchain-data` : "",
        },
        subgraph: {
          frontend: host ? `${hostFallback}/subgraph` : "",
        },
        polygonCDK: {
          frontend: host ? `${hostFallback}/validium` : "",
        },
        rpc: {
          frontend: "https://mimir-gateway.analytics.svc:80/prometheus/api/v1",
        },
        vizion: {
          backend: vizion ?? "",
        },
        coreum: {
          backend: host ? `${hostFallback}/coreum-backend` : "",
        },
      },
      module: {
        sidebar: host ? `${hostFallback}/sidebar` : "",
      },
    },
    other: {
      documentation: "https://www.zeeve.io/docs",
      help: "https://help.zeeve.io",
      videos: "https://www.youtube.com/@0xZeeve/videos",
      supportEmail: "support@zeeve.io",
      termsOfService: "https://www.zeeve.io/terms-and-conditions",
      cookiePolicy: "https://www.zeeve.io/cookie-policy",
      privacyPolicy: "https://www.zeeve.io/privacy-policy",
    },
    reCaptcha: {
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "",
      enabled: isRecaptchaEnabled,
    },
    infra: {
      deployment: {
        kubernetes: {
          id: "b8334dc6-c365-4958-ac41-8480ba0e8a0c",
        },
      },
    },
    disabledProtocolIds: ["bd8abd00-69ce-4412-81a5-64201ac2e81c"],
    nodeConfig: {
      evmNodeEndpoint: "https://relay.mainnet.etherlink.com",
      preimagesEndpoint: "https://snapshots.tzinit.org/etherlink-mainnet/wasm_2_0_0",
      opentelemetryEnabledNetworkIds: OPENTELEMETRY_ENABLED_NETWORK_IDS,
    },
  };
};

export { getConfig };
