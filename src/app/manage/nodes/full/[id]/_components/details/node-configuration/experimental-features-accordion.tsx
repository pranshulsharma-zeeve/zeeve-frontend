"use client";
import React, { useState } from "react";
import { IconPlus, IconMinus, IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Switch } from "@zeeve-platform/ui";
import { useFormContext } from "react-hook-form";
import { Tooltip } from "@zeeve-platform/ui";
import { NodeConfigurationSchemaType } from "./schema";
import { FormField } from "@/components/form-field";
interface ExperimentalFeaturesProps {
  prefilledValues: NodeConfigurationSchemaType | null;
}

const tooltips = {
  enable_websocket: "Enable websockets server when present or set to true.",
  // enable_tx_queue_max_size: "Total number of transactions the mempool can hold",
  // enable_tx_queue_max_lifespan: "Time in seconds before a transaction expires",
  // enable_tx_queue_tx_per_addr_limit: "Maximum allowed transactions per user address",
};

const ExperimentalFeaturesAccordion = ({ prefilledValues }: ExperimentalFeaturesProps) => {
  const [expand, setExpand] = useState<boolean>(true);
  const [showSpan, setShowSpan] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext<NodeConfigurationSchemaType>();

  return (
    <Accordion>
      <AccordionItem isExpanded={expand} onClick={() => setExpand(!expand)}>
        <AccordionHeader className="font-semibold" iconCollapsed={<IconPlus />} iconExpanded={<IconMinus />}>
          Experimental Features
        </AccordionHeader>
        <AccordionBody>
          <div className="grid grid-cols-12 items-start gap-3 p-3 lg:gap-6 lg:p-6">
            {/* enable_websocket */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-6"
              helper={{
                status: "error",
                text: errors.experimental_features?.enable_websocket?.message?.toString(),
              }}
            >
              <div className="flex items-center gap-x-5">
                <Tooltip text={tooltips.enable_websocket} placement="bottom-start" className="ml-20 mt-1">
                  <div className="flex items-center gap-x-1 text-brand-dark/50">
                    <span className="ml-3 text-[15px] font-medium">Enable websocket</span>
                    <IconInfoCircle className="size-3.5 cursor-pointer" />
                  </div>
                </Tooltip>
                <div
                  onMouseEnter={() => setShowSpan(true)}
                  onMouseLeave={() => setShowSpan(false)}
                  className="flex items-center gap-x-1"
                >
                  <Switch
                    {...register("experimental_features.enable_websocket")}
                    className="peer-disabled:opacity-100"
                    isDisabled
                  />
                  {showSpan && (
                    <span className="text-xs text-brand-red">
                      *Websocket is currently{" "}
                      {prefilledValues?.experimental_features.enable_websocket ? "enabled" : "disabled"}
                    </span>
                  )}
                </div>
              </div>
            </FormField>
          </div>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default ExperimentalFeaturesAccordion;
