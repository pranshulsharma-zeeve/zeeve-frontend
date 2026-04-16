import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@zeeve-platform/ui";
import { ColumnDef, NewReactTable, createColumnHelper } from "@zeeve-platform/ui-common-components";
import { format } from "date-fns";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import usePlatformService from "@/services/platform/use-platform-service";
import { convertMicroToUnit, formatDashedString, getExplorerUrl, toCapitalize, toShortString } from "@/utils/helpers";
import { formatDate } from "@/utils/date";

const TABS = ["Delegations", "Transactions"];
type ListResponseData = {
  address?: string;
  type?: string;
  amount?: string;
  transactionHash?: string;
  action?: string;
  createdAt?: string;
};

const DelegationTransaction = ({
  validatorAddress,
  nodeId,
  networkType,
  networkId,
}: {
  validatorAddress: string;
  nodeId: string;
  networkType: string;
  networkId: string;
}) => {
  const [activeTab, setActiveTab] = useState("Delegations");
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    request: { data: delegationDataRequest, isLoading: delegationLoading },
  } = usePlatformService().vizion.validatorDelegation(nodeId, networkId, validatorAddress, String(pageIndex));
  const {
    request: { data: transactionDataRequest, isLoading: transactionLoading },
  } = usePlatformService().vizion.validatorTransaction(nodeId);

  const columnHelper = createColumnHelper<ListResponseData>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegationColumns: ColumnDef<ListResponseData, any>[] = [
    columnHelper.accessor("address", {
      header: "Address",
      cell: (info) => {
        const value = info.getValue();
        return (
          <div className="flex items-center">
            {
              <div className="flex flex-col gap-1">
                {/* <span
                  className={`w-max rounded-md px-2 py-1 text-center text-xs font-normal tracking-widest text-[#09122D] ${
                    info.row.original.type === "Delegator" ? "bg-[#E3E3E3]" : "bg-[#DDE7F3]"
                  }`}
                >
                  {info.row.original.type?.toUpperCase()}
                </span> */}
                <div className="flex items-center gap-3">
                  <div className="">{value}</div>
                  <Link
                    href={`${getExplorerUrl(networkType.toLowerCase()).href}/coreum/accounts/${value}`}
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <IconArrowUpRightFromSquare color="#4864D7" width={20} height={20} className="mt-0.5" />
                    </a>
                  </Link>
                </div>
              </div>
            }
          </div>
        );
      },
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => {
        const value = convertMicroToUnit(Number(info.getValue()));
        const notation = getExplorerUrl(networkType.toLowerCase()).notation;
        return isNaN(value) ? "NA" : `${value.toLocaleString("en-US")} ${toCapitalize(notation)}`;
      },
    }),
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transactionColumns: ColumnDef<ListResponseData, any>[] = [
    columnHelper.accessor("transactionHash", {
      header: "Transaction Hash",
      cell: (info) => {
        const value = info.getValue();
        return (
          <div className="flex items-center">
            {value.length ? (
              <>
                <div className="mr-2">{toShortString(value, 15, 5)}</div>
                <Link
                  href={`${getExplorerUrl(networkType.toLowerCase()).href}/coreum/transactions/${value}`}
                  passHref
                  legacyBehavior
                >
                  <a target="_blank" rel="noopener noreferrer">
                    <IconArrowUpRightFromSquare color="#4864D7" width={20} height={20} />
                  </a>
                </Link>
              </>
            ) : (
              value
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => (info.getValue() ? formatDashedString(info.getValue()) : "NA"),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate) return "NA";
        const date = new Date(rawDate);
        return formatDate(date);
      },
    }),
  ];

  // Determine which tab’s data & columns to show
  const columns = activeTab === "Delegations" ? delegationColumns : transactionColumns;
  const data = useMemo(() => {
    if (activeTab === "Delegations") {
      const raw = delegationDataRequest?.data?.delegation_responses || [];
      return raw.map((item) => ({
        address: item.delegation.delegator_address,
        type: "Delegator",
        amount: item.balance.amount,
      }));
    } else {
      return (
        transactionDataRequest?.data?.map((item) => ({
          transactionHash: item.details.txhash,
          action: item.action,
          createdAt: item.created_at,
        })) || []
      );
    }
  }, [activeTab, delegationDataRequest, transactionDataRequest]);
  const currentData = data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  const isLoading = activeTab === "Delegations" ? delegationLoading : transactionLoading;
  return (
    <Card className="col-span-10 flex flex-col gap-3 overflow-hidden lg:gap-6">
      <span className="text-xl font-medium text-[#09122D]">Validator Activity</span>

      {/* Tabs */}
      <div className="flex border-b border-[#E1E1E1]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPagination({ pageIndex: 0, pageSize });
            }}
            className={`mr-6 pb-2 text-base font-medium ${
              activeTab === tab ? "border-b-2 border-[#4054B2] text-[#4054B2]" : "text-[#696969]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Table */}
      <NewReactTable
        data={currentData}
        columns={columns}
        isLoading={isLoading}
        classNames={{
          table: "table-auto lg:table-fixed",
        }}
        pagination={{
          pageSizes: [5, 10, 20, 50, 100],
          pageCount: Math.ceil(data.length / pageSize),
          pageIndex,
          pageSize,
          setPagination,
        }}
      />
    </Card>
  );
};

export default DelegationTransaction;
