"use client";
import React from "react";
import { CopyButton, Heading, Tooltip } from "@zeeve-platform/ui";
import { createColumnHelper, ColumnDef, ReactTable } from "@zeeve-platform/ui-common-components";
import { toShortString } from "@/utils/helpers";

interface GeneralInfoProps {
  blsKey?: string;
  blsProof?: string;
  nodeId?: string;
  dcomm?: boolean;
}

const GeneralInfo = ({ blsKey, blsProof, nodeId, dcomm }: GeneralInfoProps) => {
  const columnHelper = createColumnHelper<GeneralInfoProps>();
  // table columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeTableColumn: ColumnDef<GeneralInfoProps, any>[] = [
    ...(dcomm
      ? [
          columnHelper.accessor("nodeId", {
            header: "Node ID", // Change header to "Validator ID"
            cell: (info) => {
              return nodeId ? (
                <Tooltip text={nodeId} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(nodeId, 15, 15)}</div>
                    <CopyButton text={nodeId} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              );
            },
          }),
        ]
      : [
          columnHelper.accessor("nodeId", {
            header: "Node ID",
            cell: (info) => {
              return nodeId ? (
                <Tooltip text={nodeId} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(nodeId, 15, 15)}</div>
                    <CopyButton text={nodeId} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              );
            },
          }),
          columnHelper.accessor("blsKey", {
            header: "BLS Public Key",
            cell: (info) => {
              return blsKey ? (
                <Tooltip text={blsKey} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(blsKey, 15, 15)}</div>
                    <CopyButton text={blsKey} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              );
            },
          }),
          columnHelper.accessor("blsProof", {
            header: "BLS Proof of Possession",
            cell: (info) => {
              return blsProof ? (
                <Tooltip text={blsProof} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(blsProof, 15, 15)}</div>
                    <CopyButton text={blsProof} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              );
            },
          }),
        ]),
  ];
  return (
    <div className="col-span-12 flex flex-col gap-0 p-0 lg:gap-0 lg:p-0">
      <Heading as="h4" className="mb-2 lg:mb-4">
        General Info
      </Heading>
      <ReactTable
        data={[{ blsKey, blsProof, nodeId }]}
        isLoading={false}
        columns={nodeTableColumn}
        classNames={{
          table: "table-auto lg:table-fixed",
        }}
      />
    </div>
  );
};

export default GeneralInfo;
