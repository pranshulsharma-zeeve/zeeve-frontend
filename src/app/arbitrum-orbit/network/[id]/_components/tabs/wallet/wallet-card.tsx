"use client";
import { Card, Tooltip, Z4Button } from "@zeeve-platform/ui";
import { IconBox } from "@zeeve-platform/icons/delivery/outline";
import InfoRow from "@orbit/components/info-row";
import { WALLET_INFO } from "@orbit/types/wallet-info";
import { formatURL, toShortString, weiToEth } from "@orbit/utils/helpers";

type WalletProps = {
  wallet: WALLET_INFO;
  l3TokenName: string;
};

const WalletTableRowActions = ({ row }: { row: WALLET_INFO }) => {
  return (
    <div className="flex flex-row gap-3">
      {row.relevantFor.includes("L2") && (
        <Tooltip text={"View on L2 explorer"} placement={"top-start"}>
          <Z4Button
            colorScheme={"light"}
            variant={"solid"}
            iconLeft={<IconBox className="text-sm font-medium" />}
            className="h-[24px] p-1 text-sm font-medium"
            isDisabled={!row.explorerL2Url}
            onClick={() => {
              if (row.explorerL2Url) {
                window.open(formatURL(row.explorerL2Url));
              }
            }}
          >
            L2
          </Z4Button>
        </Tooltip>
      )}
      {row.relevantFor.includes("L3") && (
        <Tooltip text={"View on L3 explorer"} placement={"top-start"}>
          <Z4Button
            colorScheme={"light"}
            variant={"solid"}
            iconLeft={<IconBox className="text-sm font-medium" />}
            isDisabled={!row.explorerL3Url}
            className="h-[24px] p-1 text-sm font-medium"
            onClick={() => {
              if (row.explorerL3Url) {
                window.open(formatURL(row.explorerL3Url));
              }
            }}
          >
            L3
          </Z4Button>
        </Tooltip>
      )}
    </div>
  );
};

const WalletCard = ({ wallet, l3TokenName }: WalletProps) => {
  return (
    <div className="col-span-12 rounded-lg border border-brand-outline shadow-sm lg:col-span-4">
      <Card className="flex flex-col border-0">
        <div className="flex items-start justify-between">
          <InfoRow label="Name" value={wallet.name} />
        </div>

        <div className="flex items-center justify-between">
          <InfoRow
            label="Address"
            value={toShortString(wallet.address, 7, 7)}
            showCopyButton
            copyValue={wallet.address}
          />
          <InfoRow label="Relevant For" value={wallet.relevantFor.join(" & ")} textAlign="right" />
        </div>

        <div className="flex items-center justify-between">
          {wallet.relevantFor.includes("L2") && (
            <InfoRow
              label="L2 Balance"
              value={`${weiToEth(wallet.l2Balance ?? "0")} ETH`}
              valueClassName="rounded border border-[#FF0420] px-1.5 text-xs font-bold text-[#FF0420]"
            />
          )}
          {wallet.relevantFor.includes("L3") && (
            <InfoRow
              label="L3 Balance"
              value={`${weiToEth(wallet.l3Balance ?? "0")} ${l3TokenName}`}
              textAlign="right"
              valueClassName="rounded border border-[#FF0420] px-1.5 text-xs font-bold text-[#FF0420]"
            />
          )}
        </div>
      </Card>
      <div className="flex items-center justify-between rounded-b-lg p-4 text-white bg-mainnet-gradient lg:px-6">
        <p className="text-sm">View on Explorer</p>
        <WalletTableRowActions row={wallet} />
      </div>
    </div>
  );
};

export default WalletCard;
