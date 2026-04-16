"use client";
import React from "react";
import { useParams } from "next/navigation";
import { IconPlus, IconMinus } from "@zeeve-platform/icons/essential/outline";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from "@zeeve-platform/ui";
import TransactionPoolAccordion from "./transaction-pool-accordion";
import ExperimentalFeaturesAccordion from "./experimental-features-accordion";
import ObserverAccordion from "./observer-accordion";
import { NodeConfigurationSchemaType } from "./schema";
import OpentelemetryAccordion from "./opentelemetry-accordion";
import { useConfigStore } from "@/store/config";

interface OthersAccordionProps {
  prefilledValues: NodeConfigurationSchemaType | null;
}

const OthersAccordion = ({ prefilledValues }: OthersAccordionProps) => {
  const params = useParams();
  const networkId = params.id as string;
  const config = useConfigStore((state) => state.config);
  return (
    <Accordion>
      <AccordionItem>
        <AccordionHeader className="font-semibold" iconCollapsed={<IconPlus />} iconExpanded={<IconMinus />}>
          Others
        </AccordionHeader>
        <AccordionBody>
          <div className="flex flex-col gap-2 p-3 lg:gap-4 lg:p-6">
            {config?.nodeConfig?.opentelemetryEnabledNetworkIds.includes(networkId) && (
              <OpentelemetryAccordion prefilledValues={prefilledValues} />
            )}
            <TransactionPoolAccordion />
            <ExperimentalFeaturesAccordion prefilledValues={prefilledValues} />
            <ObserverAccordion prefilledValues={prefilledValues} />
          </div>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default OthersAccordion;
