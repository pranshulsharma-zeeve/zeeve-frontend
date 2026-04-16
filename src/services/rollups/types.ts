export type RollupDeployResponse = {
  checkout_url?: string;
  redirectionUrl?: string;
  service?: { service_id?: string | number | null };
  data?: {
    checkout_url?: string;
    redirectionUrl?: string;
    service?: { service_id?: string | number | null };
    id?: string | number | null;
  };
  id?: string | number | null;
};
