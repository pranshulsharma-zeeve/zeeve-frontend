"use client";

import { Card, Skeleton } from "@zeeve-platform/ui";

const NetworkLoadingCard = () => {
  return (
    <Card className={"col-span-12 flex-col rounded-lg md:col-span-6 lg:col-span-4"}>
      <Skeleton role="status" as="div" className="mt-1 flex items-baseline gap-3">
        {/* <div className="flex size-10 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
          <svg
            className="h-10 w-8 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div> */}

        <div>
          <div className="mb-2 h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </Skeleton>
      <Skeleton className="flex h-full flex-col gap-4">
        <div className="mt-2 h-2 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className=" h-2 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="border-b pb-2">
          <div className="flex items-center justify-between py-1 text-xs">
            <div className="mt-2 flex items-baseline gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between py-1 text-xs">
            <div className="flex items-baseline gap-2">
              <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <div className="border-b pb-2">
          <div className="flex items-center justify-between py-1 text-xs">
            <div className="mt-2 flex items-baseline gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between py-1 text-xs">
            <div className="flex items-baseline gap-2">
              <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="border-b pb-2">
          <div className="flex items-center justify-between py-1 text-xs">
            <div className="mt-2 flex items-baseline gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between py-1 text-xs">
            <div className="flex items-baseline gap-2">
              <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <div className="grow"></div>
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </Skeleton>
    </Card>
  );
};

export default NetworkLoadingCard;
