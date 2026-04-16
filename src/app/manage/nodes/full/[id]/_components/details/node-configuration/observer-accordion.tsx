"use client";
import React, { useState } from "react";
import { IconPlus, IconMinus, IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Input, Switch, Tooltip } from "@zeeve-platform/ui";
import { useFormContext } from "react-hook-form";
import { NodeConfigurationSchemaType } from "./schema";
import { FormField } from "@/components/form-field";
interface ObserverProps {
  prefilledValues: NodeConfigurationSchemaType | null;
}

const tooltips = {
  observer_rollup_node_tracking:
    "Disable tracking the head of the rollup node. Tracking the state of a rollup node allows to confirm the blocks received from the upstream EVM node.",
  finalized_view:
    "If the flag is set, the node will use the latest final state of the rollup, not its current HEAD, for any read-only operation.",
};

const ObserverAccordion = ({ prefilledValues }: ObserverProps) => {
  const [expand, setExpand] = useState<boolean>(true);
  const [showSpan, setShowSpan] = useState(false);
  const [showSpanInFinalizedView, setShowSpanInFinalizedView] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext<NodeConfigurationSchemaType>();

  return (
    <Accordion>
      <AccordionItem isExpanded={expand} onClick={() => setExpand(!expand)}>
        <AccordionHeader className="font-semibold" iconCollapsed={<IconPlus />} iconExpanded={<IconMinus />}>
          Extras
        </AccordionHeader>
        <AccordionBody>
          <div className="grid grid-cols-12 items-start gap-3 p-3 lg:gap-6 lg:p-6">
            {/* evm_node_endpoint */}
            {/* <FormField
                            className="col-span-12 md:col-span-6 lg:col-span-4"
                            helper={{
                                status: "error",
                                text: errors.syncronizer?.syncInterval?.message?.toString(),
                            }}
                        >
                            <Input
                                type="text"
                                {...register("syncronizer.syncInterval")}
                                placeholder="Format expected - 1h15m30s500ms"
                                floatingLabel={{
                                    labelText: "Enable txn queue max size",
                                }}
                                isRequired
                                tooltip={tooltips.syncInterval}
                            />
                        </FormField> */}
            {/*observer_rollup_node_tracking */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-6"
              helper={{
                status: "error",
                text: errors.observer?.rollup_node_tracking?.message?.toString(),
              }}
            >
              <div className="flex items-center gap-x-5">
                <Tooltip text={tooltips.observer_rollup_node_tracking} placement="bottom-start" className="ml-20 mt-1">
                  <div className="flex items-center gap-x-1 text-brand-dark/50">
                    <span className="ml-3 text-[15px] font-medium"> Rollup Node Tracking</span>
                    <IconInfoCircle className="size-3.5 cursor-pointer" />
                  </div>
                </Tooltip>
                <div
                  onMouseEnter={() => setShowSpan(true)}
                  onMouseLeave={() => setShowSpan(false)}
                  className="flex items-center gap-x-1"
                >
                  <Switch
                    {...register("observer.rollup_node_tracking")}
                    className="peer-disabled:opacity-100"
                    isDisabled
                  />
                  {showSpan && (
                    <span className="text-xs text-brand-red">
                      *Rollup Node Tracking is currently{" "}
                      {prefilledValues?.observer.rollup_node_tracking ? "enabled" : "disabled"}
                    </span>
                  )}
                </div>
              </div>
            </FormField>
            {/* finalized_view */}
            <FormField
              className="col-span-12 md:col-span-6 lg:col-span-6"
              helper={{
                status: "error",
                text: errors.finalized_view?.message?.toString(),
              }}
            >
              <div className="flex items-center gap-x-5">
                <Tooltip text={tooltips.finalized_view} placement="bottom-start" className="ml-20 mt-1">
                  <div className="flex items-center gap-x-1 text-brand-dark/50">
                    <span className="ml-3 text-[15px] font-medium">Finalized view</span>
                    <IconInfoCircle className="size-3.5 cursor-pointer" />
                  </div>
                </Tooltip>
                <div
                  onMouseEnter={() => setShowSpanInFinalizedView(true)}
                  onMouseLeave={() => setShowSpanInFinalizedView(false)}
                  className="flex items-center gap-x-1"
                >
                  <Switch {...register("finalized_view")} className="peer-disabled:opacity-100" isDisabled />
                  {showSpanInFinalizedView && (
                    <span className="text-xs text-brand-red">
                      *Finalized view is currently {prefilledValues?.finalized_view ? "enabled" : "disabled"}
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

export default ObserverAccordion;
