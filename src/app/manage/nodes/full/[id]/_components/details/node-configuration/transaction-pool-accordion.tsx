"use client";
import React, { useState } from "react";
import { IconPlus, IconMinus } from "@zeeve-platform/icons/essential/outline";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Input } from "@zeeve-platform/ui";
import { useFormContext } from "react-hook-form";
import { NodeConfigurationSchemaType } from "./schema";
import { FormField } from "@/components/form-field";

const tooltips = {
  // tx_pool_timeout_limit: "Transaction timeout limit inside the transaction pool (in seconds).",
  // tx_pool_addr_limit: "Maximum allowed addresses inside the transaction pool.",
  // tx_pool_tx_per_addr_limit: "Maximum allowed transactions per user address inside the transaction pool.",
  max_size: "Total number of transactions the mempool can hold",
  max_lifespan: "Time in seconds before a transaction expires",
  tx_per_addr_limit: "Maximum allowed transactions per user address",
};

const TransactionPoolAccordion = () => {
  const [expand, setExpand] = useState<boolean>(true);

  const {
    register,
    formState: { errors },
  } = useFormContext<NodeConfigurationSchemaType>();

  return (
    <Accordion>
      <AccordionItem isExpanded={expand} onClick={() => setExpand(!expand)}>
        <AccordionHeader className="font-semibold" iconCollapsed={<IconPlus />} iconExpanded={<IconMinus />}>
          Transaction Pool
        </AccordionHeader>
        <AccordionBody>
          <div className="grid grid-cols-12 items-start gap-3 p-3 lg:gap-6 lg:p-6">
            {/* tx_pool_timeout_limit */}
            {/* <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.tx_pool_timeout_limit?.message?.toString(),
              }}
            >
              <Input
                type="number"
                step="1"
                min={"0"}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // block negative sign and scientific notation
                  }
                }}
                placeholder="0"
                {...register("tx_pool_timeout_limit")}
                floatingLabel={{
                  labelText: "Txn pool timeout limit",
                }}
                isRequired
                tooltip={tooltips.tx_pool_timeout_limit}
              />
            </FormField> */}
            {/* tx_pool_addr_limit */}
            {/* <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.tx_pool_addr_limit?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("tx_pool_addr_limit")}
                step="1"
                min={"0"}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // block negative sign and scientific notation
                  }
                }}
                placeholder="0"
                floatingLabel={{
                  labelText: "Txn pool address limit",
                }}
                isRequired
                tooltip={tooltips.tx_pool_addr_limit}
              />
            </FormField> */}
            {/* tx_pool_tx_per_addr_limit */}
            {/* <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.tx_pool_tx_per_addr_limit?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("tx_pool_tx_per_addr_limit")}
                step="1"
                min={"0"}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // block negative sign and scientific notation
                  }
                }}
                placeholder="0"
                floatingLabel={{
                  labelText: "Txn pool txn per address limit",
                }}
                isRequired
                tooltip={tooltips.tx_pool_tx_per_addr_limit}
              />
            </FormField> */}
            {/* max_size */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.tx_pool?.max_size?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("tx_pool.max_size", {
                  valueAsNumber: true,
                })}
                step="1"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // block decimals, negative sign and scientific notation
                  }
                }}
                onInput={(e) => {
                  // Remove leading zeros except for exactly "0"
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/^0+(?=\d)/, "");
                }}
                placeholder="0"
                floatingLabel={{
                  labelText: "max size",
                }}
                isRequired
                tooltip={tooltips.max_size}
              />
            </FormField>
            {/* max_lifespan */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.tx_pool?.max_lifespan?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("tx_pool.max_lifespan", {
                  valueAsNumber: true,
                })}
                step="1"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // block decimals, negative sign and scientific notation
                  }
                }}
                onInput={(e) => {
                  // Remove leading zeros except for exactly "0"
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/^0+(?=\d)/, "");
                }}
                placeholder="0"
                floatingLabel={{
                  labelText: "max lifespan",
                }}
                isRequired
                tooltip={tooltips.max_lifespan}
              />
            </FormField>
            {/* tx_per_addr_limit */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.tx_pool?.tx_per_addr_limit?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("tx_pool.tx_per_addr_limit")}
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // block decimals, negative sign and scientific notation
                  }
                }}
                onInput={(e) => {
                  // Remove leading zeros except for exactly "0"
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/^0+(?=\d)/, "");
                }}
                placeholder="0"
                floatingLabel={{
                  labelText: "txn per address limit",
                }}
                isRequired
                tooltip={tooltips.tx_per_addr_limit}
              />
            </FormField>
          </div>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default TransactionPoolAccordion;
