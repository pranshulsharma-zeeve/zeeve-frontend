"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Button } from "@zeeve-platform/ui";
import { UniswapCard } from "./uniswapCard";
import { useModalStore } from "@/store/modal";
import useZkSyncValidiumService from "@/services/zksync-validium/use-zksync-validium-service";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const UniswapPage = () => {
  const { id } = useParams();
  const networkId = id as string;
  const { openModal } = useModalStore();

  const {
    request: { data: appsList, isLoading, error: appsListError },
  } = useZkSyncValidiumService().supernet.appsList(networkId);

  return (
    <div className="flex flex-col gap-y-2 lg:gap-y-6">
      {/* <DemoSupernetInfo /> */}
      <Card className="flex flex-col gap-3 lg:gap-6">
        <div className="grid grid-cols-12 place-items-center gap-3 lg:gap-6">
          {!isLoading &&
            appsList?.data &&
            Object.keys(appsList?.data).map((key) => {
              if (appsList.data[key].enabled) {
                return (
                  <UniswapCard
                    key={key} // Make sure to provide a unique key for each rendered element
                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                    actionButton={
                      <Button
                        className=" hover:bg-brand-gray hover:text-white focus:bg-brand-gray focus:text-white"
                        colorScheme="blue"
                        variant="solid"
                        onClick={() => {
                          openModal("uniswap", {
                            uniswap: {},
                          });
                        }}
                      >
                        View
                      </Button>
                    }
                  />
                );
              }
              return (
                <UniswapCard
                  key={key} // Make sure to provide a unique key for each rendered element
                  className="col-span-12 opacity-70 md:col-span-6 lg:col-span-4 xl:col-span-3"
                  actionButton={
                    <Button
                      className=" hover:bg-brand-gray hover:text-white focus:bg-brand-gray focus:text-white"
                      colorScheme="gray"
                      isDisabled={true}
                      variant="solid"
                      onClick={() => {
                        openModal("uniswap", {
                          uniswap: {},
                        });
                      }}
                    >
                      Coming Soon...
                    </Button>
                  }
                />
              );
            })}
        </div>
      </Card>
    </div>
  );
};

export default UniswapPage;
