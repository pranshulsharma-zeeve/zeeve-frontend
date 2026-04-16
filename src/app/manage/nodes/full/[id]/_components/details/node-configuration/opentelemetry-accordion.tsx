"use client";
import React, { useEffect, useState } from "react";
import { IconPlus, IconMinus, IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Input, Switch, Tooltip } from "@zeeve-platform/ui";
import { useFormContext } from "react-hook-form";
import { NodeConfigurationSchemaType } from "./schema";
import { FormField } from "@/components/form-field";

const tooltips = {
  enable: "Turns OpenTelemetry data export on or off.",
  environment: "Labels telemetry data with environment name (e.g., mainnet/testnet).",
  url_traces: "Destination URL for sending trace data.",
  url_logs: "Destination URL for sending log data.",
  batch_traces: "Max number of traces per send batch.",
  batch_logs: "Max number of logs per send batch.",
  batch_timeout_ms: "Max wait time before flushing a telemetry batch.",
  instance_id: "Unique identifier for this node instance.",
};

interface OpentelemetryProps {
  prefilledValues: NodeConfigurationSchemaType | null;
}

const OpentelemetryAccordion = ({ prefilledValues }: OpentelemetryProps) => {
  const [expand, setExpand] = useState<boolean>(true);

  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<NodeConfigurationSchemaType>();

  const watchOpentelemetryEnabled = watch("opentelemetry.enable");

  useEffect(() => {
    if (watchOpentelemetryEnabled === false) {
      // Reset specific opentelemetry form fields when toggle is disabled
      setValue("opentelemetry.environment", prefilledValues?.opentelemetry?.environment ?? null);
      setValue("opentelemetry.url_traces", prefilledValues?.opentelemetry?.url_traces ?? "");
      setValue("opentelemetry.url_logs", prefilledValues?.opentelemetry?.url_logs ?? "");
      setValue("opentelemetry.batch_traces", prefilledValues?.opentelemetry?.batch_traces ?? 400);
      setValue("opentelemetry.batch_logs", prefilledValues?.opentelemetry?.batch_logs ?? 400);
      setValue("opentelemetry.batch_timeout_ms", prefilledValues?.opentelemetry?.batch_timeout_ms ?? 500);
      setValue("opentelemetry.instance_id", prefilledValues?.opentelemetry?.instance_id ?? "");
    }
  }, [watchOpentelemetryEnabled, setValue, prefilledValues]);

  return (
    <Accordion>
      <AccordionItem isExpanded={expand} onClick={() => setExpand(!expand)}>
        <AccordionHeader className="font-semibold" iconCollapsed={<IconPlus />} iconExpanded={<IconMinus />}>
          Opentelemetry
        </AccordionHeader>
        <AccordionBody>
          <div className="grid grid-cols-12 items-start gap-3 p-3 lg:gap-6 lg:p-6">
            {/* enable */}
            <FormField
              className="col-span-12 md:col-span-12 lg:col-span-12"
              helper={{
                status: "error",
                text: errors.observer?.rollup_node_tracking?.message?.toString(),
              }}
            >
              <div className="flex items-center gap-x-5">
                <Tooltip text={tooltips.enable} placement="bottom-start" className="ml-20 mt-1">
                  <div className="flex items-center gap-x-1 text-brand-dark/50">
                    <span className="ml-3 text-[15px] font-medium">Enable</span>
                    <IconInfoCircle className="size-3.5 cursor-pointer" />
                  </div>
                </Tooltip>
                <div
                  // onMouseEnter={() => setShowSpan(true)}
                  // onMouseLeave={() => setShowSpan(false)}
                  className="flex items-center gap-x-1"
                >
                  <Switch {...register("opentelemetry.enable")} className="" isChecked={watchOpentelemetryEnabled} />
                  {/* {showSpan && (
                    <span className="text-xs text-brand-red">
                      *Rollup Node Tracking is currently{" "}
                      {prefilledValues?.observer.rollup_node_tracking ? "enabled" : "disabled"}
                    </span>
                  )} */}
                </div>
              </div>
            </FormField>
            {watchOpentelemetryEnabled && (
              <>
                {/* environment */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.environment?.message?.toString(),
                  }}
                >
                  <Input
                    type="string"
                    {...register("opentelemetry.environment", {
                      setValueAs: (value) => {
                        if (value === undefined || value === null || value === "") {
                          return null;
                        }
                        return value;
                      },
                    })}
                    floatingLabel={{
                      labelText: "environment",
                    }}
                    tooltip={tooltips.environment}
                  />
                </FormField>
                {/* url_traces */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.url_traces?.message?.toString(),
                  }}
                >
                  <Input
                    type="string"
                    {...register("opentelemetry.url_traces")}
                    floatingLabel={{
                      labelText: "url traces",
                    }}
                    isRequired
                    tooltip={tooltips.url_traces}
                  />
                </FormField>
                {/* url_logs */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.url_logs?.message?.toString(),
                  }}
                >
                  <Input
                    type="string"
                    {...register("opentelemetry.url_logs")}
                    floatingLabel={{
                      labelText: "url logs",
                    }}
                    isRequired
                    tooltip={tooltips.url_logs}
                  />
                </FormField>
                {/* batch_traces */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.batch_traces?.message?.toString(),
                  }}
                >
                  <Input
                    type="number"
                    {...register("opentelemetry.batch_traces", {
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
                      labelText: "batch traces",
                    }}
                    isRequired
                    tooltip={tooltips.batch_traces}
                  />
                </FormField>
                {/* batch_logs */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.batch_logs?.message?.toString(),
                  }}
                >
                  <Input
                    type="number"
                    {...register("opentelemetry.batch_logs", {
                      valueAsNumber: true,
                    })}
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
                      labelText: "batch logs",
                    }}
                    isRequired
                    tooltip={tooltips.batch_logs}
                  />
                </FormField>
                {/* batch_timeout_ms */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.batch_timeout_ms?.message?.toString(),
                  }}
                >
                  <Input
                    type="number"
                    {...register("opentelemetry.batch_timeout_ms", {
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
                      labelText: "batch timeout ms",
                    }}
                    isRequired
                    tooltip={tooltips.batch_timeout_ms}
                  />
                </FormField>
                {/* instance_id */}
                <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{
                    status: "error",
                    text: errors.opentelemetry?.instance_id?.message?.toString(),
                  }}
                >
                  <Input
                    type="string"
                    {...register("opentelemetry.instance_id")}
                    floatingLabel={{
                      labelText: "instance id",
                    }}
                    isRequired
                    tooltip={tooltips.instance_id}
                  />
                </FormField>
              </>
            )}
          </div>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default OpentelemetryAccordion;
