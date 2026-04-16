import React from "react";
import { Heading, Tooltip, IconButton, Radio } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";

interface Item {
  name: string;
  value: string;
  tooltipText?: string;
  isEnabled: boolean;
}

interface RadioGroupProps {
  items: Item[];
  heading: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ items, heading }) => {
  return (
    <div className="flex flex-col gap-2 lg:gap-6">
      <Heading as="h5">{heading}</Heading>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center  lg:gap-6">
        {items.length
          ? items.map((item) => {
              return (
                <div key={item.name} className="flex flex-row content-center items-center gap-1">
                  <label>
                    <Radio className="items-center" value={item.value} isDisabled={!item.isEnabled} />
                    {item.name}
                  </label>
                  {item.tooltipText ? (
                    <Tooltip text={item.tooltipText} placement="top-start">
                      <IconButton variant="text" colorScheme="gray">
                        <IconInfoCircle className="text-base" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default RadioGroup;
