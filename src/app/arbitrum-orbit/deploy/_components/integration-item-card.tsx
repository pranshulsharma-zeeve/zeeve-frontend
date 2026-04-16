"use client";
import { SwitchProps, Tooltip, tx } from "@zeeve-platform/ui";
import { forwardRef } from "react";
import Image from "next/image";
import { Z4RadioCard } from "@zeeve-platform/ui-common-components";
import { toCapitalize, withBasePath } from "@orbit/utils/helpers";
import { getPartnerIconPath } from "@orbit/constants/partner-icons";

interface IntegrationItemCardProps extends SwitchProps {
  text: string;
  icon: JSX.Element;
  isDisabled?: boolean;
  description: string;
  partners?: string[];
}

const IntegrationItemCard = forwardRef<HTMLInputElement, IntegrationItemCardProps>((props, ref) => {
  const { text, icon, isDisabled, description, partners, isChecked, ...rest } = props;

  return (
    // <Card className="gap-3 border bg-brand-light p-3 text-brand-dark hover:border-brand-teal lg:gap-3 lg:p-6">
    //   <div className="flex flex-row  justify-between">
    //     <div className="flex flex-row items-center gap-3">
    //       <div className="rounded-lg p-3 bg-brand-gradient-10">{icon}</div>
    //       <div>
    //         <div className="text-base font-semibold tracking-tight">{text}</div>
    //         <p className="text-xs text-brand-gray">{description}</p>
    //       </div>
    //     </div>
    //     <Switch ref={ref} isDisabled={isDisabled} {...rest} />
    //   </div>
    //   {partners && partners.length !== 0 ? (
    //     <div className="flex flex-row items-center gap-3">
    //       <div className="animate-pulse text-xs font-semibold text-brand-gray">AVAILABLE</div>
    //       {partners.map((partner, index) => (
    //         <Tooltip key={index} text={toCapitalize(partner)} placement="top-start">
    //           <Image
    //             key={index}
    //             src={withBasePath(`/assets/images/partners/${partner}.png`)}
    //             alt={partner}
    //             width={24}
    //             height={24}
    //           />
    //         </Tooltip>
    //       ))}
    //     </div>
    //   ) : null}
    // </Card>

    <Z4RadioCard
      {...rest}
      ref={ref}
      size="medium"
      className={tx("bg-white", rest.className)}
      colorScheme={"blue"}
      isDisabled={isDisabled}
      isChecked={isChecked ?? false}
    >
      <div className="flex flex-row items-center gap-3">
        {icon ? <div className="flex size-8 items-center justify-center text-lg text-brand-dark">{icon}</div> : null}
        {partners?.map((partner, index) => (
          <Tooltip key={index} text={toCapitalize(partner)} placement="top-start">
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-full border bg-[#EFEFEF] ">
              <Image
                className=""
                key={index}
                src={withBasePath(getPartnerIconPath(partner))}
                alt={partner}
                width={14}
                height={14}
              />
            </div>
          </Tooltip>
        ))}
        <Tooltip text={description} placement="top-start">
          <span>{text}</span>
        </Tooltip>
      </div>
    </Z4RadioCard>
  );
});

IntegrationItemCard.displayName = "IntegrationItemCard";
export default IntegrationItemCard;
