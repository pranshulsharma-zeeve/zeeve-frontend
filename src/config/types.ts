/**
 * Type declaration for "config.json" file.
 */
type Config = {
  environment?: "prod" | "stage" | "dev" | "local";
  url?: {
    host?: string;
    internal?: {
      backend?: string;
    };
    external?: {
      auth?: {
        frontend?: string;
        backend?: string;
      };
      platformOld?: {
        frontend?: string;
        backend?: string;
      };
      platformNew?: {
        frontend?: string;
        backend?: string;
      };
      oas?: {
        backend?: string;
      };
      analytics?: {
        frontend?: string;
        backend?: string;
      };
      inAppNotifications?: {
        backend?: string;
      };
      zdfs?: {
        frontend?: string;
      };
      blockchainData?: {
        frontend?: string;
      };
      subgraph?: {
        frontend?: string;
      };
      polygonCDK?: {
        frontend?: string;
      };
      rpc?: {
        frontend?: string;
      };
      vizion?: {
        backend?: string;
      };
      coreum?: {
        backend?: string;
      };
    };
    module?: {
      sidebar?: string;
    };
  };
  other?: {
    documentation?: string;
    help?: string;
    videos?: string;
    supportEmail?: string;
    termsOfService?: string;
    cookiePolicy?: string;
    privacyPolicy?: string;
  };
  reCaptcha?: {
    siteKey: string;
    enabled?: boolean;
  };
  infra: {
    deployment?: {
      kubernetes?: {
        id: string;
      };
    };
  };
  disabledProtocolIds: string[];
  nodeConfig: {
    evmNodeEndpoint: string;
    preimagesEndpoint: string;
    opentelemetryEnabledNetworkIds: string[];
  };
};

export type { Config };
