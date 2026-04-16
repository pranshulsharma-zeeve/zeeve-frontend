"use client";
import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Input } from "@zeeve-platform/ui";
import { IconPlus, IconMinus } from "@zeeve-platform/icons/essential/outline";
import { useFormContext } from "react-hook-form";
import { NodeConfigurationSchemaType } from "./schema";
import { FormField } from "@/components/form-field";

const tooltips = {
  max_nb_blocks: "Maximum number of blocks kept in the log.",
  max_nb_logs: "Maximum number of logs kept.",
  chunk_size:
    "Blocks to be filtered are split in chunks, which will be filtered in sequence. Within each chunk, the block filtering is done concurrently.",
};

const LogFilterAccordion = () => {
  const [expand, setExpand] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
  } = useFormContext<NodeConfigurationSchemaType>();

  return (
    <Accordion>
      <AccordionItem isExpanded={expand} onClick={() => setExpand(!expand)}>
        <AccordionHeader className="font-semibold" iconCollapsed={<IconPlus />} iconExpanded={<IconMinus />}>
          Log Filter
        </AccordionHeader>
        <AccordionBody>
          <div className="grid grid-cols-12 items-start gap-3 p-2 lg:gap-6 lg:p-4">
            {/* max_nb_blocks */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.log_filter?.max_nb_blocks?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("log_filter.max_nb_blocks", {
                  valueAsNumber: true,
                })}
                step="1"
                min={"0"}
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
                  labelText: "max nb blocks",
                }}
                isRequired
                tooltip={tooltips.max_nb_blocks}
              />
            </FormField>
            {/* max_nb_logs */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.log_filter?.max_nb_logs?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("log_filter.max_nb_logs", {
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
                  labelText: "max nb logs",
                }}
                isRequired
                tooltip={tooltips.max_nb_logs}
              />
            </FormField>
            {/* chunk_size */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-4"
              helper={{
                status: "error",
                text: errors.log_filter?.chunk_size?.message?.toString(),
              }}
            >
              <Input
                type="number"
                {...register("log_filter.chunk_size", {
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
                  labelText: "chunk size",
                }}
                isRequired
                tooltip={tooltips.chunk_size}
              />
            </FormField>
          </div>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default LogFilterAccordion;
