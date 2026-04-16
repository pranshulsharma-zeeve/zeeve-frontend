"use client";
import { Card, Tooltip, Z4Button } from "@zeeve-platform/ui";
import { IconBox } from "@zeeve-platform/icons/delivery/outline";
import InfoRow from "@orbit/components/info-row";
import { formatURL, toShortString } from "@orbit/utils/helpers";

type ContractProps = {
  data: {
    name: string;
    address?: string;
    explorer?: string;
  };
  source: string;
};

const ContractCard = ({ data, source }: ContractProps) => {
  return (
    <div className="col-span-12 rounded-lg border border-brand-outline shadow-sm">
      <Card className="flex flex-col border-0">
        <div className="flex items-start justify-between">
          <InfoRow label="Name" value={data.name} />
          <InfoRow
            label="Address"
            value={data.address ? toShortString(data.address, 7, 7) : "NA"}
            showCopyButton={Boolean(data.address)}
            copyValue={data.address ?? ""}
          />
        </div>
      </Card>
      <div className="flex items-center justify-between rounded-b-lg p-4 text-white bg-mainnet-gradient lg:px-6">
        <p className="text-sm">View on Explorer</p>
        <Tooltip text={`View on ${source} explorer`} placement={"top-start"}>
          <Z4Button
            colorScheme={"light"}
            variant={"solid"}
            iconLeft={<IconBox className="text-sm font-medium" />}
            className="h-[24px] p-1 text-sm font-medium"
            isDisabled={!data.explorer}
            onClick={() => {
              if (data.explorer) {
                window.open(formatURL(data.explorer));
              }
            }}
          >
            {source}
          </Z4Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ContractCard;
