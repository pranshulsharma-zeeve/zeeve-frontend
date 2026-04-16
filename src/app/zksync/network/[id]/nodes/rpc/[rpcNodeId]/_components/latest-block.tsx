"use client";
import { useParams } from "next/navigation";
import { Heading, Skeleton } from "@zeeve-platform/ui";
import useZkSyncValidiumService from "@/services/zksync-validium/use-zksync-validium-service";

const LatestBlock = () => {
  const params = useParams();
  const networkId = params.id as string;
  const {
    request: { data, isLoading },
  } = useZkSyncValidiumService().supernet.blockNumber(networkId);
  const blockNumber = data?.data?.blockHeight;
  const displayValue =
    typeof blockNumber === "number"
      ? blockNumber.toLocaleString()
      : typeof blockNumber === "string"
        ? blockNumber
        : "NA";
  return (
    <div className="col-span-12 flex h-[8.3rem] flex-col rounded-lg border bg-brand-primary p-7 text-center md:col-span-6 lg:col-span-12">
      {isLoading ? (
        <Skeleton role="status" as="div" className="max-w-sm">
          <div className="mx-auto mb-9 mt-2.5 h-4 max-w-[150px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mx-auto mb-2.5 h-2.5 max-w-[100px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </Skeleton>
      ) : (
        <>
          <Heading className="mt-2.5 h-12 font-extrabold text-brand-light" as="h3">
            {displayValue}
          </Heading>
          <p className="text-sm text-brand-light">Latest Block</p>
        </>
      )}
    </div>
  );
};

export default LatestBlock;
