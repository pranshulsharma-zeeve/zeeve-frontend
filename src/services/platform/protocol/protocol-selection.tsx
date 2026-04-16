import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";

type Region = {
  name: string;
  id: string;
};

type RegionsByContinent = {
  [continentName: string]: Region[];
};
type NetworkTypeDetail = {
  name: string;
  type: string;
  enabled: boolean;
};

type Pricing = {
  planPrice: number;
  cloud: {
    managed: number;
    byoc?: {
      [byoc: string]: number;
    };
  };
  nodeType: {
    [nodeType: string]: number;
  };
  networkType: {
    [networkType: string]: number;
  };
  continentType: {
    [continent: string]: number;
  };
};

type ProtocolSelectionResponseData = {
  protocolName?: string;
  protocolDesc?: string;
  protocolId?: string;
  networkType: {
    [nodeType: string]: NetworkTypeDetail[];
  };
  regions: RegionsByContinent;
  pricing?: Pricing;
  cloudId: string;
};

type ProtocolSelectionResponse = {
  success: boolean;
  data: ProtocolSelectionResponseData;
};

const useProtocolSelectionAPI = (protocolId: string, pricingRequired?: boolean) => {
  /** api url */
  const url = `${ROUTES.PLATFORM.API.PROTOCOLS}/${protocolId}?pricingRequired=${pricingRequired}`;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ProtocolSelectionResponseData>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ProtocolSelectionResponseData, ProtocolSelectionResponse };
export default useProtocolSelectionAPI;
