"use client";
import React from "react";
import { CopyButton, Heading, Tooltip } from "@zeeve-platform/ui";
import { createColumnHelper, ColumnDef, ReactTable } from "@zeeve-platform/ui-common-components";
import { toShortString } from "@/utils/helpers";

interface EVMInfoProps {
  owner?: string;
  signer?: string;
  validatorId?: string;
}

const EvmInfo = ({ owner, signer, validatorId }: EVMInfoProps) => {
  const columnHelper = createColumnHelper<EVMInfoProps>();
  // table columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeTableColumn: ColumnDef<EVMInfoProps, any>[] = [
    columnHelper.accessor("validatorId", {
      header: "Validator ID",
      cell: (info) => {
        return validatorId ? (
          <Tooltip text={validatorId} placement="top-start">
            <div className="flex items-center">
              <div className="mr-2">{toShortString(validatorId, 15, 15)}</div>
              <CopyButton text={validatorId} />
            </div>
          </Tooltip>
        ) : (
          "NA"
        );
      },
    }),
    columnHelper.accessor("owner", {
      header: "Owner",
      cell: (info) => {
        return owner ? (
          <Tooltip text={owner} placement="top-start">
            <div className="flex items-center">
              <div className="mr-2">{toShortString(owner, 15, 15)}</div>
              <CopyButton text={owner} />
            </div>
          </Tooltip>
        ) : (
          "NA"
        );
      },
    }),
    columnHelper.accessor("signer", {
      header: "Signer",
      cell: (info) => {
        return signer ? (
          <Tooltip text={signer} placement="top-start">
            <div className="flex items-center">
              <div className="mr-2">{toShortString(signer, 15, 15)}</div>
              <CopyButton text={signer} />
            </div>
          </Tooltip>
        ) : (
          "NA"
        );
      },
    }),
  ];
  return (
    <div className="col-span-12 flex flex-col gap-0 p-0 lg:gap-0 lg:p-0">
      <Heading as="h4" className="mb-2 lg:mb-4">
        General Info
      </Heading>
      <ReactTable
        data={[{ validatorId, owner, signer }]}
        isLoading={false}
        columns={nodeTableColumn}
        classNames={{
          table: "table-auto lg:table-fixed",
        }}
      />
    </div>
  );
};

export default EvmInfo;
