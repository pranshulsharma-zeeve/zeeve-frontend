// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tooltip } from "@zeeve-platform/ui";
import React, { useCallback, useEffect, useState } from "react";
import { ReactTable, createColumnHelper, ColumnDef } from "@zeeve-platform/ui-common-components";
import { useQuery } from "@apollo/client";
import { getBlockHeightAndIndex } from "./getBlockHeightAndIndex";
import { DataAvailability } from "@/types/dataAvailability";
import { GET_DATA } from "@/constants/dataAvailability";

type TransactionBatches = {
  node: {
    number: number;
    sequenceId: number;
    polygonZkevmLifecycleL1TransactionBySequenceId: {
      hash: string;
      isVerify: boolean;
    };
  };
};

const hashToBatchNumbers: {
  [sequenceHash: string]: number[];
} = {};

const aggregateBatchNumber = (transactionBatches: TransactionBatches[]) => {
  transactionBatches.forEach((batch) => {
    if (!hashToBatchNumbers[batch.node.polygonZkevmLifecycleL1TransactionBySequenceId.hash]) {
      hashToBatchNumbers[batch.node.polygonZkevmLifecycleL1TransactionBySequenceId.hash] = [];
    }

    hashToBatchNumbers[batch.node.polygonZkevmLifecycleL1TransactionBySequenceId.hash].push(batch.node.number);
  });
};

const columnHelper = createColumnHelper<DataAvailability>();
// table columns
const batchTableColumns: ColumnDef<DataAvailability, any>[] = [
  columnHelper.accessor("batchNumber", {
    header: "Batch No. (L2)",
    cell: (info) => (
      <Tooltip text={info.getValue()} placement="top-start">
        <div>{info.getValue()}</div>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("blockHeight", {
    header: "Block Height on DA",
    cell: (info) => (
      <Tooltip text={info.getValue() ?? "NA"} placement="top-start">
        <div>{info.getValue() ?? "NA"}</div>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("index", {
    header: "Index (txn number in block)",
    cell: (info) => (
      <Tooltip text={info.getValue()} placement="top-start">
        <div>{info.getValue()}</div>
      </Tooltip>
    ),
  }),
];
const BatchesData = () => {
  const [data, setData] = useState<Array<DataAvailability>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { loading, data: txnData } = useQuery(GET_DATA, {
    variables: {
      last: 80,
      var: false,
    },
  });

  //Function to load batch numbers, block height and index in the table
  const getTableData = useCallback(async () => {
    try {
      console.log(txnData);
      aggregateBatchNumber(txnData?.allPolygonZkevmTransactionBatches?.edges);

      // Create a new array to hold the rows for the table
      const tableData: DataAvailability[] = [];

      const promises = Object.entries(hashToBatchNumbers).map(async ([hash, batchNumbers]) => {
        const newHash = hash.replace("\\", "0");
        const result = await getBlockHeightAndIndex(newHash);
        let blockHeight = "NA";
        let index = "NA";

        if (typeof result === "string") {
          const parts = result.split(",");
          blockHeight = parts[0] ?? "NA";
          index = parts[1] ?? "NA";
        }

        batchNumbers.sort((a, b) => a - b);
        tableData.push({
          batchNumber: `${batchNumbers[0]}-${batchNumbers.slice(-1)}`,
          blockHeight: blockHeight ?? "NA",
          index: index ?? "NA",
        });
      });

      await Promise.all(promises);
      tableData.sort((a, b) => {
        const startBatchA = parseInt(a.batchNumber.split("-")[0], 10);
        const startBatchB = parseInt(b.batchNumber.split("-")[0], 10);
        return startBatchB - startBatchA;
      });
      setData(tableData);
    } catch (error) {
      console.log("getBatchesData: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [txnData]);

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline md:col-span-8 lg:col-span-8 xl:col-span-7">
      <div className="m-2">
        <ReactTable
          key={data.length}
          data={data}
          columns={batchTableColumns}
          isLoading={isLoading}
          classNames={{
            table: "table-auto lg:table-fixed",
          }}
        />
      </div>
    </div>
  );
};

export default BatchesData;
