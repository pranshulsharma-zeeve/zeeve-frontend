import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Inputbox } from "@zeeve-platform/inputbox-component";
import { IconAccessDenied1 } from "@zeeve-platform/icons/essential/outline";
import Link from "next/link";
import CopyButton from "@/components/vizion/copy-button";
import ROUTES from "@/routes";
import Card from "@/components/vizion/card";
import usePlatformService from "@/services/platform/use-platform-service";
import { toCapitalize, convertMicroToUnit, getExplorerUrl, getRestakeUrl } from "@/utils/helpers";
import { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import IconInfo from "@/components/icons/info";
import { RestakeInfoResponse } from "@/services/vizion/restake-info";
import { useModalStore } from "@/store/modal";

const RestakeWalletInfo = ({
  validatorData,
  networkType,
  restakeData,
  nodeId,
}: {
  validatorData?: ValidatorDetailResponse;
  networkType: string;
  restakeData: RestakeInfoResponse;
  nodeId: string;
}) => {
  const params = useParams();
  const router = useRouter();
  const networkId = params.id as string;
  const notation = getExplorerUrl(networkType.toLowerCase()).notation;
  const [restakeModalShow, setRestakeModalShow] = useState<boolean>(false);
  const { openModal } = useModalStore();

  const formatAmount = (val?: string | number) =>
    `${convertMicroToUnit(Number(val || 0)).toLocaleString("en-US")} ${toCapitalize(notation)}`;
  const restakeUrl = getRestakeUrl(networkType, validatorData?.data?.validatorAddress)?.href;

  const stakingFields = [
    {
      label: "Bot Address",
      value: restakeData?.data?.botAddress ?? "",
    },
    { label: "Balance", value: formatAmount(restakeData?.data?.balances[0]?.amount) },
  ];
  return (
    <div className={`col-span-10 rounded-2xl border border-[#E1E1E1]`}>
      <Card
        className={`col-span-10 grid grid-cols-10 gap-3 overflow-hidden rounded-2xl bg-white p-5 text-xl font-medium text-[#09122D] lg:gap-6`}
      >
        <div className="col-span-10 flex flex-row items-center justify-between">
          {/* Left: title + note */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-xl font-medium text-[#09122D]">Restake Bot Wallet Info</span>
            </div>
            <span className="mt-2 flex flex-row gap-1 text-xs font-medium text-brand-yellow">
              <IconInfo className="" />
              Please make sure bot wallet has enough balance for gas fees to create auto compound transactions
              (recommended ~1 {notation})
            </span>
          </div>

          {/* Right: action */}
          <div className="flex items-center gap-3">
            {/* Toggle switch */}
            <div
              className="flex flex-col items-start gap-2"
              title="By enabling state sync your node will download data related to the head or near the head of the chain and verify the data. This leads to drastically shorter times for joining a network. Read more: https://docs.tendermint.com/v0.34/tendermint-core/state-sync.html"
            >
              {/* Switch */}
              <div className="flex items-center gap-2">
                <label className="relative inline-flex cursor-pointer items-center">
                  <Inputbox
                    type="checkbox"
                    id="restake-status"
                    checked={restakeData?.data?.isActive}
                    onClick={() => {
                      openModal("restakeModal", {
                        restakeModal: {
                          restakeStatus: restakeData?.data?.isActive,
                          networkId: networkId as string,
                          nodeId: nodeId as string,
                        },
                      });
                    }}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-all peer-checked:bg-[#4fc898] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4fc898]"></div>
                  <div className="absolute left-1 top-1 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                </label>

                <label htmlFor="restake-status" className="cursor-pointer">
                  <h6 className="text-sm font-medium text-[#09122D]">Active status</h6>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Staking Details Body Section*/}
        <div className="col-span-10 grid grid-cols-1 gap-6 text-sm font-semibold text-[#09122D] lg:grid-cols-2">
          {stakingFields.map((field, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="break-all text-xl font-semibold text-[#09122D]">{field.value}</span>
                {field.label === "Bot Address" && <CopyButton text={field.value} />}
              </div>
              <span className="text-sm font-normal text-[#696969]">{field.label}</span>
            </div>
          ))}
        </div>
        {/* Bottom-right info */}
        <div className="col-span-10 flex justify-end">
          <span className="mt-2 flex items-center text-xs text-[#696969]">
            <IconInfo className="mr-1" />
            Manage your auto compound through&nbsp;
            {restakeData?.data?.isPrMerged ? (
              <Link href={restakeUrl} className="text-brand-cyan underline hover:text-brand-cyan/80" target="_blank">
                Restake App
              </Link>
            ) : (
              "Restake App, once the information gets updated on it."
            )}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default RestakeWalletInfo;
