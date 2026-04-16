// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@zeeve-platform/ui";
import NoDataAvailable from "../../no-data-available";
import ContractCard from "./contract-card";

type SmartContract = { name: string; address?: string; explorer?: string };

interface SmartContractsCardsProps {
  data?: Array<SmartContract>;
  source: string;
  isLoading: boolean;
}

const SmartContractsCards = ({ data, source, isLoading }: SmartContractsCardsProps) => {
  const [smartContracts, setSmartContracts] = useState<Array<SmartContract>>([]);
  useEffect(() => {
    const tempSmartContracts = data
      ? data.map((smartContract) => {
          return {
            ...smartContract,
          };
        })
      : [
          // {
          //   name: "string",
          //   address: "0x4075a0a01486865abf9199689f6c1a1e70D74be6",
          //   explorer: "string",
          // },
        ];
    setSmartContracts(tempSmartContracts);
  }, [data]);

  return (
    <div className="grid grid-cols-12 gap-6">
      {isLoading ? (
        [...Array(3)].map((_, i) => (
          <Skeleton key={i} role="status" as="div" className="col-span-12 m-2 h-56 rounded-lg p-4 shadow-md" />
        ))
      ) : smartContracts.length > 0 ? (
        smartContracts.map((contract, index) => <ContractCard key={index} data={contract} source={source} />)
      ) : (
        <NoDataAvailable />
      )}
    </div>
  );
};

export default SmartContractsCards;
