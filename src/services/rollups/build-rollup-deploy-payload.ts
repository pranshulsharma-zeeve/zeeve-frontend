export type RollupDeployPayload = Record<string, unknown>;

type RollupInputs = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  extras?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    is_demo?: boolean;
    isdemo?: boolean;
    network_type?: string | null;
    premine_amount?: string | number;
    premine_address?: string;
  };
};

const buildRollupDeployPayload = (inputs?: RollupInputs | null): RollupDeployPayload | null => {
  if (!inputs) return null;
  const extras = inputs.extras ?? {};
  const payload: RollupDeployPayload = {
    name: inputs.name,
    type_id: inputs.type_id ?? inputs.typeId,
    region_ids: inputs.region_ids ?? inputs.regionIds,
    network_type: extras.network_type ?? inputs.network_type ?? inputs.networkType,
    is_demo: extras.is_demo ?? extras.isdemo ?? inputs.is_demo ?? inputs.isdemo ?? false,
    configuration: inputs.configuration ?? {},
    core_components: inputs.core_components ?? [],
    nodes: inputs.nodes ?? [],
  };

  if (payload.type_id === undefined || payload.type_id === null) {
    const rollupTypeId = inputs.rollup_type_id ?? inputs.rollupTypeId;
    if (rollupTypeId !== undefined && rollupTypeId !== null) {
      payload.rollup_type_id = rollupTypeId;
    }
  }

  const premineAddress =
    extras.premine_address ?? extras.premineAddress ?? inputs.premine_address ?? inputs.premineAddress;
  if (premineAddress) {
    payload.premine_address = premineAddress;
  }

  const premineAmount = extras.premine_amount ?? extras.premineAmount ?? inputs.premine_amount ?? inputs.premineAmount;
  if (premineAmount !== undefined && premineAmount !== null && premineAmount !== "") {
    payload.premine_amount = String(premineAmount);
  }

  return payload;
};

export default buildRollupDeployPayload;
