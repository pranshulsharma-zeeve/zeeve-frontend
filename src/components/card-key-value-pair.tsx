"use client";

import React from "react";
import { ButtonProps, Card, Heading, Skeleton, tx } from "@zeeve-platform/ui";

interface CardKeyValuePairProps {
  label: string | React.ReactElement;
  heading?: string | React.ReactElement;
  headingClassName?: string;
  value?: number | string | React.ReactElement;
  className?: string;
  valueClassName?: string;
  skeletonClassName?: string;
  isLoading?: boolean;
  colorScheme?: ButtonProps["colorScheme"];
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardKeyValuePair = ({
  label,
  heading,
  headingClassName,
  value,
  className,
  isLoading = false,
  colorScheme,
  valueClassName,
  skeletonClassName,
  as,
}: CardKeyValuePairProps) => {
  const bgColor = (color?: ButtonProps["colorScheme"]) => {
    return color ? `bg-brand-${color}` : "";
  };
  return (
    <Card
      className={tx(
        "col-span-12 lg:col-span-6 rounded-lg bg-brand-primary text-center text-brand-light",
        className,
        bgColor(colorScheme),
      )}
    >
      {isLoading ? (
        <Skeleton role="status" as="div" className={tx("max-w-sm", skeletonClassName)}>
          <div className="mx-auto mb-6 mt-2.5 h-3 max-w-[50px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className={"mx-auto mb-3.5 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"}></div>
        </Skeleton>
      ) : (
        <>
          {heading ? <div className={tx("text-left text-xs text-gray-200", headingClassName)}>{heading}</div> : null}
          {typeof value === "string" || typeof value === "number" || typeof value === "undefined" ? (
            <Heading className={tx("font-extrabold text-brand-light", valueClassName)} as={as ?? "h4"}>
              {value ?? "NA"}
            </Heading>
          ) : (
            value
          )}
          {typeof label === "string" ? <p className="text-sm">{label}</p> : label}
        </>
      )}
    </Card>
  );
};

export type { CardKeyValuePairProps };
export default CardKeyValuePair;
