"use client";
import { RadioCard } from "@zeeve-platform/ui-common-components";
import { forwardRef } from "react";

interface RadioItemCardProps extends React.ComponentProps<typeof RadioCard> {
  text: string;
  icon: JSX.Element;
  description: string;
  showDescription?: boolean;
}

const RadioItemCard = forwardRef<HTMLInputElement, RadioItemCardProps>((props, ref) => {
  const { text, icon, description, showDescription = false, ...rest } = props;

  return (
    <RadioCard className="col-span-12 h-auto p-4 md:col-span-12" ref={ref} {...rest}>
      <div className="flex flex-row items-center gap-3">
        <div className="rounded-lg p-2 bg-brand-gradient-10">{icon}</div>
        <div className="flex-col items-start justify-start">
          <div className="text-base font-semibold capitalize tracking-tight">{text}</div>
          {showDescription ? <p className="text-xs text-brand-gray">{description}</p> : null}
        </div>
      </div>
    </RadioCard>
  );
});

RadioItemCard.displayName = "RadioItemCard";
export default RadioItemCard;
