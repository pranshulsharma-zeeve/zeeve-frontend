import React, { useEffect, useState } from "react";
import { Spinner } from "@zeeve-platform/ui";
import { useFormContext } from "react-hook-form";
import { Heading, Input, Card, Button, FormFieldStatus } from "@zeeve-platform/ui";
import { IconChevronRightSquare } from "@zeeve-platform/icons/arrow/outline";
import { PurchaseFormSchemaType } from "../_schema/purchase-form-schema";
import { ProtocolSelectionResponseData } from "@/services/platform/protocol/protocol-selection";

interface SubscriptionCostProps {
  data: ProtocolSelectionResponseData;
  isSubmitting: boolean;
}

const SubscriptionCost: React.FC<SubscriptionCostProps> = ({ isSubmitting, data }) => {
  const [costPerNode, setCostPerNode] = useState(0);
  const [totalNode, setTotalNode] = useState(1); // Default to 1
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useFormContext<PurchaseFormSchemaType>();

  const nodeCount = watch("node.count");
  const nodeType = watch("nodeType");
  const networkType = watch("networkType");
  const continent = watch("continent");

  useEffect(() => {
    if (data && data?.pricing) {
      const costPerNode =
        (data.pricing.planPrice || 0) +
        (data.pricing.nodeType[nodeType] || 0) +
        (data.pricing.networkType[networkType] || 0) +
        (data.pricing.continentType[continent] || 0) +
        (data.pricing.cloud.managed || 0);

      setCostPerNode(costPerNode);
      const totalNodeCount = nodeCount ?? 1;
      setTotalNode(totalNodeCount);
      setDisableSubmitBtn(!isValid || totalNodeCount < 1 || totalNodeCount > 100);
    }
  }, [nodeCount, nodeType, networkType, continent, isValid, errors, data]);

  return (
    <Card className="gap-3 border border-brand-cyan p-3 text-brand-dark bg-brand-gradient-10 lg:gap-6 lg:p-6">
      <Heading as="h4">Subscription Cost</Heading>
      <div className="flex flex-col">
        <Heading as="h5">Per Node Monthly Cost (USD)</Heading>
        <p>$ {data?.pricing ? costPerNode : <Spinner />} per node</p>
      </div>
      <div className="flex flex-col gap-2 lg:gap-6">
        <div className="flex flex-col gap-1">
          <Input
            type="number"
            min={1}
            max={100}
            {...register("node.count", {
              required: "This field is required.",
              min: {
                value: 1,
                message: "Minimum value is 1",
              },
              max: {
                value: 100,
                message: "Maximum value is 100",
              },
            })}
            floatingLabel={{
              labelText: "Number of Nodes",
            }}
            defaultValue={1}
          />
          {errors.node?.count && (
            <FormFieldStatus className="text-xs lg:text-sm" status="error">
              {errors.node.count.message?.toString()}
            </FormFieldStatus>
          )}
        </div>
        <div className="flex flex-col">
          <Heading as="h5">Total Monthly Cost (USD)</Heading>
          <p>
            {totalNode} nodes (${costPerNode} per node) = ${totalNode * costPerNode}
          </p>
        </div>
        <Button
          type="submit"
          variant="solid"
          colorScheme="primary"
          className="text-sm"
          isDisabled={disableSubmitBtn}
          iconRight={<IconChevronRightSquare className="text-xl" />}
          isLoading={isSubmitting}
        >
          Subscribe Now
        </Button>
      </div>
    </Card>
  );
};

export default SubscriptionCost;
